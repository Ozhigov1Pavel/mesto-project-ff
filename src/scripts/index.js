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

// --- Конфигурация для валидации форм ---
const validationConfig = {
  formSelector: '.popup__form',          
  inputSelector: '.popup__input',           
  submitButtonSelector: '.popup__button',   
  inactiveButtonClass: 'popup__button_disabled', 
  inputErrorClass: 'popup__input_type_error',    
  errorClass: 'popup__error_visible'            
};

// Активируем валидацию на всех формах
enableValidation(validationConfig);

// --- Поиск DOM-элементов ---
const userName        = document.querySelector('.profile__title');          // имя пользователя
const userAbout       = document.querySelector('.profile__description');    // описание пользователя
const userAvatarEl    = document.querySelector('.profile__image');          // элемент аватара

const avatarBtn       = document.querySelector('.profile__avatar-edit');    // кнопка редактирования аватара
const editBtn         = document.querySelector('.profile__edit-button');    // кнопка редактирования профиля
const addBtn          = document.querySelector('.profile__add-button');     // кнопка добавления карточки
const placesList      = document.querySelector('.places__list');           // контейнер для списка карточек

const editPopup       = document.querySelector('.popup_type_edit');         // попап редактирования профиля
const avatarPopup     = document.querySelector('.popup_type_avatar');       // попап редактирования аватара
const newCardPopup    = document.querySelector('.popup_type_new-card');     // попап добавления новой карточки
const imagePopup      = document.querySelector('.popup_type_image');        // попап просмотра изображения

// Формы и их поля
const profileForm     = editPopup.querySelector('.popup__form[name="edit-profile"]');
const nameInput       = profileForm.querySelector('.popup__input_type_name');
const aboutInput      = profileForm.querySelector('.popup__input_type_description');

const avatarForm      = avatarPopup.querySelector('.popup__form[name="edit-avatar"]');
const avatarInput     = avatarForm.querySelector('.popup__input_type_avatar-url');

const newCardForm     = newCardPopup.querySelector('.popup__form[name="new-place"]');
const placeNameInput  = newCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput  = newCardForm.querySelector('.popup__input_type_url');

const popupImage      = imagePopup.querySelector('.popup__image');          // элемент <img> в попапе просмотра
const popupCaption    = imagePopup.querySelector('.popup__caption');        // подпись под изображением

let currentUserId;   // здесь будет храниться _id текущего пользователя

// --- Инициализация всех попапов (крестик + оверлей) ---
document.querySelectorAll('.popup').forEach(popup => initializePopup(popup));
// Обработчик Escape общ для всех попапов
document.addEventListener('keydown', handleEsc);

// --- Загрузка данных пользователя и первоначальных карточек ---
Promise.all([ getUserInfo(), getInitialCards() ])
  .then(([ userData, cards ]) => {
    // Сохраняем id пользователя
    currentUserId = userData._id;
    // Отрисовываем данные профиля
    userName.textContent      = userData.name;
    userAbout.textContent     = userData.about;
    userAvatarEl.style.backgroundImage = `url(${userData.avatar})`;

    // Рендер карточек
    cards.forEach(cardData => {
      const cardEl = createCard(cardData, currentUserId, {
        onCardClick: openImagePopup,   // открытие попапа просмотра
        onLikeToggle: toggleCardLike,  // обработчик лайка
        onDelete: removeCard           // обработчик удаления
      });
      placesList.append(cardEl);
    });
  })
  .catch(err => console.error('Ошибка при загрузке данных:', err));

// --- Функции для работы с профилем ---

// Открытие попапа редактирования профиля
function openProfilePopup() {
  nameInput.value  = userName.textContent;   // подставляем текущее имя
  aboutInput.value = userAbout.textContent;  // подставляем текущее описание
  clearValidation(profileForm, validationConfig); // сбрасываем ошибки валидации
  openModal(editPopup);
}

// Отправка формы редактирования профиля
function handleProfileSubmit(evt) {
  evt.preventDefault();
  const btn = profileForm.querySelector('.popup__button');
  btn.textContent = 'Сохранение...';  // меняем текст кнопки
  setUserInfo({ name: nameInput.value, about: aboutInput.value })
    .then(data => {
      // Обновляем данные на странице
      userName.textContent  = data.name;
      userAbout.textContent = data.about;
      closeModal(editPopup);
    })
    .catch(err => console.error('Ошибка обновления профиля:', err))
    .finally(() => { btn.textContent = 'Сохранить'; });
}

editBtn.addEventListener('click', openProfilePopup);
profileForm.addEventListener('submit', handleProfileSubmit);

// --- Функции для работы с аватаром ---

// Открытие попапа редактирования аватара
function openAvatarPopup() {
  avatarForm.reset();                // очищаем форму
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
}

// Отправка формы редактирования аватара
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const btn = avatarForm.querySelector('.popup__button');
  btn.textContent = 'Сохранение...';
  setUserAvatar({ avatar: avatarInput.value })
    .then(({ avatar }) => {
      userAvatarEl.style.backgroundImage = `url(${avatar})`;
      closeModal(avatarPopup);
    })
    .catch(err => console.error('Ошибка обновления аватара:', err))
    .finally(() => { btn.textContent = 'Сохранить'; });
}

avatarBtn.addEventListener('click', openAvatarPopup);
avatarForm.addEventListener('submit', handleAvatarSubmit);

// --- Функции для добавления новой карточки ---

// Открытие попапа добавления карточки
function openNewCardPopup() {
  newCardForm.reset();
  clearValidation(newCardForm, validationConfig);
  openModal(newCardPopup);
}

// Отправка формы добавления карточки
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
    .catch(err => console.error('Ошибка добавления карточки:', err))
    .finally(() => { btn.textContent = 'Сохранить'; });
}

addBtn.addEventListener('click', openNewCardPopup);
newCardForm.addEventListener('submit', handleNewCardSubmit);

// --- Утилиты для работы с карточками ---

// Открытие попапа просмотра изображения
function openImagePopup(data) {
  popupImage.src = data.link;
  popupImage.alt = data.name;
  popupCaption.textContent = data.name;
  openModal(imagePopup);
}

// Переключение лайка на карточке
function toggleCardLike(cardId, likeBtn, likeCountEl) {
  const shouldLike = !likeBtn.classList.contains('card__like-button_is-active');
  changeLikeCardStatus(cardId, shouldLike)
    .then(updated => {
 
      const likedByUser = updated.likes.some(u => u._id === currentUserId);
      likeBtn.classList.toggle('card__like-button_is-active', likedByUser);
      likeCountEl.textContent = updated.likes.length;
    })
    .catch(err => console.error('Ошибка лайка:', err));
}

// Удаление карточки
function removeCard(cardId, cardEl) {
  deleteCard(cardId)
    .then(() => cardEl.remove())
    .catch(err => console.error('Ошибка удаления карточки:', err));
}
