var LETTER_NUMBER_REGEX = /^[0-9a-z\s]+$/i;
var LETTER_NUMBER_NO_SPACE_REGEX = /^[0-9a-z]+$/i;

NoFoodzString = Match.Where(function (x) {
  check(x, String);
  return x.trim().length !== 0 && x.length < 400;
});

NonEmptyStringNoSpaceCharacters = Match.Where(function (x) {
  check(x, String);
  return x.trim().length !== 0 && LETTER_NUMBER_NO_SPACE_REGEX.test(x);
});

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
  return x === NoFoodz.consts.db.FOOD || x === NoFoodz.consts.db.DRINK;
});

FoodSubTypeCheck = Match.Where(function (x) {
  check(x, String);
  return x === "alcohol" || x === "default";
});

PageNumber = Match.Where(function (x) {
  check(x, Number);
  return x < 101 && x > 0;
});

TypeCheck = Match.Where(function (x) {
  check(x, String);
  return x.toLowerCase() === "food" || x.toLowerCase() === "brand";
});

NullCheck = Match.Where(function (x) {
	check(x, Object);	
  return x;
});

InfoCheck = Match.Where(function (x) {
	check(x, Object);	
  return x;
});

InfoCheckMap = {
	subtype : FoodSubTypeCheck
};