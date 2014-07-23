var LETTER_NUMBER_REGEX = /^[0-9a-z\s]+$/i;

NonEmptyStringNoSpecialCharacters = Match.Where(function (x) {
  check(x, String);
  return x.trim().length !== 0 && LETTER_NUMBER_REGEX.test(x);
});