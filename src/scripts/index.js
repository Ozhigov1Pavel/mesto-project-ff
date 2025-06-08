import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, handleLike } from '../components/card.js';
import { openModal, closeModal, handleEsc, handleOverlay } from '../components/modal.js';

// --- Объявление DOM-элементов ---
const placesList       = document.querySelector('.places__list');
const editBtn          = document.querySelector('.profile__edit-button');
const addBtn           = document.querySelector('.profile__add-button');
const closeButtons     = document.querySelectorAll('.popup__close');

const editPopup        = document.querySelector('.popup_type_edit');
const newCardPopup     = document.querySelector('.popup_type_new-card');
const imagePopup       = document.querySelector('.popup_type_image');

const profileTitle     = document.querySelector('.profile__title');
const profileDesc      = document.querySelector('.profile__description');

const profileForm      = editPopup.querySelector('.popup__form[name="edit-profile"]');
const nameInput        = profileForm.querySelector('.popup__input_type_name');
const jobInput         = profileForm.querySelector('.popup__input_type_description');

const newCardForm      = newCardPopup.querySelector('.popup__form[name="new-place"]');
const placeNameInput   = newCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput   = newCardForm.querySelector('.popup__input_type_url');

const popupImage       = imagePopup.querySelector('.popup__image');
const popupCaption     = imagePopup.querySelector('.popup__caption');

// --- Инициализация попапов ---
document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated');
  popup.addEventListener('mousedown', handleOverlay);
});

document.addEventListener('keydown', handleEsc);

// --- Функции ---
function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  jobInput.value  = profileDesc.textContent;
}

function handleProfileSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDesc.textContent  = jobInput.value;
  closeModal(editPopup);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const cardData = { name: placeNameInput.value, link: placeLinkInput.value };
  const cardEl   = createCard(cardData, deleteCard, handleLike, handleCardClick);
  placesList.prepend(cardEl);
  newCardForm.reset();
  closeModal(newCardPopup);
}

function handleCardClick(cardData) {
  popupImage.src     = cardData.link;
  popupImage.alt     = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

// --- Рендер начальных карточек ---
initialCards.forEach(data => {
  const cardEl = createCard(data, deleteCard, handleLike, handleCardClick);
  placesList.append(cardEl);
});

// --- Навешивание обработчиков ---
editBtn.addEventListener('click', () => {
  fillProfileForm();
  openModal(editPopup);
});

profileForm.addEventListener('submit', handleProfileSubmit);

addBtn.addEventListener('click', () => openModal(newCardPopup));
newCardForm.addEventListener('submit', handleNewCardSubmit);

closeButtons.forEach(btn => {
  const popup = btn.closest('.popup');
  btn.addEventListener('click', () => closeModal(popup));
});