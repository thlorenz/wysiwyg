'use strict';

// lets hope no one puts these unicodes into their markdown ever ;)
// http://www.unicode.org/charts/PDF/U2E00.pdf
var space = '\u2e3a'
  , emptyLine = '\u2e3b'
  , spaceRegexp = new RegExp(space, 'g')
  , emptyLineRegexp = new RegExp(emptyLine, 'g')

exports.mark = function (s) {
  return s
    .replace(/ /g, space)                       // any space
    .replace(/\n\n/g, '\n' + emptyLine + '\n' + emptyLine + '\n')  // emptyLine lines
}

exports.unmark = function (s) {
  return s
    .replace(spaceRegexp, ' ')
    .replace(emptyLineRegexp, '');
}
