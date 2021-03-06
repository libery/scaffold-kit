const error = require('../error');

let destination;

const destinationRegistry = {
  set(dest) {
    if (destination) {
      throw error('set destination twice.');
    }
    destination = dest;
  },
  get() {
    return destination;
  },
  has() {
    return !!destination;
  },
  reset() {
    destination = undefined;
  }
};

module.exports = destinationRegistry;
