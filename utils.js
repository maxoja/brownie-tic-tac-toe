function randomDigitsStr(length) {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result;
}

function randomHexStr(length) {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 16).toString(16)
  }
  return result;
}

function pickRandomItem(array) {
  const idx = Math.floor(Math.random() * array.length)
  return array[idx]
}

const _randomNamePool = ['Kita', 'Laika', 'Puff', 'Reo', 'Roof', 'Zep']
function randomName() {
  const randomName = pickRandomItem(_randomNamePool)
  return randomName
}

module.exports = {
  randomDigitsStr,
  randomHexStr,
  pickRandomItem,
  randomName
}