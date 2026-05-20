document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('privacyModal');
  const openButtons = document.querySelectorAll('.open-privacy-modal'); // ← все кнопки
  const closeButton = modal?.querySelector('.btn-test-next') || modal?.querySelector('button');


  // Проверка элементов
  if (!modal) {
    console.warn("Элемент #privacyModal не найден");
    return;
  }
  if (openButtons.length === 0) {
    console.warn("Кнопки с .open-privacy-modal не найдены");
    return;
  }

  // Открытие модального окна
  openButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  // Закрытие по кнопке "Закрыть"
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }
  
  // Закрытие по клику на подложку (фон)
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  // Закрытие по клавише Esc
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
  
  // Открытие модального окна — на всех кнопках
  openButtons.forEach(button => {
    button.addEventListener('click', function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
});
});
