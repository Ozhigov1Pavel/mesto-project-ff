// Функции для работы с карточками
export function deleteCard(evt) {
  evt.target.closest('.places__item').remove();
}

export function handleLike(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

// Создает DOM-элемент карточки со всеми слушателями событий
export function createCard(cardData, onDelete, onLike, onImageClick) {
  const template = document.querySelector('#card-template');
  const element  = template.content
    .querySelector('.places__item')
    .cloneNode(true);

  const imgEl     = element.querySelector('.card__image');
  const titleEl   = element.querySelector('.card__title');
  const deleteBtn = element.querySelector('.card__delete-button');
  const likeBtn   = element.querySelector('.card__like-button');

  imgEl.src           = cardData.link;
  imgEl.alt           = cardData.name;
  titleEl.textContent = cardData.name;

  deleteBtn.addEventListener('click', onDelete);
  likeBtn.addEventListener('click', onLike);
  imgEl.addEventListener('click', () => onImageClick(cardData));

  return element;
}