/**
 * Application-owned ReduceStore base class replacing 'flux/utils'.
 * Matches 100% of the ReduceStore public and internal contract used
 * by WeVote WebApp stores, including addListener({ remove }),
 * getState(), areEqual(), and change notification lifecycles.
 */
class ReduceStore {
  constructor (dispatcher) {
    if (!dispatcher || typeof dispatcher.register !== 'function') {
      throw new TypeError(`${this.constructor.name} constructor requires a Dispatcher instance.`);
    }

    this.__className = this.constructor.name;
    this.__changeEvent = 'change';
    this._dispatcher = dispatcher;
    this._changed = false;
    this._listeners = new Map();
    this._listenerIdCounter = 1;

    // Subclasses construct their initial state
    this._state = this.getInitialState();

    // Register with Dispatcher
    this._dispatchToken = dispatcher.register((action) => {
      this.__invokeOnDispatch(action);
    });
  }

  /**
   * Getter that exposes the entire state of this store.
   */
  getState () {
    return this._state;
  }

  /**
   * Constructs the initial state for this store. Subclasses must override this.
   */
  getInitialState () {
    throw new Error(`${this.constructor.name} must override getInitialState().`);
  }

  /**
   * Reduces an incoming action to update state. Subclasses must override this.
   */
  reduce (state, action) { // eslint-disable-line no-unused-vars
    throw new Error(`${this.constructor.name} must override reduce(state, action).`);
  }

  /**
   * Checks if two versions of state are the same. Defaults to strict equality (===).
   */
  areEqual (one, two) {
    return one === two;
  }

  /**
   * Subscribes a listener to change events.
   * Returns a subscription token with a remove() method.
   */
  addListener (callback) {
    if (typeof callback !== 'function') {
      throw new TypeError(`${this.constructor.name}.addListener(...): Expected callback to be a function.`);
    }
    const id = this._listenerIdCounter;
    this._listenerIdCounter += 1;
    this._listeners.set(id, callback);

    return {
      remove: () => {
        this._listeners.delete(id);
      },
    };
  }

  getDispatcher () {
    return this._dispatcher;
  }

  getDispatchToken () {
    return this._dispatchToken;
  }

  hasChanged () {
    return this._changed;
  }

  __emitChange () {
    this._changed = true;
  }

  __invokeOnDispatch (action) {
    this._changed = false;

    const startingState = this._state;
    const endingState = this.reduce(startingState, action);

    if (endingState === undefined) {
      throw new Error(
        `${this.constructor.name} returned undefined from reduce(...). Did you forget to return state in the default case?`,
      );
    }

    if (!this.areEqual(startingState, endingState)) {
      this._state = endingState;
      this.__emitChange();
    }

    if (this._changed) {
      this.__emit();
    }
  }

  __emit () {
    // Take a snapshot so listener additions/removals during emission do not alter traversal
    const currentListeners = Array.from(this._listeners.values());
    for (let i = 0; i < currentListeners.length; i += 1) {
      currentListeners[i]();
    }
  }
}

export { ReduceStore };
export default ReduceStore;
