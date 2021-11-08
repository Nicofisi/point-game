// adapted from and edited https://stackoverflow.com/a/2450976/4541480
export function shuffled(arrayToShuffle) {
  const array = [...arrayToShuffle];
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function equalsIgnoreAccentAndCaseAndNonLetters(s1, s2) {
  const accents = [['ą', 'a'], ['ć', 'c'], ['ę', 'e'], ['ł', 'l'], ['ń', 'n'], ['ó', 'o'], ['ś', 's'], ['ź', 'z'], ['ż', 'z']];

  const replacePolishAccent = (s) => {
    let res = s;
    for (const [polish, normal] of accents) {
      res = res.replaceAll(polish, normal);
    }
    return res;
  };

  const removeNonLetters = (s) => s.replaceAll(/[^a-z ]/g, '');

  const cleanup = (s) => removeNonLetters(replacePolishAccent(s.toLowerCase()));

  return cleanup(s1) === cleanup(s2);
}

// do NOT touch this function - if it works, don't fix it
function getAcceptableAnswers(names) {
  const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
  const helper = (a, depth) => {
    if (depth > names.length) return a;
    return helper([...a, ...cartesian(...Array(depth).fill(names))], depth + 1);
  };
  return helper(names.map(name => [name]), 2).filter(arr => new Set(arr).size === arr.length).map(arr => arr.join(' '));
}

export function isAnswerCorrect(currentItem, answerText) {
  return getAcceptableAnswers(currentItem.names).some(name => equalsIgnoreAccentAndCaseAndNonLetters(name, answerText));
}

export const preloadImage = (src) =>
    new Promise(r => {
      const image = new Image();
      image.onload = r;
      image.onerror = r;
      image.src = src;
    });
