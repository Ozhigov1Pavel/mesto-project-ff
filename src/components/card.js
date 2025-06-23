import { changeLikeCardStatus } from './api.js';

// Функция создания карточки и навешивания всех обработчиков
export function createCard(cardData, currentUserId, { onCardClick, onDelete }) {
  const template = document.querySelector('#card-template');
  const element  = template.content
    .querySelector('.places__item')
    .cloneNode(true);

  const imgEl       = element.querySelector('.card__image');
  const titleEl     = element.querySelector('.card__title');
  const likeBtn     = element.querySelector('.card__like-button');
  const likeCountEl = element.querySelector('.card__like-count');
  const deleteBtn   = element.querySelector('.card__delete-button');

  // Заполнение данных карточки
  imgEl.src           = cardData.link;
  imgEl.alt           = cardData.name;
  titleEl.textContent = cardData.name;
  likeCountEl.textContent = cardData.likes.length;

  // Показываем кнопку удаления только автору
  if (cardData.owner._id === currentUserId) {
    deleteBtn.addEventListener('click', () => onDelete(cardData._id, element));
  } else {
    deleteBtn.remove();
  }

  // Устанавливаем первоначальный статус лайка
  if (cardData.likes.some(u => u._id === currentUserId)) {
    likeBtn.classList.add('card__like-button_is-active');
  }

  // Обработчик лайка/дизлайка
  likeBtn.addEventListener('click', () => {
    const shouldLike = !likeBtn.classList.contains('card__like-button_is-active');
    changeLikeCardStatus(cardData._id, shouldLike)
      .then(updated => {
        const likedByUser = updated.likes.some(u => u._id === currentUserId);
        likeBtn.classList.toggle('card__like-button_is-active', likedByUser);
        likeCountEl.textContent = updated.likes.length;
      })
      .catch(err => console.error('Ошибка обновления лайка:', err));
  });

  // Обработчик открытия попапа с большим изображением
  imgEl.addEventListener('click', () =>
    onCardClick({ name: cardData.name, link: cardData.link })
  );

  return element;
}
