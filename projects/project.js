const items = document.querySelectorAll(".project-section1-content1-item");

items.forEach((item) => {
  const subList = item.querySelector(".project-section1-content1-sub-list");

  item.addEventListener("click", (event) => {
    // 'open' 클래스를 토글하여 서브리스트 열기/닫기
    item.classList.toggle("open");

    if (item.classList.contains("open")) {
      const subListHeight = subList ? subList.scrollHeight : 0;
      if (subList) subList.style.maxHeight = subListHeight + "px";
    } else {
      if (subList) subList.style.maxHeight = "0";
    }
  });

  // 서브리스트의 'li'를 클릭했을 때 'a'의 href로 이동하는 기능
  const subListItems = item.querySelectorAll(
    ".project-section1-content1-sub-list-item"
  );

  subListItems.forEach((subListItem) => {
    subListItem.addEventListener("click", (event) => {
      event.stopPropagation(); // 부모 요소의 클릭 이벤트가 발생하지 않도록 막기
      const link = subListItem.querySelector("a");
      if (link && link.href) {
        window.location.href = link.href;
      }
    });
  });
});
