import '../pages/index.css';
import { createCard } from '../components/card.js';
import {
  getUserInfo,
  getInitialCards,
  setUserInfo,
  setUserAvatar,
  addCard,
  deleteCard,
  changeLikeCardStatus
} from '../components/api.js';
import {
  openModal,
  closeModal,
  handleEsc,
  initializePopup
} from '../components/modal.js';
import { enableValidation, clearValidation } from '../components/validation.js';

// DOM
const userName       = document.querySelector('.profile__title');
const userAbout      = document.querySelector('.profile__description');
const userAvatarEl   = document.querySelector('.profile__image');

const avatarBtn      = document.querySelector('.profile__avatar-edit');
const editBtn        = document.querySelector('.profile__edit-button');
const addBtn         = document.querySelector('.profile__add-button');
const placesList     = document.querySelector('.places__list');

const editPopup      = document.querySelector('.popup_type_edit');
const avatarPopup    = document.querySelector('.popup_type_avatar');
const newCardPopup   = document.querySelector('.popup_type_new-card');
const imagePopup     = document.querySelector('.popup_type_image');

const profileForm    = editPopup.querySelector('.popup__form[name="edit-profile"]');
const nameInput      = profileForm.querySelector('.popup__input_type_name');
const aboutInput     = profileForm.querySelector('.popup__input_type_description');

const avatarForm     = avatarPopup.querySelector('.popup__form[name="edit-avatar"]');
const avatarInput    = avatarForm.querySelector('.popup__input_type_avatar-url');

const newCardForm    = newCardPopup.querySelector('.popup__form[name="new-place"]');
const placeNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = newCardForm.querySelector('.popup__input_type_url');

const popupImage     = imagePopup.querySelector('.popup__image');
const popupCaption   = imagePopup.querySelector('.popup__caption');

let currentUserId;

// Валидация
enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});

// Инициализация попапов
document.querySelectorAll('.popup').forEach(p => initializePopup(p));
document.addEventListener('keydown', handleEsc);

// Загрузка профиля и карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    userName.textContent  = userData.name;
    userAbout.textContent = userData.about;
    userAvatarEl.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach(cardData => {
      const cardEl = createCard(cardData, currentUserId, {
        onCardClick: openImagePopup,
        onLikeToggle: toggleCardLike,
        onDelete: removeCard
      });
      placesList.append(cardEl);
    });
  })
  .catch(console.error);

// Обработчики профиля
function openProfilePopup() {
  nameInput.value  = userName.textContent;
  aboutInput.value = userAbout.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(editPopup);
}

function handleProfileSubmit(evt) {
  evt.preventDefault();
  const btn = profileForm.querySelector('.popup__button');
  btn.textContent = 'Сохранение...';
  setUserInfo({ name: nameInput.value, about: aboutInput.value })
    .then(data => {
      userName.textContent  = data.name;
      userAbout.textContent = data.about;
      closeModal(editPopup);
    })
    .catch(console.error)
    .finally(() => (btn.textContent = 'Сохранить'));
}

editBtn.addEventListener('click', openProfilePopup);
profileForm.addEventListener('submit', handleProfileSubmit);

// Обработчики аватара
function openAvatarPopup() {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const btn = avatarForm.querySelector('.popup__button');
  btn.textContent = 'Сохранение...';
  setUserAvatar({ avatar: avatarInput.value })
    .then(({ avatar }) => {
      userAvatarEl.style.backgroundImage = `url(${avatar})`;
      closeModal(avatarPopup);
    })
    .catch(console.error)
    .finally(() => (btn.textContent = 'Сохранить'));
}

avatarBtn.addEventListener('click', openAvatarPopup);
avatarForm.addEventListener('submit', handleAvatarSubmit);

// Обработчики добавления карточки
function openNewCardPopup() {
  newCardForm.reset();
  clearValidation(newCardForm, validationConfig);
  openModal(newCardPopup);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const btn = newCardForm.querySelector('.popup__button');
  btn.textContent = 'Создание...';
  addCard({ name: placeNameInput.value, link: placeLinkInput.value })
    .then(cardData => {
      const cardEl = createCard(cardData, currentUserId, {
        onCardClick: openImagePopup,
        onLikeToggle: toggleCardLike,
        onDelete: removeCard
      });
      placesList.prepend(cardEl);
      closeModal(newCardPopup);
    })
    .catch(console.error)
    .finally(() => (btn.textContent = 'Сохранить'));
}

addBtn.addEventListener('click', openNewCardPopup);
newCardForm.addEventListener('submit', handleNewCardSubmit);

// Вспомогательные функции для карточек
function openImagePopup(data) {
  popupImage.src = data.link;
  popupImage.alt = data.name;
  popupCaption.textContent = data.name;
  openModal(imagePopup);
}

function toggleCardLike(cardId, likeBtn, likeCountEl) {
  const shouldLike = !likeBtn.classList.contains('card__like-button_is-active');
  changeLikeCardStatus(cardId, shouldLike)
    .then(updated => {
      const likedByUser = updated.likes.some(u => u._id === currentUserId);
      likeBtn.classList.toggle('card__like-button_is-active', likedByUser);
      likeCountEl.textContent = updated.likes.length;
    })
    .catch(console.error);
}

function removeCard(cardId, cardEl) {
  deleteCard(cardId)
    .then(() => cardEl.remove())
    .catch(console.error);
}
