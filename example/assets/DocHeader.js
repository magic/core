module.exports = {
  View: () => header({ class: 'sub' }, [
    h3('Contents:'),
    Menu.View({ name: 'docMenu' }),
  ]),
}