function cards(cardData, deleteCall) {
  const cardCreate = document.querySelector("#card-template");
  const cardElement = cardCreate.content.querySelector(".places__item").cloneNode(true);
  cardElement.querySelector(".card__image").src = cardData.link;
  cardElement.querySelector(".card__image").alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;

  const deleteBtn = cardElement.querySelector(".card__delete-button");
  deleteBtn.addEventListener("click", deleteCall);

  return cardElement;
}

function deleteCard(event) {
  event.target.closest(".places__item").remove();
}

const placesList = document.querySelector(".places__list");

initialCards.forEach(function (cardData) {
  const card = cards(cardData, deleteCard);
  placesList.append(card);
});
