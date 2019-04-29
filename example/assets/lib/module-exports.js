const string = 'this string gets exported using module.exports'
module.exports = a => b(`${string} the argument it received was ${a}`)
