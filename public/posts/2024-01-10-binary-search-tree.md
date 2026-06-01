# 이진 탐색 트리 (Binary Search Tree, BST)

정렬된 배열에서 이진 탐색을 하면 O(log N)이 나옵니다. 이진 탐색 트리는 이 원리를 트리 구조에 적용해 삽입·삭제도 빠르게 처리합니다. [이진 트리(Binary Tree)](/blog/2024-01-06-binary-tree)를 기반으로 하며, 탐색 성능이 트리의 균형에 따라 달라지는 이유도 함께 정리합니다.

## 1. 이진 탐색 트리의 정의와 성질

- **핵심 규칙:** 모든 노드에 대해 **'왼쪽 자식 노드 < 부모 노드 < 오른쪽 자식 노드'** 의 크기 관계를 만족합니다.
- **정렬된 상태:** 이 규칙 덕분에 트리를 **중위 순회(In-order Traversal)** 하면 모든 데이터를 오름차순으로 정렬된 리스트로 얻을 수 있습니다.
- **중복 불가:** 일반적으로 BST는 중복된 값을 허용하지 않습니다. (검색 효율을 유지하기 위함)

## 2. 시간 복잡도와 편향 트리(Skewed Tree) 문제

BST의 탐색 효율은 트리의 **높이($h$)** 에 결정됩니다.

- **평균 시간 복잡도:** 트리가 균형 잡힌 경우 $O(\log N)$입니다.
- **최악의 시간 복잡도:** 데이터가 오름차순이나 내림차순으로 삽입되어 한쪽으로 치우친 **편향 트리(Skewed Tree)** 가 될 경우, 높이가 이 되어 $O(N)$의 성능을 보입니다.
- **해결책:** 이를 방지하기 위해 스스로 균형을 잡는 **AVL 트리**나 **Red-Black 트리**가 실무에서 주로 사용됩니다.

## 3. Python으로 Binary Search Tree 구현

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, data):
        """데이터 삽입 (O(log N))"""
        if self.root is None:
            self.root = Node(data)
        else:
            # 루트부터 탐색
            self._insert_recursive(self.root, data)

    def _insert_recursive(self, node, data):
        if data < node.data:
            if node.left is None:
                node.left = Node(data)
            else:
                self._insert_recursive(node.left, data)
        elif data > node.data:
            if node.right is None:
                node.right = Node(data)
            else:
                self._insert_recursive(node.right, data)

    def search(self, data):
        """데이터 탐색 (O(log N))"""
        return self._search_recursive(self.root, data)

    def _search_recursive(self, node, data):
        if node is None or node.data == data:
            return node is not None
        
        if data < node.data:
            return self._search_recursive(node.left, data)
        return self._search_recursive(node.right, data)

    def inorder(self):
        """중위 순회: 오름차순 데이터 반환"""
        res = []
        self._inorder_recursive(self.root, res)
        return res

    def _inorder_recursive(self, node, res):
        if node:
            self._inorder_recursive(node.left, res)
            res.append(node.data)
            self._inorder_recursive(node.right, res)

```

---

## 정리

- **논리적 정렬:** BST는 '구조'보다 데이터의 '크기 관계'에 따른 배치를 중시하며, 이는 빠른 탐색을 가능하게 합니다.
- **이진 트리 vs BST:** 모든 BST는 이진 트리이지만, 모든 이진 트리가 BST인 것은 아닙니다. (BST는 크기 규칙을 만족해야 함)
- **탐색 성능:** 정렬된 배열에서의 이진 탐색(Binary Search)과 유사한 원리로 동작하며, 트리의 균형이 성능의 핵심입니다.
