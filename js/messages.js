'use strict';

(function () {

  /**
   * Получение шаблона сообщения
   * @param {string} messageType
   * @return {HTMLElement}
   */
  var getMessageTemplate = function (messageType) {
    var messageTemplate = document.querySelector('#' + messageType).content.querySelector('.' + messageType);
    var message = messageTemplate.cloneNode(true);
    message.setAttribute('name', 'message');
    return message;
  };

  /**
   * Помощник, обеспечивающий отображение сообщения об ошибке выполнения операции
   * @param {string} messageText
   */
  var displayErrorMessageHandler = function (messageText) {
    var message = getMessageTemplate('error');
    message.querySelector('.error__message').textContent = messageText;
    document.querySelector('main').insertAdjacentElement('afterbegin', message);
  };

  /**
   * Помощник, обеспечивающий отображение сообщения об успешном выполнении операции
   */
  var displaySuccessMessageHandler = function () {
    document.querySelector('main').insertAdjacentElement('afterbegin', getMessageTemplate('success'));
  };

  /**
   * Помощник, обеспечивающий отображение сообщения о несоответствии расширения файла разрешенным типам
   */
  var displayMismatchFileMessageHandler = function () {
    var message = document.createElement('div');
    var messageText = document.createElement('p');
    message.appendChild(messageText);
    messageText.textContent = 'Выбран неподдерживаемый формат файла';
    message.setAttribute('name', 'message');
    message.style = 'z-index: 3';
    message.classList.add(window.utils.ClassForManipulation.MISMATCH_FILE);
    messageText.classList.add(window.utils.ClassForManipulation.MISMATCH_FILE_MESSAGE);
    document.querySelector('main').insertAdjacentElement('afterbegin', message);
  };

  /**
   * Помощник, выполняющий закрытие сообщения
   */
  var displayOffMessageHandler = function () {
    var message = document.querySelector('div[name="message"]');
    message.addEventListener('click', removeMessageHandler);
    document.addEventListener('keydown', messageKeyDownHandler);
  };

  /**
   * Помощник, обеспечивающий закрытие сообщения по клику на клавишу
   * @param {event} evt
   */
  var messageKeyDownHandler = function (evt) {
    if (evt.keyCode === window.utils.KeyCode.ESC) {
      removeMessageHandler();
    }
  };

  /**
   * Удаление сообщения
   */
  var removeMessageHandler = function () {
    var message = document.querySelector('div[name="message"]');
    if (message) {
      document.removeEventListener('keydown', messageKeyDownHandler);
      message.remove();
    }
  };

  window.messages = {
    displayErrorMessageHandler: displayErrorMessageHandler,
    displaySuccessMessageHandler: displaySuccessMessageHandler,
    displayMismatchFileMessageHandler: displayMismatchFileMessageHandler,
    displayOffMessageHandler: displayOffMessageHandler
  };

})();
