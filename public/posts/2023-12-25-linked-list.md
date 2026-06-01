# 연결 리스트 (Linked List)

배열은 메모리를 연속으로 점유하기 때문에 중간 삽입·삭제가 느립니다. 연결 리스트는 이 문제를 다르게 접근합니다. 각 노드가 포인터로 연결되는 구조 덕분에 삽입·삭제가 위치를 알고 있다면 O(1)이 됩니다. 단방향·양방향·원형 연결 리스트의 구조와 배열과의 트레이드오프를 정리합니다.

---

## 1. 노드(Node)와 단방향 연결 리스트 구현

가장 기본적인 **단방향 연결 리스트(Singly Linked List)**의 구조입니다.

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        self.cnt = 0

    def append(self, data):
        """리스트의 맨 끝에 데이터 추가 (O(n))"""
        new_node = Node(data)
        if self.head is None:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        self.cnt += 1

    def insert(self, index, data):
        """특정 인덱스에 데이터 삽입 (O(n))"""
        if index <= 0:
            new_node = Node(data)
            new_node.next = self.head
            self.head = new_node
        else:
            new_node = Node(data)
            prev = self.head
            for _ in range(index - 1):
                if prev.next is None: break
                prev = prev.next
            new_node.next = prev.next
            prev.next = new_node
        self.cnt += 1

    def delete(self, data):
        """특정 데이터를 가진 노드 삭제 (O(n))"""
        current = self.head
        prev = None
        
        while current:
            if current.data == data:
                if prev:
                    prev.next = current.next
                else:
                    self.head = current.next
                self.cnt -= 1
                return True
            prev = current
            current = current.next
        return False

```

## 2. 연결 리스트의 종류

| 종류 | 특징 | 장점 | 단점 |
| --- | --- | --- | --- |
| **단방향 (Singly)** | `next` 포인터만 존재 | 메모리 소모가 가장 적음 | 이전 노드 탐색 불가 |
| **양방향 (Doubly)** | `prev`, `next` 포인터 존재 | 양방향 탐색 가능 (`deque`의 기반) | 메모리 소모가 더 큼 |
| **원형 (Circular)** | `tail`이 `head`를 가리킴 | 무한 루프 구현, 스트리밍에 적합 | 관리가 복잡 (무한 루프 주의) |

## 3. 배열(Array) vs 연결 리스트(Linked List)

| 기능 | 배열 (Array) | 연결 리스트 (Linked List) |
| --- | --- | --- |
| **접근 (Access)** |  (인덱스 사용) |  (순차 탐색) |
| **맨 앞 삽입/삭제** |  (Shift 필요) |  |
| **맨 뒤 삽입/삭제** | Amortized  |  (단, tail 포인터 있다면 ) |
| **메모리 할당** | 정적/연속적 공간 | 동적/불연속적 공간 |

---

## 정리

- **동적 크기:** 배열과 달리 미리 크기를 정할 필요가 없으며, 실행 중에 자유롭게 노드를 추가/삭제할 수 있어 메모리 효율적입니다.
- **삽입과 삭제의 효율성:** 논리적인 순서를 바꾸기 위해 데이터를 물리적으로 밀어낼 필요 없이, **포인터가 가리키는 주소만 변경**하면 됩니다. 이 작업은 위치를 알고 있다는 가정하에 $O(1)$입니다.
- **탐색의 한계:** 특정 인덱스의 데이터를 찾으려면 반드시 `head`부터 차례대로 타고 들어가야 하므로 탐색 속도가 느립니다. 따라서 데이터 접근이 빈번한 작업에는 부적합합니다.
