// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

const hamburger = document.querySelector('.hamburger');
const dropdownMenu = document.querySelector('.dropdown-menu');
const searchIcon = document.querySelector('.search-icon');
const searchBox = document.querySelector('.search-box');
const overlay = document.querySelector('.overlay');

hamburger.addEventListener('click', () => {
  dropdownMenu.classList.toggle('show');
});

searchIcon.addEventListener('click', () => {
  searchBox.classList.toggle('active');
  overlay.classList.toggle('active');
});
overlay.addEventListener('click', () => {
  searchBox.classList.remove('active');
  overlay.classList.remove('active');
})
