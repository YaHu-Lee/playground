const transform = {
  0: [{
    accept: /{/,
    state: 'identifier:{'
  }, {
    accept: /}/,
    state: 'identifier:}'
  }, {
    accept: '(',
    state: 'identifier:('
  }, {
    accept: ')',
    state: 'identifier:)'
  }, {
    accept: ':',
    state: 'identifier::'
  }, {
    accept: ',',
    state: 'identifier:,'
  }, {
    accept: '+',
    state: 'identifier:+'
  }, {
    accept: /[a-zA-Z]/
  }]
}