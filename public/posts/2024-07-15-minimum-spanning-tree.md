# Minimum Spanning Tree (최소 스패닝 트리, MST)

모든 노드를 연결하되, 간선 가중치의 합을 최소로 만드는 트리입니다. 다익스트라가 "출발점에서 각 노드까지의 최단 거리"를 구한다면, MST는 "모든 노드를 잇는 최소 비용 구조"를 구합니다.

구현 방법은 두 가지입니다. **프림(Prim)**과 **크루스칼(Kruskal)**.

---

## 프림 알고리즘 (Prim)

현재 연결된 노드 집합에서 가장 비용이 낮은 간선을 하나씩 추가하며 확장합니다. 다익스트라와 구조가 거의 같지만, 비용 계산 방식이 다릅니다.

```python
import heapq

def prim(start):
    visited = [False] * (V + 1)
    min_heap = [(0, start)]
    total_weight = 0

    while min_heap:
        weight, node = heapq.heappop(min_heap)

        if visited[node]:
            continue

        visited[node] = True
        total_weight += weight  # 간선 자체의 비용만 더함 (누적 아님)

        for next_weight, next_node in graph[node]:
            if not visited[next_node]:
                heapq.heappush(min_heap, (next_weight, next_node))

    return total_weight
```

**다익스트라와 결정적 차이:**

```python
# 다익스트라 — 누적 거리
cost = dist + weight

# 프림 — 간선 비용만
total_weight += weight
```

다익스트라는 출발점부터 누적 거리를 추적하지만, 프림은 새로 추가하는 간선의 비용만 더합니다.

---

## 크루스칼 알고리즘 (Kruskal)

모든 간선을 비용 순으로 정렬한 뒤, 사이클이 생기지 않는 간선부터 선택합니다. 사이클 여부는 **Union-Find**로 판단합니다.

```python
def find_parent(parent, x):
    if parent[x] != x:
        parent[x] = find_parent(parent, parent[x])
    return parent[x]

def union_parent(parent, a, b):
    a = find_parent(parent, a)
    b = find_parent(parent, b)
    if a < b:
        parent[b] = a
    else:
        parent[a] = b

# 크루스칼 메인
edges.sort()
parent = [i for i in range(V + 1)]
total_weight = 0

for weight, a, b in edges:
    if find_parent(parent, a) != find_parent(parent, b):
        union_parent(parent, a, b)
        total_weight += weight
```

---

## 정리

| | 프림 (Prim) | 크루스칼 (Kruskal) |
|---|---|---|
| 핵심 전략 | 정점 기준 확장 | 간선 기준 선택 |
| 자료 구조 | 우선순위 큐 + visited | 정렬 + Union-Find |
| 유리한 상황 | 간선이 많은 밀집 그래프 | 간선이 적은 희소 그래프 |

"모든 정점을 연결"하라는 조건이 보이면 MST 문제입니다. 프림은 다익스트라를 이미 알고 있다면 구조 변형이 적어 이해하기 쉽고, 크루스칼은 구현이 직관적입니다.
