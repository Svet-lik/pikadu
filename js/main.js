const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', function(event) {
  event.preventDefault;
  sidebar.classList.toggle('visible')
})