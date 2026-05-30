# 왜 Transaction이 필요하고 중요한가

팀 블로그 프로젝트를 진행하면서 가장 중요하게 생각한 부분 중 하나는 데이터 일관성입니다. 특히 팀 초대, 팀원 강퇴, 권한 위임과 같은 복잡한 비즈니스 로직에서는 여러 테이블에 대한 작업이 동시에 이루어지기 때문에, 모든 작업이 성공하거나 모든 작업이 실패해야 합니다.

이런 상황에서 데이터베이스 트랜잭션(Transaction)은 필수적인 개념입니다. 이번 글에서는 트랜잭션이 무엇인지, 왜 사용해야 하는지, 그리고 NestJS에서 어떻게 구현하는지 정리해보겠습니다.

## Transaction이란 무엇인가?

트랜잭션은 데이터베이스에서 하나의 논리적 작업 단위를 의미합니다. 여러 개의 개별 작업들을 하나로 묶어서, 모든 작업이 성공적으로 완료되거나 모든 작업이 취소되도록 보장하는 메커니즘입니다.

트랜잭션은 ACID라는 네 가지 특성을 가집니다:

-   **Atomicity(원자성)**: 트랜잭션 내의 모든 작업이 성공하거나 모든 작업이 실패해야 합니다.
-   **Consistency(일관성)**: 트랜잭션 실행 전후에 데이터베이스의 무결성 제약조건이 유지되어야 합니다.
-   **Isolation(격리성)**: 동시에 실행되는 트랜잭션들이 서로 영향을 주지 않아야 합니다.
-   **Durability(지속성)**: 성공적으로 완료된 트랜잭션의 결과는 영구적으로 저장되어야 합니다.

## 왜 Transaction을 사용해야 할까?

실제 프로젝트 경험을 바탕으로 트랜잭션이 왜 필요한지 설명해보겠습니다.

### 1. 데이터 일관성 보장

팀원 초대 기능을 예로 들어보겠습니다. 팀장이 다른 사용자를 초대하는 과정에서는 다음과 같은 작업들이 순차적으로 이루어집니다:

1. 팀 멤버 테이블에 초대 상태로 레코드 생성
2. 초대받은 사용자에게 알림 생성

만약 첫 번째 작업은 성공했지만 두 번째 작업에서 오류가 발생한다면 어떻게 될까요? 팀 멤버는 추가되었지만 알림은 생성되지 않아서, 초대받은 사용자는 자신이 초대받았다는 사실을 알 수 없게 됩니다. 알림에 초대 수락 버튼이 있는데, 이 버튼을 누르지도 못하게 되죠.

### 2. 예외 상황에서의 안전성

서비스 운영 중에는 예상치 못한 오류들이 발생할 수 있습니다. 네트워크 장애, 데이터베이스 연결 끊김, 외부 API 호출 실패 등의 상황에서도 데이터의 일관성을 유지해야 합니다.

트랜잭션을 사용하면 어떤 작업에서 오류가 발생하더라도 이전 작업들을 모두 되돌려서 데이터베이스를 원래 상태로 복구할 수 있습니다.

### 3. 비즈니스 로직의 신뢰성

복잡한 비즈니스 로직일수록 여러 테이블에 대한 작업이 함께 이루어집니다. 이때 일부 작업만 성공하고 나머지는 실패한다면, 비즈니스 로직 자체가 무의미해질 수 있습니다.

예를 들어, 팀장 권한 위임은 다음과 같은 작업을 포함합니다:

1. 기존 팀장의 권한 제거
2. 새로운 팀장의 권한 부여
3. 새로운 팀장에게 알림 전송

이 중 어느 하나라도 실패한다면 권한 위임이 제대로 이루어지지 않게 됩니다.

## NestJS에서 Transaction 사용하기

NestJS에서는 TypeORM을 활용해서 트랜잭션을 구현할 수 있습니다. 가장 기본적인 방법부터 실제 프로젝트에서 사용한 패턴까지 단계별로 살펴보겠습니다.

### 1. 기본적인 Transaction 사용

