// Закрытие попапа по Escape
export function handleEsc(evt) {
  if (evt.key === 'Escape') {
    const openPopup = document.querySelector('.popup_is-opened');
    if (openPopup) {
      closeModal(openPopup);
    }
  }
}

// Закрытие по клику на оверлей
export function handleOverlay(evt) {
  if (evt.target.classList.contains('popup')) {
    closeModal(evt.target);
  }
}

// Открыть попап
export function openModal(popup) {
  popup.classList.remove('popup_is-animated');
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEsc);
}

// Закрыть попап
export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  popup.classList.add('popup_is-animated');
  document.removeEventListener('keydown', handleEsc);
}

// Навесить слушатели (кнопка «закрыть» и оверлей)
export function initializePopup(popup) {
  const closeBtn = popup.querySelector('.popup__close');
  closeBtn.addEventListener('click', () => closeModal(popup));
  popup.addEventListener('mousedown', handleOverlay);
}
