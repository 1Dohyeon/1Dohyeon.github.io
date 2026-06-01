# 이진 트리와 인덱스 증명 (Binary Tree & Index Proof)

힙을 배열로 구현할 때 `parent = (i-1)//2`, `left = 2*i+1` 같은 공식을 쓰는데, 왜 이 공식이 성립하는지 처음에는 그냥 외웠습니다. 완전 이진 트리의 구조를 이해하면 이 공식이 자연스럽게 유도됩니다. 증명 과정과 Python 구현을 함께 정리합니다.

## 1. 이진 트리의 정의와 성질

- **이진 트리:** 모든 노드가 최대 2개의 자식 노드를 갖는 트리입니다.
- **완전 이진 트리:** 마지막 레벨을 제외하고 모든 레벨이 완전히 채워져 있으며, 마지막 레벨의 노드는 왼쪽부터 차례대로 채워진 트리입니다.
- **배열 저장 방식:** 루트 노드를 인덱스 에 저장하고, 레벨 순서(Level-order)로 빈틈없이 배열에 배치합니다.

## 2. 부모-자식 인덱스 공식 증명

**정리:** 인덱스가 $i$인 노드의 왼쪽 자식 인덱스는 $2i + 1$, 오른쪽 자식은 $2i + 2$이다.
**증명:**

1. 어떤 노드가 레벨 $d$에 위치하고, 해당 레벨에서 왼쪽에서 $k$번째( $0 \le k < 2^d$ ) 노드라고 가정하자.
2. 레벨 $d-1$까지의 총 노드 수는 $\sum_{n=0}^{d-1} 2^n = 2^d - 1$이다.
3. 따라서 노드 $i$의 인덱스는 $i = (2^d - 1) + k$로 표현된다.
4. 레벨 $d+1$은 인덱스 $2^{d+1} - 1$부터 시작한다.
5. 노드 $i$의 자식들은 레벨 $d+1$에서 각각 $2k$번째와 $2k+1$번째 위치에 온다.
6. **왼쪽 자식의 인덱스:**
   $$(2^{d+1} - 1) + 2k = 2(2^d) - 1 + 2k = 2(2^d - 1 + k) + 1 = 2i + 1$$
7. **오른쪽 자식의 인덱스:**
   $$(2^{d+1} - 1) + 2k + 1 = 2(2^d - 1 + k) + 2 = 2i + 2$$

## 3. 단말 노드(Leaf Node) 범위 증명

**정리:** 총 노드 수가 일 때, 단말 노드의 시작 인덱스는 이다.

**증명:**

1. 단말 노드는 자식이 없는 노드이다. 즉, 왼쪽 자식의 인덱스 이 전체 개수 보다 크거나 같아야 한다.
2. $2i + 1 \ge N$
3. $2i \ge N - 1$
4. $i \ge \frac{N - 1}{2}$
5. 인덱스 $i$는 정수이므로, $i \ge \lceil \frac{N-1}{2} \rceil$이며, 이는 정수 나눗셈 연산인 $i \ge \lfloor \frac{N}{2} \rfloor$와 동일한 결과를 갖는다.
   - 예: $N=5$일 때, $i \ge \lfloor 5/2 \rfloor = 2$. (인덱스 2, 3, 4가 단말 노드)
   - 예: $N=6$일 때, $i \ge \lfloor 6/2 \rfloor = 3$. (인덱스 3, 4, 5가 단말 노드)

## 4. Python으로 Binary Tree 구현

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None

    # 전위 순회 (Pre-order): Root -> Left -> Right
    def preorder(self, node):
        if node:
            print(node.data, end=' ')
            self.preorder(node.left)
            self.preorder(node.right)

    # 중위 순회 (In-order): Left -> Root -> Right
    def inorder(self, node):
        if node:
            self.inorder(node.left)
            print(node.data, end=' ')
            self.inorder(node.right)

    # 후위 순회 (Post-order): Left -> Right -> Root
    def postorder(self, node):
        if node:
            self.postorder(node.left)
            self.postorder(node.right)
            print(node.data, end=' ')

# 리스트(Array)를 이용한 완전 이진 트리 접근 방식 (인덱스 공식 활용)
def get_parent_idx(i):
    return (i - 1) // 2 if i > 0 else None

def get_left_child_idx(i, n):
    idx = 2 * i + 1
    return idx if idx < n else None

def get_right_child_idx(i, n):
    idx = 2 * i + 2
    return idx if idx < n else None
```

---

## 정리

- **공식의 근거:** 완전 이진 트리는 레벨이 넘어갈 때마다 노드 수가 배씩 증가하는 기하급수적 성질을 갖습니다.
- **효율성:** 이 공식을 통해 포인터(참조)를 위한 별도의 메모리 할당 없이 산술 연산만으로 트리 구조를 탐색할 수 있어 매우 효율적입니다.
- **응용:** 이 증명은 **힙(Heap)** 자료구조의 `sift-up`, `sift-down` 연산에서 범위를 체크하는 논리적 근거가 됩니다.
