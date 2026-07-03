// main.js — модальное окно конфиденциальности
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('privacyModal');
  const openBtns = document.querySelectorAll('.open-privacy-modal');
  const closeBtns = document.querySelectorAll('.close-modal, .btn-test-next');

  if (!modal) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.remove('hidden');
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
});
