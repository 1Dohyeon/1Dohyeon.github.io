# 배열(Array)과 동적 배열(Dynamic Array)

파이썬의 `list`가 내부적으로 어떻게 동작하는지 궁금했던 적이 있었습니다. 겉으로는 단순해 보이지만, 크기가 동적으로 늘어나는 방식에는 나름의 원리가 있습니다. 정적 배열과 동적 배열의 메모리 구조 차이, 그리고 파이썬 `list`의 작동 방식을 정리합니다.

---

## 1. 메모리 구조의 차이

- **정적 배열(Static Array):** 선언 시 크기가 고정됩니다. 메모리의 연속된 공간을 점유하며, 인덱스를 통한 접근()이 매우 빠릅니다.
- **동적 배열(Dynamic Array):** 실행 중에 크기가 변할 수 있습니다. 처음 설정된 용량(Capacity)이 가득 차면, 더 큰 메모리 공간을 할당받아 기존 데이터를 복사하는 **Resizing** 과정을 거칩니다.

## 2. Dynamic Array 구현 (Python 시뮬레이션)

파이썬의 `list`가 내부적으로 어떻게 데이터를 관리하는지 모사한 클래스입니다.

```python
import ctypes

class DynamicArray:
    def __init__(self):
        self.cnt = 0          # 실제 저장된 요소 개수
        self.capacity = 1     # 현재 할당된 메모리 용량
        self.array = self._make_array(self.capacity) # 내부 배열

    def __len__(self):
        return self.cnt

    def __getitem__(self, i):
        """인덱스로 데이터 접근 (Random Access)"""
        if not 0 <= i < self.cnt:
            return IndexError("Index out of range")
        return self.array[i]

    def append(self, data):
        """데이터 추가"""
        if self.cnt == self.capacity:
            # 용량이 꽉 찼다면 2배로 늘림
            self._resize(2 * self.capacity)
        
        self.array[self.cnt] = data
        self.cnt += 1

    def _resize(self, new_capacity):
        """새로운 크기의 배열로 기존 데이터를 복사 (O(n))"""
        new_array = self._make_array(new_capacity)
        for i in range(self.cnt):
            new_array[i] = self.array[i]
        
        self.array = new_array
        self.capacity = new_capacity

    def _make_array(self, capacity):
        """ctypes를 이용해 로우 레벨 배열 생성"""
        return (capacity * ctypes.py_object)()

    def insert(self, index, data):
        """특정 위치에 데이터 삽입 (O(n))"""
        if self.cnt == self.capacity:
            self._resize(2 * self.capacity)
            
        for i in range(self.cnt, index, -1):
            self.array[i] = self.array[i-1]
            
        self.array[index] = data
        self.cnt += 1

```

---

## 정리

- **Random Access ():** 배열은 데이터가 메모리에 나란히 붙어 있습니다. 따라서 `시작 주소 + (인덱스 * 데이터 크기)` 계산만으로 원하는 위치에 즉시 접근할 수 있습니다.
- **Amortized :** 동적 배열의 `append`는 가끔 발생하는 `_resize` 때문에 $O(n)$이 걸릴 때가 있습니다. 하지만 이 비용을 여러 번의 삽입에 나누어 계산(분할 상환 분석)하면 평균적으로 $O(1)$의 성능을 보입니다.
- **삽입/삭제의 오버헤드:** 배열의 중간에 데이터를 넣거나 빼면, 그 뒤의 데이터들을 모두 한 칸씩 밀거나 당겨야 합니다. 이 작업은 $O(n)$의 시간이 소요되므로 빈번한 중간 삽입/삭제에는 연결 리스트(Linked List)가 더 유리합니다.
- **파이썬 리스트의 특징:** 파이썬 리스트는 객체에 대한 참조(Pointer)를 저장하는 배열입니다. 따라서 서로 다른 타입의 데이터를 하나의 리스트에 담을 수 있는 유연성을 가집니다.
