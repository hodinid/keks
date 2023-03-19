'use strict';

(function () {

  /**
   * Карта и ее фильтры
   */
  var workspace = document.querySelector('.map');
  var workspaceFilters = workspace.querySelector('.map__filters-container');

  /**
   * Помощник, переводящий страницу в активный режим по клику
   * @param {event} evt
   */
  var mainPinMouseDownHandler = function (evt) {
    if (evt.buttons === 1) {
      enablePage();
    }
  };

  /**
   * Помощник, переводящий страницу в активный режим по нажатию клавиши
   * @param {event} evt
   */
  var mainPinKeyDownHandler = function (evt) {
    if (evt.keyCode === window.utils.KeyCode.ENTER) {
      enablePage();
    }
  };

  /**
   * Помощник, обеспечивающий закрытие карточки объявления по нажатию клавиши
   * @param {event} evt
   */
  var documentKeyDownHandler = function (evt) {
    if (evt.keyCode === window.utils.KeyCode.ESC) {
      window.card.close();
    }
  };

  /**
   * Помощник, выполняющий получение объявлений с сервера и перевод страницы в активный режим
   * @param {*} responseItems
   */
  var showLoadedOffersHandler = function (responseItems) {
    window.data.offers = responseItems;
    workspace.insertBefore(window.pins.place(window.data.offers), workspaceFilters);

    workspace.classList.remove(window.utils.ClassForManipulation.MAP_FADED);
    window.form.advert.classList.remove(window.utils.ClassForManipulation.ADFORM_DISABLED);
    window.form.address.classList.add(window.utils.ClassForManipulation.ADFORM_DISABLED);
    window.utils.enableElements(window.filters.form);
    window.utils.enableElements(window.form.fieldsets);
    window.utils.addClassForElements(window.form.selects, window.utils.ClassForManipulation.CURSOR_POINTER);
    window.utils.removeClassForElements(window.form.fieldsets, window.utils.ClassForManipulation.CURSOR_DEFAULT);

    window.form.setRequirementsTitle();
    window.form.setRequirementsPrice();
    window.form.setRequirementsImages();
    window.form.setRequirementsAddress();
  };

  /**
   * Помощник, обрабатывающий ошибки получения объявлений с сервера
   * @param {*} response
   */
  var errorLoadOffersHandler = function (response) {
    window.messages.displayErrorMessageHandler(response);
    window.messages.displayOffMessageHandler();
    disablePage();
  };

  /**
   * Помошник, выполняющийся после успешной отправки данных формы
   */
  var uploadOfferDataHandler = function () {
    window.card.close();
    window.messages.displaySuccessMessageHandler();
    window.messages.displayOffMessageHandler();
    disablePage();
  };

  /**
   * Помошник, обрабатывающий ошибки отправки данных формы на сервер
   * @param {*} response
   */
  var errorUploadOfferDataHandler = function (response) {
    window.card.close();
    window.messages.displayErrorMessageHandler(response);
    window.messages.displayOffMessageHandler();
  };

  /**
   * Помощник, обеспечивающий очистку формы
   * @param {event} evt
   */
  var clearButtonClickHandler = function (evt) {
    evt.preventDefault();
    window.card.close();
    disablePage();
  };

  /**
   * Помощник, выполняющий отправку данных формы на сервер
   * @param {event} evt
   */
  var advertSubmitHandler = function (evt) {
    evt.preventDefault();
    window.backend.serverRequest(window.backend.RequestType.POST, window.backend.RequestUrl.URL_POST, uploadOfferDataHandler, errorUploadOfferDataHandler, new FormData(window.form.advert));
  };

  /**
   * Прослушка событий на главной метке
   */
  window.locality.mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
  window.locality.mainPin.addEventListener('keydown', mainPinKeyDownHandler);

  /**
   * Перевод страницы в неактивное состояние
   */
  var disablePage = function () {
    window.locality.mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
    window.locality.mainPin.addEventListener('keydown', mainPinKeyDownHandler);
    window.locality.setMainPinDefaultCoordinate();
    workspace.classList.add(window.utils.ClassForManipulation.MAP_FADED);
    window.form.advert.classList.add(window.utils.ClassForManipulation.ADFORM_DISABLED);
    window.utils.disableElements(window.filters.form);
    window.utils.disableElements(window.form.fieldsets);
    window.utils.removeClassForElements(window.form.selects, window.utils.ClassForManipulation.CURSOR_POINTER);
    window.utils.addClassForElements(window.form.fieldsets, window.utils.ClassForManipulation.CURSOR_DEFAULT);

    window.pins.remove();
    window.filters.form.reset();
    window.form.advert.reset();
    window.form.resetPhotosAndAvatar();
    window.form.setRequirementsPrice();
    window.locality.getAddress(false);

    document.removeEventListener('keydown', documentKeyDownHandler);
    window.form.advert.removeEventListener('change', window.form.advertChangeHandler);
    window.form.advert.removeEventListener('submit', advertSubmitHandler);
    window.form.avatarUpload.removeEventListener('change', window.form.avatarChangeHandler);
    window.form.photosUpload.removeEventListener('change', window.form.photosChangeHandler);
    window.form.photosPreview.removeEventListener('click', window.form.photosClickHandler);
    window.form.photosPreview.removeEventListener('keydown', window.form.photosKeyDownHandler);
    window.form.buttonClear.removeEventListener('click', clearButtonClickHandler);
    window.filters.form.removeEventListener('change', window.filters.formChangeHandler);
  };

  disablePage();

  /**
   * Перевод страницы в активное состояние
   */
  var enablePage = function () {
    window.locality.mainPin.removeEventListener('mousedown', mainPinMouseDownHandler);
    window.locality.mainPin.removeEventListener('keydown', mainPinKeyDownHandler);
    window.locality.getAddress(true);

    window.backend.serverRequest(window.backend.RequestType.GET, window.backend.RequestUrl.URL_GET, showLoadedOffersHandler, errorLoadOffersHandler);

    document.addEventListener('keydown', documentKeyDownHandler);
    window.form.advert.addEventListener('change', window.form.advertChangeHandler);
    window.form.advert.addEventListener('submit', advertSubmitHandler);
    window.form.avatarUpload.addEventListener('change', window.form.avatarChangeHandler);
    window.form.photosUpload.addEventListener('change', window.form.photosChangeHandler);
    window.form.photosPreview.addEventListener('click', window.form.photosClickHandler);
    window.form.photosPreview.addEventListener('keydown', window.form.photosKeyDownHandler);
    window.form.buttonClear.addEventListener('click', clearButtonClickHandler);
    window.filters.form.addEventListener('change', window.filters.formChangeHandler);
  };

  window.map = {
    workspace: workspace,
    workspaceFilters: workspaceFilters
  };

})();
