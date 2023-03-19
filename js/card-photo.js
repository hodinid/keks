'use strict';

(function () {

  /**
   * Создание окна для отображения изображения объявления
   * @param {string} imageSrc - адрес изображения, которое будет отображено
   * @return {HTMLElement} - элемент для отображения на странице
   */
  var createPhotoDisplay = function (imageSrc) {
    var container = document.createElement('div');

    var itemImage = document.createElement('img');
    itemImage.src = imageSrc;

    var itemButton = document.createElement('button');
    itemButton.setAttribute('type', 'button');
    itemButton.classList.add(window.utils.ClassForManipulation.BUTTON_CLOSE);

    container.classList.add(window.utils.ClassForManipulation.MAP_CARD_PHOTO);
    container.appendChild(itemImage);
    container.appendChild(itemButton);

    return container;
  };

  /**
   * Закрытие окна изображения
   */
  var closePhotoDisplay = function () {
    var mapCardPhoto = document.querySelector('.' + window.utils.ClassForManipulation.MAP_CARD_PHOTO);
    if (mapCardPhoto) {
      mapCardPhoto.remove();
    }
  };

  /**
   * Отображение окна изображения
   * @param {event} evt
   */
  var renderPhotoDisplay = function (evt) {
    closePhotoDisplay();
    document.querySelector('.popup').appendChild(createPhotoDisplay(evt.target.src));
    document.querySelector('.' + window.utils.ClassForManipulation.MAP_CARD_PHOTO).querySelector('.' + window.utils.ClassForManipulation.BUTTON_CLOSE).addEventListener('click', buttonClosePhotoItemClickHandler);
  };

  /**
   * Помощник, обеспечивающий закрытие окна по клику по кнопке закрытия
   */
  var buttonClosePhotoItemClickHandler = function () {
    closePhotoDisplay();
  };

  /**
   * Помощник, обеспечивающий открытие окна изображения
   * @param {event} evt
   */
  var photoItemClickHandler = function (evt) {
    renderPhotoDisplay(evt);
  };

  window.cardPhoto = {
    closePhotoDisplay: closePhotoDisplay,
    photoItemClickHandler: photoItemClickHandler
  };
})();
