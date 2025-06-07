import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, handleLike } from '../components/card.js';
import { openModal, closeModal, handleEsc, handleOverlay } from '../components/modal.js';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.popup').forEach(popup => {
    popup.classList.add('popup_is-animated');
    popup.addEventListener('mousedown', handleOverlay);
  });

  const placesList = document.querySelector('.places__list');

  // Рендер начальных карточек
  initialCards.forEach(cardData => {
    const cardEl = createCard(cardData, deleteCard, handleLike);
    placesList.append(cardEl);
  });

  // Селекторы DOM
  const editPopup    = document.querySelector('.popup_type_edit');
  const newCardPopup = document.querySelector('.popup_type_new-card');
  const imagePopup   = document.querySelector('.popup_type_image');

  const editBtn   = document.querySelector('.profile__edit-button');
  const addBtn    = document.querySelector('.profile__add-button');
  const closeBtns = document.querySelectorAll('.popup__close');

  const profileTitle       = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  // Редактирование профиля
  const profileForm = editPopup.querySelector('.popup__form[name="edit-profile"]');
  const nameInput   = profileForm.querySelector('.popup__input_type_name');
  const jobInput    = profileForm.querySelector('.popup__input_type_description');

  editBtn.addEventListener('click', () => {
    nameInput.value = profileTitle.textContent;
    jobInput.value  = profileDescription.textContent;
    openModal(editPopup);
  });

  profileForm.addEventListener('submit', evt => {
    evt.preventDefault();
    profileTitle.textContent       = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(editPopup);
  });

  // Добавление новой карточки
  const newCardForm    = newCardPopup.querySelector('.popup__form[name="new-place"]');
  const placeNameInput = newCardForm.querySelector('.popup__input_type_card-name');
  const placeLinkInput = newCardForm.querySelector('.popup__input_type_url');

  addBtn.addEventListener('click', () => openModal(newCardPopup));
  newCardForm.addEventListener('submit', evt => {
    evt.preventDefault();
    const cardData = { name: placeNameInput.value, link: placeLinkInput.value };
    const cardEl   = createCard(cardData, deleteCard, handleLike);
    placesList.prepend(cardEl);
    newCardForm.reset();
    closeModal(newCardPopup);
  });

  // Превью картинки
  placesList.addEventListener('click', evt => {
    const img = evt.target.closest('.card__image');
    if (!img) return;
    const popupImg     = imagePopup.querySelector('.popup__image');
    const popupCaption = imagePopup.querySelector('.popup__caption');
    popupImg.src       = img.src;
    popupImg.alt       = img.alt;
    popupCaption.textContent = img.alt;
    openModal(imagePopup);
  });

  // Закрытие попапов по кнопке
  closeBtns.forEach(btn => {
    const popup = btn.closest('.popup');
    btn.addEventListener('click', () => closeModal(popup));
  });
});