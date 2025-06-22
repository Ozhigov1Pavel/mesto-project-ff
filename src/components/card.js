export function createCard(
  cardData,
  currentUserId,
  { onCardClick, onLikeToggle, onDelete }
) {
  const template = document.querySelector("#card-template");
  const element = template.content
    .querySelector(".places__item")
    .cloneNode(true);

  const imgEl = element.querySelector(".card__image");
  const titleEl = element.querySelector(".card__title");
  const likeBtn = element.querySelector(".card__like-button");
  const likeCountEl = element.querySelector(".card__like-count");
  const deleteBtn = element.querySelector(".card__delete-button");

  imgEl.src = cardData.link;
  imgEl.alt = cardData.name;
  titleEl.textContent = cardData.name;
  likeCountEl.textContent = cardData.likes.length;

  // Пометить как залайканное, если текущий юзер в списке likes
  if (cardData.likes.some((u) => u._id === currentUserId)) {
    likeBtn.classList.add("card__like-button_is-active");
  }

  // Убрать кнопку удаления, если не владелец
  if (cardData.owner._id !== currentUserId) {
    deleteBtn.remove();
  } else {
    deleteBtn.addEventListener("click", () => onDelete(cardData._id, element));
  }

  likeBtn.addEventListener("click", () =>
    onLikeToggle(cardData._id, likeBtn, likeCountEl)
  );
  imgEl.addEventListener("click", () => onCardClick(cardData));

  return element;
}