```typescript
import { DataSource } from "typeorm";

@Injectable()
export class UserService {
    constructor(private readonly dataSource: DataSource) {}

    async transferMoney(fromUserId: number, toUserId: number, amount: number) {
        return await this.dataSource.transaction(async (manager) => {
            // 1. 송금자 잔액 차감
            await manager.query("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, fromUserId]);

            // 2. 수신자 잔액 증가
            await manager.query("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, toUserId]);

            // 3. 거래 내역 기록
            await manager.query("INSERT INTO transactions (from_user_id, to_user_id, amount) VALUES (?, ?, ?)", [
                fromUserId,
                toUserId,
                amount,
            ]);
        });
    }
}
```

### 2. 여러 서비스 간 트랜잭션 공유

실제 프로젝트에서는 여러 서비스에 걸친 작업이 하나의 트랜잭션으로 처리되어야 하는 경우가 많습니다. 이때는 EntityManager를 매개변수로 전달하는 패턴을 사용합니다.

```typescript
// 메인 서비스
@Injectable()
export class TeamService {
    constructor(private readonly dataSource: DataSource, private readonly noticeService: NoticeService) {}

    async inviteTeamMember(teamId: number, memberId: number) {
        return await this.dataSource.transaction(async (manager) => {
            // 1. 팀 멤버 추가
            await manager.getRepository(TeamMember).save({
                teamId,
                memberId,
                status: "INVITED",
            });

            // 2. 알림 생성 (같은 트랜잭션 내에서)
            await this.noticeService.createInviteNoticeWithTransaction(
                memberId,
                teamId,
                manager // EntityManager 전달 (중요!)
            );
        });
    }
}

// 알림 서비스
@Injectable()
export class NoticeService {
    async createInviteNoticeWithTransaction(
        userId: number,
        teamId: number,
        manager: EntityManager // 트랜잭션 매니저 받음
    ) {
        return await manager.getRepository(Notice).save({
            userId,
            type: "TEAM_INVITE",
            content: "팀에 초대되었습니다.",
            relatedId: teamId,
        });
    }
}
```

### 3. QueryRunner를 사용한 트랜잭션

더 세밀한 제어가 필요한 경우에는 QueryRunner를 직접 사용할 수 있습니다.

```typescript
async delegateLeader(teamId: number, currentLeaderId: number, newLeaderId: number) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. 기존 팀장 권한 제거
    await queryRunner.manager.update(
      TeamMember,
      { teamId, memberId: currentLeaderId },
      { isLeader: false }
    );

    // 2. 새로운 팀장 권한 부여
    await queryRunner.manager.update(
      TeamMember,
      { teamId, memberId: newLeaderId },
      { isLeader: true }
    );

    // 3. 알림 생성
    await queryRunner.manager.save(Notice, {
      userId: newLeaderId,
      type: 'LEADER_DELEGATED',
      content: '팀장으로 위임되었습니다.'
    });

    await queryRunner.commitTransaction();
    return true;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
```

## 트랜잭션 사용 시 주의사항

### 1. 트랜잭션 범위 최소화

트랜잭션은 가능한 한 짧게 유지해야 합니다. 긴 트랜잭션은 데이터베이스 락을 오래 유지하여 성능에 악영향을 줄 수 있습니다.

### 2. 외부 API 호출 제외

트랜잭션 내에서는 외부 API 호출이나 파일 시스템 작업 등 데이터베이스와 관련 없는 작업은 피해야 합니다. 이런 작업들은 실패 시 롤백되지 않기 때문입니다.

### 3. 에러 처리

트랜잭션에서 발생하는 모든 에러를 적절히 처리하고, 필요한 경우 명시적으로 롤백을 수행해야 합니다.

## 마무리

트랜잭션은 데이터베이스를 사용하는 애플리케이션에서 반드시 고려해야 할 중요한 개념입니다. 특히 여러 테이블에 걸친 복잡한 비즈니스 로직을 구현할 때는 더욱 그렇습니다.

팀 블로그 프로젝트를 진행하면서 트랜잭션을 제대로 적용하지 않았던 초기에는 데이터 불일치 문제를 여러 번 경험했습니다. 하지만 트랜잭션을 체계적으로 도입한 후에는 이런 문제들이 해결되었습니다.

앞으로 새로운 기능을 개발할 때는 항상 트랜잭션의 필요성을 먼저 생각해보고, 설계해야 할 것 같습니다.
