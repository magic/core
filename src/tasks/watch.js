const cache = {}

const watchLoop = () => {
  setTimeout(watchLoop, 300)
}

const watch = ({ app, pages, config }) => {
  // const dirs = [
  //   path.join(config.ROOT, 'assets'
  // ]
  console.log({ app, pages, config })
}

module.exports = watch
