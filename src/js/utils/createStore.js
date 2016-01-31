import EventEmitter from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';
const MAX_LISTENERS = 300;

/**
 * create a store using a spec object as mixin
 * @param  {Object} spec object to mixin
 * @return {Store}  DataStore Object
 */
export function createStore(mixin) {
  const store = assign({}, EventEmitter.prototype, {
    emitChange() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }

  }, mixin);

  store.setMaxListeners(MAX_LISTENERS);

  return store;
}
