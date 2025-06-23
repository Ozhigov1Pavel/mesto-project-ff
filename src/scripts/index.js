import '../pages/index.css';
import { createCard } from '../components/card.js';
import {
  getUserInfo,
  getInitialCards,
  setUserInfo,
  setUserAvatar,
  addCard,
  deleteCard
} from '../components/api.js';
import {
  openModal,
  closeModal,
  handleEsc,
  initializePopup
} from '../components/modal.js';
import { enableValidation, clearValidation } from '../components/validation.js';

// --- Конфигурация валидации форм ---
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};
enableValidation(validationConfig);

// --- Поиск DOM-элементов ---
const userName        = document.querySelector('.profile__title');
const userAbout       = document.querySelector('.profile__description');
const userAvatarEl    = document.querySelector('.profile__image');

const avatarBtn       = document.querySelector('.profile__avatar-edit');
const editBtn         = document.querySelector('.profile__edit-button');
const addBtn          = document.querySelector('.profile__add-button');
const placesList      = document.querySelector('.places__list');

const editPopup       = document.querySelector('.popup_type_edit');
const avatarPopup     = document.querySelector('.popup_type_avatar');
const newCardPopup    = document.querySelector('.popup_type_new-card');
const imagePopup      = document.querySelector('.popup_type_image');

const profileForm     = editPopup.querySelector('.popup__form[name="edit-profile"]');
const nameInput       = profileForm.querySelector('.popup__input_type_name');
const aboutInput      = profileForm.querySelector('.popup__input_type_description');

const avatarForm      = avatarPopup.querySelector('.popup__form[name="edit-avatar"]');
const avatarInput     = avatarForm.querySelector('.popup__input_type_avatar-url');

const newCardForm     = newCardPopup.querySelector('.popup__form[name="new-place"]');
const placeNameInput  = newCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput  = newCardForm.querySelector('.popup__input_type_url');

const popupImage      = imagePopup.querySelector('.popup__image');
const popupCaption    = imagePopup.querySelector('.popup__caption');

// --- Кнопки «Сохранить» и их тексты ---
const profileSaveBtn = profileForm.querySelector('.popup__button');
const avatarSaveBtn  = avatarForm.querySelector('.popup__button');
const newCardSaveBtn = newCardForm.querySelector('.popup__button');

const DEFAULT_PROFILE_TEXT = profileSaveBtn.textContent;
const DEFAULT_AVATAR_TEXT  = avatarSaveBtn.textContent;
const DEFAULT_NEWCARD_TEXT = newCardSaveBtn.textContent;

const LOADING_PROFILE_TEXT = 'Сохранение...';
const LOADING_AVATAR_TEXT  = 'Сохранение...';
const LOADING_NEWCARD_TEXT = 'Создание...';

// Универсальная функция для «загружающих» кнопок
function renderLoading(button, isLoading, loadingText, defaultText) {
  button.textContent = isLoading ? loadingText : defaultText;
}

// --- Инициализация попапов (крестики + оверлей) ---
document.querySelectorAll('.popup').forEach(popup => initializePopup(popup));
document.addEventListener('keydown', handleEsc);

let currentUserId;

// --- Загрузка профиля и карточек ---
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    userName.textContent  = userData.name;
    userAbout.textContent = userData.about;
    userAvatarEl.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach(cardData => {
      const cardEl = createCard(cardData, currentUserId, {
        onCardClick: openImagePopup,
        onDelete: removeCard
      });
      placesList.append(cardEl);
    });
  })
  .catch(err => console.error('Ошибка загрузки:', err));

// --- Обработчики профиля ---
function openProfilePopup() {
  nameInput.value  = userName.textContent;
  aboutInput.value = userAbout.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(editPopup);
}

function handleProfileSubmit(evt) {
  evt.preventDefault();
  renderLoading(profileSaveBtn, true, LOADING_PROFILE_TEXT, DEFAULT_PROFILE_TEXT);
  setUserInfo({ name: nameInput.value, about: aboutInput.value })
    .then(data => {
      userName.textContent  = data.name;
      userAbout.textContent = data.about;
      closeModal(editPopup);
    })
    .catch(err => console.error('Ошибка профиля:', err))
    .finally(() => {
      renderLoading(profileSaveBtn, false, LOADING_PROFILE_TEXT, DEFAULT_PROFILE_TEXT);
    });
}

editBtn.addEventListener('click', openProfilePopup);
profileForm.addEventListener('submit', handleProfileSubmit);

// --- Обработчики аватара ---
function openAvatarPopup() {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(avatarSaveBtn, true, LOADING_AVATAR_TEXT, DEFAULT_AVATAR_TEXT);
  setUserAvatar({ avatar: avatarInput.value })
    .then(({ avatar }) => {
      userAvatarEl.style.backgroundImage = `url(${avatar})`;
      closeModal(avatarPopup);
    })
    .catch(err => console.error('Ошибка аватара:', err))
    .finally(() => {
      renderLoading(avatarSaveBtn, false, LOADING_AVATAR_TEXT, DEFAULT_AVATAR_TEXT);
    });
}

avatarBtn.addEventListener('click', openAvatarPopup);
avatarForm.addEventListener('submit', handleAvatarSubmit);

// --- Обработчики добавления карточки ---
function openNewCardPopup() {
  newCardForm.reset();
  clearValidation(newCardForm, validationConfig);
  openModal(newCardPopup);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  renderLoading(newCardSaveBtn, true, LOADING_NEWCARD_TEXT, DEFAULT_NEWCARD_TEXT);
  addCard({ name: placeNameInput.value, link: placeLinkInput.value })
    .then(cardData => {
      const cardEl = createCard(cardData, currentUserId, {
        onCardClick: openImagePopup,
        onDelete: removeCard
      });
      placesList.prepend(cardEl);
      closeModal(newCardPopup);
    })
    .catch(err => console.error('Ошибка карточки:', err))
    .finally(() => {
      renderLoading(newCardSaveBtn, false, LOADING_NEWCARD_TEXT, DEFAULT_NEWCARD_TEXT);
    });
}

addBtn.addEventListener('click', openNewCardPopup);
newCardForm.addEventListener('submit', handleNewCardSubmit);

// --- Утилиты для карточек ---
function openImagePopup({ link, name }) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModal(imagePopup);
}

function removeCard(cardId, cardEl) {
  deleteCard(cardId)
    .then(() => cardEl.remove())
    .catch(err => console.error('Ошибка удаления:', err));
}
