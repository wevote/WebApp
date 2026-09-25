const PREFIX = 'ID_';

/**
 * Application-owned FluxDispatcher replacing the archived 'flux' library.
 * Preserves the exact registration, unregistration, and waitFor() semantics of
 * Facebook Flux, while adding safe FIFO queueing for nested/re-entrant dispatches
 * to eliminate 'Cannot dispatch in the middle of a dispatch' runtime errors.
 */
class FluxDispatcher {
  constructor () {
    this._callbacks = {};
    this._isDispatching = false;
    this._isHandled = {};
    this._isPending = {};
    this._lastID = 1;
    this._pendingPayload = null;
    this._actionQueue = [];
  }

  /**
   * Registers a callback to be invoked with every dispatched payload.
   * Returns a token string that can be used with waitFor() or unregister().
   */
  register (callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('FluxDispatcher.register(...): Expected callback to be a function.');
    }
    const id = `${PREFIX}${this._lastID}`;
    this._lastID += 1;
    this._callbacks[id] = callback;
    return id;
  }

  /**
   * Removes a callback based on its token.
   */
  unregister (id) {
    if (!this._callbacks[id]) {
      throw new Error(`FluxDispatcher.unregister(...): '${id}' does not map to a registered callback.`);
    }
    delete this._callbacks[id];
  }

  /**
   * Waits for the callbacks specified by tokens to be invoked before
   * continuing execution of the current callback.
   */
  waitFor (ids) {
    if (!this._isDispatching) {
      throw new Error('FluxDispatcher.waitFor(...): Must be invoked while dispatching.');
    }
    if (!Array.isArray(ids)) {
      throw new TypeError('FluxDispatcher.waitFor(...): Expected array of token ids.');
    }
    for (let i = 0; i < ids.length; i += 1) {
      const id = ids[i];
      if (this._isPending[id]) {
        if (!this._isHandled[id]) {
          throw new Error(`FluxDispatcher.waitFor(...): Circular dependency detected while waiting for '${id}'.`);
        }
        // Already handled, continue
      } else {
        if (!this._callbacks[id]) {
          throw new Error(`FluxDispatcher.waitFor(...): '${id}' does not map to a registered callback.`);
        }
        this._invokeCallback(id);
      }
    }
  }

  /**
   * Returns true if this Dispatcher is currently dispatching.
   */
  isDispatching () {
    return this._isDispatching;
  }

  /**
   * Dispatches a payload to all registered callbacks.
   * If already dispatching, queues payload in FIFO order to prevent re-entrant crashes.
   */
  dispatch (payload) {
    if (this._isDispatching) {
      this._actionQueue.push(payload);
      return;
    }

    this._isDispatching = true;
    try {
      this._executeDispatch(payload);
      while (this._actionQueue.length > 0) {
        const nextPayload = this._actionQueue.shift();
        this._executeDispatch(nextPayload);
      }
    } finally {
      this._isDispatching = false;
      this._actionQueue = [];
    }
  }

  _executeDispatch (payload) {
    this._startDispatching(payload);
    try {
      const callbackKeys = Object.keys(this._callbacks);
      for (let i = 0; i < callbackKeys.length; i += 1) {
        const id = callbackKeys[i];
        if (!this._isPending[id] && this._callbacks[id]) {
          this._invokeCallback(id);
        }
      }
    } finally {
      this._stopDispatching();
    }
  }

  _invokeCallback (id) {
    this._isPending[id] = true;
    try {
      this._callbacks[id](this._pendingPayload);
    } finally {
      this._isHandled[id] = true;
    }
  }

  _startDispatching (payload) {
    const callbackKeys = Object.keys(this._callbacks);
    for (let i = 0; i < callbackKeys.length; i += 1) {
      const id = callbackKeys[i];
      this._isPending[id] = false;
      this._isHandled[id] = false;
    }
    this._pendingPayload = payload;
  }

  _stopDispatching () {
    this._pendingPayload = null;
  }
}

export default FluxDispatcher;
