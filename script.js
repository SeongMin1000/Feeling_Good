let current = 0;
const cards = document.querySelectorAll('.card');
const nextBtn = document.getElementById('nextBtn');

function nextCard() {
  cards[current].classList.remove('active');
  current = (current + 1) % cards.length;
  cards[current].classList.add('active');
}

nextBtn.addEventListener('click', nextCard);
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextCard();
});
