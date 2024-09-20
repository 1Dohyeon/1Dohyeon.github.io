// main 페이지 원과 header-menu-item을 가져옴
const mainCircle = document.querySelector(".main-circle");
const headerMenuItems = document.querySelectorAll(".header-menu-item");
const menuCirclesContainer = document.querySelector(".menu-circles");
const lineContainer = document.querySelector(".line-container");
const label = document.querySelector(".label");

// 원의 크기와 간격 정의
const circleSize = 50;
const mainCirclePosition = { x: 150, y: 150 }; // 중심 원의 좌표
const radius = 150; // 메뉴 원이 중심 원과 떨어진 거리

// 중심 원 설정
mainCircle.style.left = `${mainCirclePosition.x - circleSize / 2}px`;
mainCircle.style.top = `${mainCirclePosition.y - circleSize / 2}px`;
mainCircle.style.width = `${circleSize}px`;
mainCircle.style.height = `${circleSize}px`;

// 중심 원에 마우스를 올렸을 때 레이블 표시
mainCircle.addEventListener("mouseover", function () {
  label.textContent = mainCircle.dataset.label;
  label.style.left = `${mainCirclePosition.x - label.offsetWidth / 2 + 5}px`; // 원 중심에 맞게 좌우 정렬
  label.style.top = `${mainCirclePosition.y + circleSize - 20}px`; // 원 바로 아래에 표시
});

// 중심 원 클릭 시 index.html로 이동 (새로고침)
mainCircle.addEventListener("click", function () {
  window.location.href = "/"; // 메인 페이지로 이동 (새로고침)
});

mainCircle.addEventListener("mouseout", function () {
  label.textContent = "";
});

// 각 메뉴 원을 배치하고 선으로 연결
headerMenuItems.forEach((item, index) => {
  const angle = (index / headerMenuItems.length) * Math.PI * 2 - Math.PI / 2;
  const x = mainCirclePosition.x + radius * Math.cos(angle);
  const y = mainCirclePosition.y + radius * Math.sin(angle);

  // 메뉴 원 생성
  const circle = document.createElement("div");
  circle.classList.add("circle");
  circle.style.left = `${x - circleSize / 2}px`;
  circle.style.top = `${y - circleSize / 2}px`;
  circle.style.width = `${circleSize}px`;
  circle.style.height = `${circleSize}px`;
  circle.dataset.label = item.querySelector("a").textContent;

  // 메뉴 원에 마우스를 올렸을 때 레이블 표시
  circle.addEventListener("mouseover", function () {
    label.textContent = circle.dataset.label;
    label.style.left = `${x - label.offsetWidth / 2}px`; // 원 중심에 맞게 좌우 정렬
    label.style.top = `${y + circleSize - 20}px`; // 원 바로 아래에 표시
  });

  // 메뉴 원 클릭 시 해당 페이지로 이동
  const href = item.querySelector("a").getAttribute("href"); // a 태그의 href 속성 값 가져오기
  circle.addEventListener("click", function () {
    window.location.href = href; // 해당 경로로 이동
  });

  circle.addEventListener("mouseout", function () {
    label.textContent = "";
  });

  menuCirclesContainer.appendChild(circle);

  // 중심 원과 각 메뉴 원을 연결하는 선 생성
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", mainCirclePosition.x);
  line.setAttribute("y1", mainCirclePosition.y);
  line.setAttribute("x2", x);
  line.setAttribute("y2", y);
  line.setAttribute("stroke", "#2d2d2d");
  line.setAttribute("stroke-width", "2");
  lineContainer.appendChild(line);
});
