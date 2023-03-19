'use strict';

(function () {

  /**
   * Параметры меток и их количество
   */
  var PinParameter = {
    PIN_WIDTH: 50,
    PIN_HEIGHT: 70,
    PINS_QUANTITY: 5
  };

  /**
   * Шаблон метки
   */
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  /**
   * Помощник, открывающий карточку объявления по клику на метке
   * @param {event} evt
   */
  var pinClickHandler = function (evt) {
    var targetPin = evt.target.closest('button[offer-id]');
    window.card.open(window.filters.filteringOffers(window.data.offers)[targetPin.getAttribute('offer-id')]);
    targetPin.classList.add(window.utils.ClassForManipulation.PIN_ACTIVE);
  };

  /**
   * Отрисовка метки объявления с учетом размеров метки
   * @param {Object} offerItem - элемент массива объявлений
   * @param {number} i - идентификатор элемента массива объявлений
   * @return {HTMLElement} - метка для добавления на карту
   */
  var render = function (offerItem, i) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.querySelector('img').src = offerItem.author.avatar;
    pinElement.querySelector('img').alt = offerItem.offer.title;
    pinElement.style.left = (offerItem.location.x - PinParameter.PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (offerItem.location.y - PinParameter.PIN_HEIGHT) + 'px';

    pinElement.setAttribute('offer-id', i);
    pinElement.addEventListener('click', pinClickHandler);

    return pinElement;
  };

  /**
   * Размещение объявлений
   * @param {array} items - массив объявлений
   * @return {HTMLElement} - фрагмент документа с HTML-элементами меток для добавления
   */
  var place = function (items) {
    var pinsCount = items.length > PinParameter.PINS_QUANTITY ? PinParameter.PINS_QUANTITY : items.length;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pinsCount; i++) {
      fragment.appendChild(render(items[i], i));
    }
    return fragment;
  };

  /**
   * Удаление меток с карты
   */
  var remove = function () {
    document.querySelectorAll('button[offer-id]').forEach(function (pinItem) {
      pinItem.remove();
    });
  };

  /**
   * Обновление меток на карте
   */
  var update = window.utils.debounce(function () {
    window.map.workspace.insertBefore(window.pins.place(window.filters.filteringOffers(window.data.offers)), window.map.workspaceFilters);
  });

  window.pins = {
    PinParameter: PinParameter,
    render: render,
    place: place,
    remove: remove,
    update: update
  };

})();
