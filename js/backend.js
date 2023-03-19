'use strict';

(function () {

  /**
   * Значение ожидания ответа сервера
  */
  var TIMEOUT = 10000;


  /**
   * Адреса, по которым выполняются запросы
   */
  var RequestUrl = {
    URL_GET: 'https://javascript.pages.academy/keksobooking/data',
    URL_POST: 'https://javascript.pages.academy/keksobooking'
  };

  /**
   * Коды ответов сервера
   */
  var RequestStatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  };

  /**
   * Типов запросов
   */
  var RequestType = {
    POST: 'POST',
    GET: 'GET'
  };

  /**
   * Проверка полученного кода ответа на запрос
   * @param {XMLHttpRequest} xhr - XMLHttpRequest-объект
   * @param {function} successHandler - помощник, обрабатывающий успешный ответ сервера
   * @param {function} errorHandler - помощник, обрабатывающий все остальные ответы сервера
   */
  var checkStatusXhr = function (xhr, successHandler, errorHandler) {
    switch (xhr.status) {
      case (RequestStatusCode.OK):
        successHandler(xhr.response);
        break;
      case (RequestStatusCode.BAD_REQUEST):
        errorHandler('Введенные данные не соответствуют требованиям');
        break;
      case (RequestStatusCode.NOT_FOUND):
        errorHandler('Сервер недоступен. Мы работаем, чтобы скорее все починить!');
        break;
      case (RequestStatusCode.SERVER_ERROR):
        errorHandler('Внутренная ошибка сервера. Мы работаем, чтобы скорее все починить!');
        break;
      default:
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    }
  };

  /**
   * Выполнение запроса и обработка сопутствующих событий
   * @param {string} requestType - тип запроса
   * @param {string} requestUrl - адрес, по которому выполняется запрос
   * @param {requestCallback} successHandler - помощник, обрабатывающий успешный ответ сервера
   * @param {requestCallback} errorHandler - помощник, обрабатывающий все остальные ответы сервера
   * @param {Object} requestData - необязательный параметр, указывается для post-запросов
   */
  var serverRequest = function (requestType, requestUrl, successHandler, errorHandler, requestData) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      checkStatusXhr(xhr, successHandler, errorHandler);
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения. Пожалуйста, проверьте подключение');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + TIMEOUT + 'мс. Пожалуйста, проверьте качество сетевого подключения');
    });

    xhr.open(requestType, requestUrl);

    if (requestData) {
      xhr.send(requestData);
    } else {
      xhr.send();
    }
  };

  window.backend = {
    RequestUrl: RequestUrl,
    RequestStatusCode: RequestStatusCode,
    RequestType: RequestType,
    serverRequest: serverRequest
  };

})();
