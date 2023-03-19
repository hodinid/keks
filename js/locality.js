'use strict';

(function () {

  var MAIN_PIN_AFTER_HEIGHT = 17;

  /**
   * Ограничения рабочей области карты
   */
  var LOCATION = {
    X_MIN: 0,
    Y_MIN: 130,
    Y_MAX: 630
  };
  var locationXMax = Math.floor(document.querySelector('.map__overlay').offsetWidth);

  /**
   * Главная метка
   */
  var mainPin = document.querySelector('.map__pin--main');

  /**
   * Получение координат по умолчанию для главной метке
   * @return {Object}
   */
  var getMainPinDefaultCoordinates = function () {
    return {
      x: mainPin.style.left,
      y: mainPin.style.top
    };
  };

  /**
   * Хранение координат по умолчанию главной метки
   */
  var defaultCoordinate = getMainPinDefaultCoordinates();

  /**
   * Установка координат по умолчанию для главной метки
   */
  var setMainPinDefaultCoordinate = function () {
    mainPin.style.left = defaultCoordinate.x;
    mainPin.style.top = defaultCoordinate.y;
  };

  /**
   * Ограничения для перемещения главной метки
   */
  var limitMainPin = {
    left: LOCATION.X_MIN - Math.round(mainPin.offsetWidth / 2),
    right: locationXMax - Math.round(mainPin.offsetWidth / 2),
    top: LOCATION.Y_MIN - mainPin.offsetHeight - MAIN_PIN_AFTER_HEIGHT,
    bottom: LOCATION.Y_MAX - mainPin.offsetHeight - MAIN_PIN_AFTER_HEIGHT
  };

  /**
   * Получение адреса
   * @param {boolean} isEnablePage - true - при переводе страницы в активное состояние
   */
  var getAddress = function (isEnablePage) {
    var adFormAddressX = Math.round(parseInt(mainPin.style.left, 10) + Math.round(mainPin.offsetWidth / 2));
    var adFormAddressY = Math.round(parseInt(mainPin.style.top, 10) + Math.round(mainPin.offsetWidth / 2));
    if (isEnablePage) {
      adFormAddressY += Math.round(mainPin.clientHeight / 2) + MAIN_PIN_AFTER_HEIGHT;
    }
    window.form.address.value = adFormAddressX + ', ' + adFormAddressY;
  };

  /**
   * Проверка области перемещения
   */
  var checkLimitMainPinCoordinates = function () {
    if (mainPin.offsetLeft <= limitMainPin.left) {
      mainPin.style.left = limitMainPin.left + 'px';
    }
    if (mainPin.offsetLeft >= limitMainPin.right) {
      mainPin.style.left = limitMainPin.right + 'px';
    }
    if (mainPin.offsetTop <= limitMainPin.top) {
      mainPin.style.top = limitMainPin.top + 'px';
    }
    if (mainPin.offsetTop >= limitMainPin.bottom) {
      mainPin.style.top = limitMainPin.bottom + 'px';
    }
  };

  /**
   * Прослушка событий на главной метке
   */
  mainPin.addEventListener('mousedown', function (evt) {
    if (evt.buttons === 1) {
      evt.preventDefault();

      var startCoordinates = {
        x: evt.clientX,
        y: evt.clientY
      };

      var mainPinMouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();

        var newCoordinates = {
          x: startCoordinates.x - moveEvt.clientX,
          y: startCoordinates.y - moveEvt.clientY
        };

        startCoordinates = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        mainPin.style.left = mainPin.offsetLeft - newCoordinates.x + 'px';
        mainPin.style.top = mainPin.offsetTop - newCoordinates.y + 'px';

        checkLimitMainPinCoordinates();
        getAddress(true);
      };

      var mainPinMouseUpHandler = function () {
        document.removeEventListener('mousemove', mainPinMouseMoveHandler);
        document.removeEventListener('mouseup', mainPinMouseUpHandler);
      };

      document.addEventListener('mousemove', mainPinMouseMoveHandler);
      document.addEventListener('mouseup', mainPinMouseUpHandler);
    }
  });

  window.locality = {
    mainPin: mainPin,
    getAddress: getAddress,
    setMainPinDefaultCoordinate: setMainPinDefaultCoordinate
  };

})();
