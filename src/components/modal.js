// Управление открытием и закрытием попапов
export function handleEsc(evt) {
    if (evt.key === 'Escape') {
      const openPopup = document.querySelector('.popup_is-opened');
      if (openPopup) closeModal(openPopup);
    }
  }
  
  // Обработчик клика по оверлею — закрывает попап, если клик вне контента
  export function handleOverlay(evt) {
    if (evt.target.classList.contains('popup')) {
      closeModal(evt.target);
    }
  }
  
  // Открывает попап и подключает слушатели
  export function openModal(popup) {
    popup.classList.remove('popup_is-animated');
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEsc);
  }
  
  // Закрывает попап и отключает слушатель Escape
  export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    popup.classList.add('popup_is-animated');
    document.removeEventListener('keydown', handleEsc);
  }