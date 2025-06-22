const config = {
    baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-41',
    headers: {
      authorization: '2c71fc8b-f621-402a-83f8-63c9ea0490d1',
      'Content-Type': 'application/json'
    }
  };
  
  function _checkResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }
  
  export function getUserInfo() {
    return fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers
    }).then(_checkResponse);
  }
  
  export function getInitialCards() {
    return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers
    }).then(_checkResponse);
  }
  
  export function setUserInfo({ name, about }) {
    return fetch(`${config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({ name, about })
    }).then(_checkResponse);
  }
  
  export function setUserAvatar({ avatar }) {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({ avatar })
    }).then(_checkResponse);
  }
  
  export function addCard({ name, link }) {
    return fetch(`${config.baseUrl}/cards`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({ name, link })
    }).then(_checkResponse);
  }
  
  export function deleteCard(cardId) {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: config.headers
    }).then(_checkResponse);
  }
  
  export function changeLikeCardStatus(cardId, shouldLike) {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: shouldLike ? 'PUT' : 'DELETE',
      headers: config.headers
    }).then(_checkResponse);
  }
  