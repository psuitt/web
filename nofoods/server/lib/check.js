var LETTER_NUMBER_REGEX = /^[0-9a-z\s]+$/i;

NonEmptyStringNoSpecialCharacters = Match.Where(function (x) {
  check(x, String);
  return x.trim().length !== 0 && LETTER_NUMBER_REGEX.test(x);
});

NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

RatingCheck = Match.Where(function (x) {
  check(x, Number);
  return x === 1 || x === 2 || x === 3 || x === 4 || x === 5 || x === 6;
});

FoodTypeCheck = Match.Where(function (x) {
  check(x, String);
  return x === "Drink" || x === "Food";
});