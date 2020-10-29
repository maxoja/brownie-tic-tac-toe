function random4DigitsStr() {
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result;
}

module.exports = {
  random4DigitsStr
}