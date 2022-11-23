const toggleBtn=document.querySelector(".menu_toggleBtn");
const menu=document.querySelector(".menu");

toggleBtn.addEventListener("click",()=>{

    menu.classList.toggle("active");

});