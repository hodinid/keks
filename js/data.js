'use strict';

(function () {

  /**
   * Массив объявлений
   */
  var offers = [];

  /**
   * Параметры жилья
   */
  var housingData = {
    palace: {
      type: 'Дворец',
      price: 10000
    },

    house: {
      type: 'Дом',
      price: 5000
    },

    flat: {
      type: 'Квартира',
      price: 1000
    },

    bungalo: {
      type: 'Бунгало',
      price: 0
    }
  };

  window.data = {
    offers: offers,
    housingData: housingData
  };

})();
