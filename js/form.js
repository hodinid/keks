'use strict';

(function () {

  /**
   * Ограничения для полей формы объявления
   */
  var FieldLimit = {
    MIN_TITLE_LENGTH: 30,
    MAX_TITLE_LENGTH: 100,
    MAX_PRICE: 1000000,
    MAX_ROOMS: 100,
    MIN_CAPACITY: 0
  };

  /**
   * Формы объявления и ее поля
   */
  var advert = document.querySelector('.ad-form');
  var fieldsets = advert.querySelectorAll('input, select, button, label, fieldset');
  var selects = advert.querySelectorAll('select');
  var avatarUpload = advert.querySelector('#avatar');
  var avatarPreviewHeader = advert.querySelector('.ad-form-header__preview');
  var avatarPreview = advert.querySelector('[class="ad-form-header__preview"] img');
  var avatarPreviewSrc = avatarPreview.src;
  var title = advert.querySelector('#title');
  var room = advert.querySelector('#room_number');
  var capacity = advert.querySelector('#capacity');
  var address = advert.querySelector('#address');
  var type = advert.querySelector('#type');
  var price = advert.querySelector('#price');
  var timeIn = advert.querySelector('#timein');
  var timeOut = advert.querySelector('#timeout');
  var photosUpload = advert.querySelector('#images');
  var photosPreview = advert.querySelector('.ad-form__photo');
  var buttonClear = advert.querySelector('.ad-form__reset');

  /**
   * Установка параметров для названия объявления
   */
  var setRequirementsTitle = function () {
    title.setAttribute('minlength', FieldLimit.MIN_TITLE_LENGTH);
    title.setAttribute('maxlength', FieldLimit.MAX_TITLE_LENGTH);
    title.setAttribute('required', true);
  };

  /**
   * Установка параметров для цены за ночь в объекте объявления
   */
  var setRequirementsPrice = function () {
    price.placeholder = window.data.housingData[type.value].price;
    price.min = window.data.housingData[type.value].price;
    price.max = FieldLimit.MAX_PRICE;
    price.setAttribute('required', true);
  };

  /**
   * Установка параметров по типам файлов для полей аватара автора и фотографий объекта объявления
   */
  var setRequirementsImages = function () {
    avatarUpload.setAttribute('accept', '.png, .jpeg, .jpg, .gif');
    photosUpload.setAttribute('accept', '.png, .jpeg, .jpg, .gif');
  };

  /**
   * Установка параметров для адреса объекта объявления
   */
  var setRequirementsAddress = function () {
    address.setAttribute('readonly', true);
    address.classList.add(window.utils.ClassForManipulation.ADFORM_DISABLED);
  };

  /**
   * Валидация количества гостей и комнат
   */
  var validateRoomAndCapacity = function () {
    switch (true) {
      case (room.value === FieldLimit.MAX_ROOMS.toString() && capacity.value !== FieldLimit.MIN_CAPACITY.toString()):
        room.setCustomValidity('Для выбранного количества комнат размещение гостей невозможно');
        break;
      case (room.value !== FieldLimit.MAX_ROOMS.toString() && capacity.value === '0'):
        capacity.setCustomValidity('Выбранное количество комнат предназначено для гостей');
        break;
      case (room.value < capacity.value && capacity.value !== 0):
        capacity.setCustomValidity('Количество гостей больше, чем комнат. Пожалуйста, укажите количество гостей, равное или меньшее, чем количество комнат');
        break;
      default:
        room.setCustomValidity('');
        capacity.setCustomValidity('');
    }
  };

  /**
   * Валидация времени прибытия/отбытия
   * @param {event} evt
   */
  var validateTime = function (evt) {
    if (evt.target === timeIn) {
      timeOut.value = timeIn.value;
    }
    if (evt.target === timeOut) {
      timeIn.value = timeOut.value;
    }
  };

  /**
   * Валидация цены в зависимости от типа жилья
   * @param {event} evt
   */
  var validatePrice = function (evt) {
    if (evt.target === type) {
      price.placeholder = window.data.housingData[type.value].price;
      price.min = window.data.housingData[type.value].price;
    }
  };

  /**
   * Валидация формы объявления
   * @param {event} evt
   */
  var validateAllFields = function (evt) {
    validatePrice(evt);
    validateTime(evt);
    validateRoomAndCapacity();
  };

  /**
   * Помощник, вызывающий валидацию данных формы
   * @param {event} evt
   */
  var advertChangeHandler = function (evt) {
    validateAllFields(evt);
  };

  /**
   * Помощник, отслеживавающий изменение аватара автора объявления
   */
  var avatarChangeHandler = function () {
    window.utils.displayPreviewImage(avatarUpload, avatarPreview, false);
    avatarPreviewHeader.classList.add(window.utils.ClassForManipulation.AVATAR_IMAGE);
    avatarPreviewHeader.setAttribute('tabindex', 0);
    avatarPreviewHeader.addEventListener('click', avatarPreviewHeaderClickHandler);
    avatarPreviewHeader.addEventListener('keydown', avatarPreviewHeaderkeyDownHandler);
  };

  /**
   * Помощник, добавляющий возможность удаления добавленного изображения аватара по клику
   */
  var avatarPreviewHeaderClickHandler = function () {
    resetAdFormAvatar();
  };

  /**
   * Помощник, добавляющий возможность удаления добавленного изображения аватара по нажатию клавишу клавиатуры
   * @param {event} evt
   */
  var avatarPreviewHeaderkeyDownHandler = function (evt) {
    if (evt.keyCode === window.utils.KeyCode.ENTER) {
      resetAdFormAvatar();
    }
  };

  /**
   * Помощник, отслеживавающий изменение фотографий объекта
   */
  var photosChangeHandler = function () {
    window.utils.displayPreviewImage(photosUpload, photosPreview, true, window.utils.createImageElement());
    photosPreview.classList.add(window.utils.ClassForManipulation.PHOTO_IMAGE_CONTAINER);
  };

  /**
   * Помощник, отслеживавающий нажатия на фотографии объекта
   */
  var photosClickHandler = function () {
    if (photosPreview.children.length === 0) {
      photosPreview.classList.remove(window.utils.ClassForManipulation.PHOTO_IMAGE_CONTAINER);
    }
  };

  /**
   * Помощник, отслеживавающий клавиатурные нажатия на фотографии объекта
   * @param {event} evt
   */
  var photosKeyDownHandler = function (evt) {
    if (evt.keyCode === window.utils.KeyCode.ENTER) {
      if (photosPreview.children.length === 0) {
        photosPreview.classList.remove(window.utils.ClassForManipulation.PHOTO_IMAGE_CONTAINER);
      }
    }
  };

  /**
   * Возврат блока аватара автора к значениям по умолчанию
   */
  var resetAdFormAvatar = function () {
    avatarPreview.src = avatarPreviewSrc;
    avatarPreviewHeader.classList.remove(window.utils.ClassForManipulation.AVATAR_IMAGE);
    avatarPreviewHeader.removeAttribute('tabindex');
    avatarPreviewHeader.removeEventListener('click', avatarPreviewHeaderClickHandler);
    avatarPreviewHeader.removeEventListener('keydown', avatarPreviewHeaderkeyDownHandler);
  };

  /**
   * Возврат блоков аватара автора и фотографий объекта к значениям по умолчанию
   */
  var resetPhotosAndAvatar = function () {
    resetAdFormAvatar();
    photosPreview.innerHTML = '';
    photosPreview.classList.remove(window.utils.ClassForManipulation.PHOTO_IMAGE_CONTAINER);
  };

  window.form = {
    advert: advert,
    fieldsets: fieldsets,
    selects: selects,
    address: address,
    avatarPreviewSrc: avatarPreviewSrc,
    avatarUpload: avatarUpload,
    photosUpload: photosUpload,
    photosPreview: photosPreview,
    buttonClear: buttonClear,

    setRequirementsTitle: setRequirementsTitle,
    setRequirementsPrice: setRequirementsPrice,
    setRequirementsImages: setRequirementsImages,
    setRequirementsAddress: setRequirementsAddress,

    validateAllFields: validateAllFields,
    resetPhotosAndAvatar: resetPhotosAndAvatar,

    advertChangeHandler: advertChangeHandler,
    avatarChangeHandler: avatarChangeHandler,
    photosChangeHandler: photosChangeHandler,
    photosClickHandler: photosClickHandler,
    photosKeyDownHandler: photosKeyDownHandler
  };

})();
