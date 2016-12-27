var utils = rootRequire('utils/utils');

module.exports = {
  getPictureData: function () {
    var firstArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var secondArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
      12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    var retArray = [];
    for (var i = 0; i < 12; i++) {
      var firstIndex = utils.randomInt(0, firstArray.length - 1);
      var secondIndex = utils.randomInt(0, secondArray.length - 1);
      var a = firstArray[firstIndex];
      firstArray.splice(firstIndex, 1);
      var b = secondArray[secondIndex];
      secondArray.splice(secondIndex, 1);
      var thirdIndex = utils.randomInt(0, secondArray.length - 1);
      var c = secondArray[thirdIndex];
      secondArray.splice(thirdIndex, 1);
      var obj = {a: a, b: b, c: c};
      retArray.push(obj);
    }
    return {answer: retArray};
  },
  getGuessData: function () {
    return {answer: utils.randomInt(1, 9)};
  }
};