const lib = /*config.ENV === 'production' ?*/ './magic' //: './admin'
export default require(lib)
