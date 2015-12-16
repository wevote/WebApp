import EventEmitter from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

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
            this.removeChangeListener(CHANGE_EVENT, callback);
        }

    }, mixin);

    return store;
}

export function mergeIntoStore (store, data) {
    let key, a;

    for(key in data) {
        store[key] = data[key];
    }

}
