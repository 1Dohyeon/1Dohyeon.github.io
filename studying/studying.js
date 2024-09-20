const items = document.querySelectorAll(".studying-section1-content1-item");

items.forEach((item) => {
  const subList = item.querySelector(".studying-section1-content1-sub-list");

  item.addEventListener("click", () => {
    item.classList.toggle("open"); // 'open' 클래스를 토글하여 서브리스트 열기/닫기

    if (item.classList.contains("open")) {
      // 서브리스트의 실제 높이를 계산하여 max-height에 동적으로 설정
      const subListHeight = subList.scrollHeight;
      subList.style.maxHeight = subListHeight + "px";
    } else {
      // 닫힐 때 max-height를 0으로 설정
      subList.style.maxHeight = "0";
    }
  });
});
