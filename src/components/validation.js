// Показать ошибку
function showInputError(formEl, inputEl, message, config) {
  const errorEl = formEl.querySelector(`[data-error-for="${inputEl.name}"]`);
  inputEl.classList.add(config.inputErrorClass);
  errorEl.textContent = message;
  errorEl.classList.add(config.errorClass);
}

// Скрыть ошибку
function hideInputError(formEl, inputEl, config) {
  const errorEl = formEl.querySelector(`[data-error-for="${inputEl.name}"]`);
  inputEl.classList.remove(config.inputErrorClass);
  errorEl.textContent = "";
  errorEl.classList.remove(config.errorClass);
}

// Проверить одно поле
function checkInputValidity(formEl, inputEl, config) {
  const valTrimmed = inputEl.value.trim();

  if (valTrimmed === "") {
    showInputError(formEl, inputEl, "Вы пропустили это поле", config);
    return;
  }

  if (
    (inputEl.name === "name" || inputEl.name === "place-name") &&
    !/^[A-Za-zА-Яа-яЁё\s-]+$/.test(valTrimmed)
  ) {
    showInputError(
      formEl,
      inputEl,
      inputEl.dataset.error || "Разрешены только буквы, дефис и пробел",
      config
    );
    return;
  }

  if (!inputEl.checkValidity()) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
    return;
  }

  hideInputError(formEl, inputEl, config);
}

// Переключить состояние кнопки
function toggleButtonState(inputList, buttonEl, config) {
  const isFormValid = inputList.every(
    (i) => i.checkValidity() && i.value.trim() !== ""
  );
  if (isFormValid) {
    buttonEl.disabled = false;
    buttonEl.classList.remove(config.inactiveButtonClass);
  } else {
    buttonEl.disabled = true;
    buttonEl.classList.add(config.inactiveButtonClass);
  }
}

// Навесить слушатели на форму
function setEventListeners(formEl, config) {
  const inputs = Array.from(formEl.querySelectorAll(config.inputSelector));
  const button = formEl.querySelector(config.submitButtonSelector);

  // сразу проверить кнопку
  toggleButtonState(inputs, button, config);

  inputs.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputs, button, config);
    });
  });
}

// Включить валидацию всех форм
export function enableValidation(config) {
  document.querySelectorAll(config.formSelector).forEach((formEl) => {
    formEl.setAttribute("novalidate", true);
    setEventListeners(formEl, config);
  });
}

// Очистить ошибки и отключить кнопку
export function clearValidation(formEl, config) {
  const inputs = Array.from(formEl.querySelectorAll(config.inputSelector));
  const button = formEl.querySelector(config.submitButtonSelector);
  inputs.forEach((inputEl) => {
    hideInputError(formEl, inputEl, config);
  });
  toggleButtonState(inputs, button, config);
}
