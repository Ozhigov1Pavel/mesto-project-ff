// Показать текст ошибки под полем
function showInputError(formEl, inputEl, message, config) {
  const errorEl = formEl.querySelector(`[data-error-for="${inputEl.name}"]`);
  inputEl.classList.add(config.inputErrorClass);
  errorEl.textContent = message;
  errorEl.classList.add(config.errorClass);
}

// Скрыть текст ошибки под полем
function hideInputError(formEl, inputEl, config) {
  const errorEl = formEl.querySelector(`[data-error-for="${inputEl.name}"]`);
  inputEl.classList.remove(config.inputErrorClass);
  errorEl.textContent = '';
  errorEl.classList.remove(config.errorClass);
}

// Проверить валидность одного поля
function checkInputValidity(formEl, inputEl, config) {
  // 1. Обязательное поле
  if (inputEl.validity.valueMissing) {
    // Для url оставляем стандартное сообщение, для остальных — кастомное
    const message = inputEl.type === 'url'
      ? inputEl.validationMessage            // "Введите адрес сайта."
      : inputEl.dataset.errorRequired;      // e.g. "Вы пропустили это поле"
    showInputError(formEl, inputEl, message, config);
    return;
  }
  // 2. Несоответствие паттерну
  if (inputEl.validity.patternMismatch) {
    showInputError(
      formEl,
      inputEl,
      inputEl.dataset.errorPattern,          // e.g. "Разрешены только буквы, дефис и пробел"
      config
    );
    return;
  }
  // 3. Любые другие стандартные ошибки
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
    return;
  }
  // 4. Поле валидно
  hideInputError(formEl, inputEl, config);
}

// Переключить состояние кнопки отправки
function toggleButtonState(inputList, buttonEl, config) {
  const isFormValid = inputList.every(inputEl => inputEl.checkValidity());
  buttonEl.disabled = !isFormValid;
  buttonEl.classList.toggle(config.inactiveButtonClass, !isFormValid);
}

// Навесить слушатели на все поля формы
function setEventListeners(formEl, config) {
  const inputs = Array.from(formEl.querySelectorAll(config.inputSelector));
  const button = formEl.querySelector(config.submitButtonSelector);

  // Изначально проверить состояние кнопки
  toggleButtonState(inputs, button, config);

  // При каждом вводе проверять валидность и переключать кнопку
  inputs.forEach(inputEl => {
    inputEl.addEventListener('input', () => {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputs, button, config);
    });
  });
}

// Включить валидацию на всех формах
export function enableValidation(config) {
  document.querySelectorAll(config.formSelector).forEach(formEl => {
    formEl.setAttribute('novalidate', true);
    setEventListeners(formEl, config);
  });
}

// Очистить ошибки и сбросить состояние кнопки
export function clearValidation(formEl, config) {
  const inputs = Array.from(formEl.querySelectorAll(config.inputSelector));
  const button = formEl.querySelector(config.submitButtonSelector);

  inputs.forEach(inputEl => hideInputError(formEl, inputEl, config));
  toggleButtonState(inputs, button, config);
}
