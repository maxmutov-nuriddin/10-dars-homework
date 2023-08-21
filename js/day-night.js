let timewWork = document.querySelectorAll('.time-work')
document.querySelector('.tumbler-wrapper').addEventListener('click', () => {
  document.body.classList.toggle('night-mode');
  for (const key of timewWork) {
    key.classList.toggle('red')
  }
});



