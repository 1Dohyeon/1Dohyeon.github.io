# 왜 Transaction이 필요하고 중요한가

팀 초대, 팀장 권한 위임처럼 여러 테이블을 동시에 수정하는 작업에서는 중간에 하나라도 실패했을 때 어떻게 처리할지가 중요합니다. 일부만 성공하고 나머지가 실패하면 데이터가 불일치 상태에 빠집니다.

트랜잭션(Transaction)은 이 문제를 해결합니다. **모든 작업이 성공하거나, 하나라도 실패하면 전체를 원래 상태로 되돌리는** 메커니즘입니다.

---

## ACID

트랜잭션은 네 가지 특성을 보장합니다.

- **Atomicity(원자성)**: 작업 전체가 성공하거나 전체가 실패합니다. 중간 상태는 없습니다.
- **Consistency(일관성)**: 트랜잭션 전후로 DB의 무결성 제약이 유지됩니다.
- **Isolation(격리성)**: 동시에 실행되는 트랜잭션이 서로 영향을 주지 않습니다.
- **Durability(지속성)**: 성공적으로 완료된 트랜잭션의 결과는 영구적으로 저장됩니다.

---

## 트랜잭션이 필요한 상황

### 팀원 초대

팀원 초대 과정에서 두 가지 작업이 순서대로 이루어집니다.

(1) 팀 멤버 테이블에 초대 상태로 레코드 생성
(2) 초대받은 사용자에게 알림 생성

(1)은 성공했는데 (2)에서 오류가 발생하면 팀 멤버는 추가됐지만 알림은 없는 상태가 됩니다. 알림에 초대 수락 버튼이 있다면, 사용자는 수락 자체를 할 수 없게 됩니다.

### 팀장 권한 위임

(1) 기존 팀장의 권한 제거
(2) 새로운 팀장의 권한 부여
(3) 새로운 팀장에게 알림 전송

(1)만 성공하고 (2)가 실패하면 팀장이 없는 상태가 됩니다. 트랜잭션 없이는 이런 부분적 실패를 안전하게 처리할 수 없습니다.

---

## NestJS + TypeORM에서 트랜잭션 구현

### 기본: dataSource.transaction()

```typescript
import { DataSource } from "typeorm";

@Injectable()
export class UserService {
    constructor(private readonly dataSource: DataSource) {}

    async transferMoney(fromUserId: number, toUserId: number, amount: number) {
        return await this.dataSource.transaction(async (manager) => {
            await manager.query(
                "UPDATE users SET balance = balance - ? WHERE id = ?",
                [amount, fromUserId]
            );
            await manager.query(
                "UPDATE users SET balance = balance + ? WHERE id = ?",
                [amount, toUserId]
            );
            await manager.query(
                "INSERT INTO transactions (from_user_id, to_user_id, amount) VALUES (?, ?, ?)",
                [fromUserId, toUserId, amount]
            );
        });
    }
}
```

`dataSource.transaction()`은 콜백 내부에서 오류가 발생하면 자동으로 롤백합니다.

### 여러 서비스 간 트랜잭션 공유

서비스가 분리되어 있을 때는 `EntityManager`를 파라미터로 전달해 같은 트랜잭션을 공유합니다.

```typescript
@Injectable()
export class TeamService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly noticeService: NoticeService
    ) {}

    async inviteTeamMember(teamId: number, memberId: number) {
        return await this.dataSource.transaction(async (manager) => {
            await manager.getRepository(TeamMember).save({
                teamId,
                memberId,
                status: "INVITED",
            });

            // 같은 트랜잭션 내에서 알림 생성
            await this.noticeService.createInviteNotice(memberId, teamId, manager);
        });
    }
}

@Injectable()
export class NoticeService {
    async createInviteNotice(userId: number, teamId: number, manager: EntityManager) {
        return await manager.getRepository(Notice).save({
            userId,
            type: "TEAM_INVITE",
            content: "팀에 초대되었습니다.",
            relatedId: teamId,
        });
    }
}
```

### 세밀한 제어가 필요할 때: QueryRunner

```typescript
async delegateLeader(teamId: number, currentLeaderId: number, newLeaderId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        await queryRunner.manager.update(
            TeamMember,
            { teamId, memberId: currentLeaderId },
            { isLeader: false }
        );
        await queryRunner.manager.update(
            TeamMember,
            { teamId, memberId: newLeaderId },
            { isLeader: true }
        );
        await queryRunner.manager.save(Notice, {
            userId: newLeaderId,
            type: "LEADER_DELEGATED",
            content: "팀장으로 위임되었습니다.",
        });

        await queryRunner.commitTransaction();
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}
```

`QueryRunner`는 트랜잭션의 시작, 커밋, 롤백을 명시적으로 제어할 수 있어 복잡한 로직에 적합합니다.

---

## 주의사항

**트랜잭션 범위를 최소화합니다.**
트랜잭션이 오래 유지될수록 DB 락(Lock)이 길어져 성능에 영향을 줍니다. 트랜잭션 안에는 꼭 필요한 DB 작업만 넣습니다.

**외부 API 호출은 트랜잭션 밖에서 처리합니다.**
외부 API 호출이나 파일 시스템 작업은 실패해도 롤백되지 않습니다. DB 작업과 분리해서 처리해야 합니다.
