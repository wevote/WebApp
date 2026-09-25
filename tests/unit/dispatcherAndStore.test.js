/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import FluxDispatcher from '../../src/js/common/dispatcher/FluxDispatcher';
import { ReduceStore } from '../../src/js/common/dispatcher/ReduceStore';

describe('FluxDispatcher', () => {
  let dispatcher;

  beforeEach(() => {
    dispatcher = new FluxDispatcher();
  });

  it('registers callbacks and returns unique token IDs', () => {
    const token1 = dispatcher.register(() => {});
    const token2 = dispatcher.register(() => {});
    expect(token1).to.equal('ID_1');
    expect(token2).to.equal('ID_2');
  });

  it('throws TypeError when registering a non-function', () => {
    expect(() => dispatcher.register(null)).to.throw(TypeError);
    expect(() => dispatcher.register('notAFunction')).to.throw(TypeError);
  });

  it('unregisters callbacks successfully', () => {
    let called = false;
    const token = dispatcher.register(() => {
      called = true;
    });
    dispatcher.unregister(token);
    dispatcher.dispatch({ type: 'TEST' });
    expect(called).to.be.false;
  });

  it('throws error when unregistering an invalid or already unregistered token', () => {
    expect(() => dispatcher.unregister('INVALID_ID')).to.throw(Error);
  });

  it('broadcasts dispatched payloads to all registered callbacks', () => {
    const events = [];
    dispatcher.register((action) => events.push(`A:${action.type}`));
    dispatcher.register((action) => events.push(`B:${action.type}`));

    dispatcher.dispatch({ type: 'LOGIN' });
    expect(events).to.deep.equal(['A:LOGIN', 'B:LOGIN']);
  });

  it('waitFor executes registered callbacks in specified order', () => {
    const executionOrder = [];
    let tokenB;

    dispatcher.register(() => {
      dispatcher.waitFor([tokenB]);
      executionOrder.push('A');
    });

    tokenB = dispatcher.register(() => {
      executionOrder.push('B');
    });

    dispatcher.dispatch({ type: 'SYNC' });
    expect(executionOrder).to.deep.equal(['B', 'A']);
  });

  it('waitFor detects circular dependencies and throws', () => {
    let tokenB;

    const tokenA = dispatcher.register(() => {
      dispatcher.waitFor([tokenB]);
    });

    tokenB = dispatcher.register(() => {
      dispatcher.waitFor([tokenA]);
    });

    expect(() => dispatcher.dispatch({ type: 'CIRCULAR' })).to.throw(/Circular dependency/);
  });

  it('queues nested dispatches in FIFO order without throwing', () => {
    const sequence = [];

    dispatcher.register((action) => {
      sequence.push(`receive:${action.type}`);
      if (action.type === 'FIRST') {
        // Nested dispatch inside an active dispatch cycle
        dispatcher.dispatch({ type: 'SECOND' });
      }
    });

    dispatcher.dispatch({ type: 'FIRST' });
    expect(sequence).to.deep.equal(['receive:FIRST', 'receive:SECOND']);
  });

  it('resets dispatching state even if a callback throws an error', () => {
    dispatcher.register((action) => {
      if (action.type === 'FAIL') {
        throw new Error('Callback failed');
      }
    });

    expect(() => dispatcher.dispatch({ type: 'FAIL' })).to.throw('Callback failed');
    expect(dispatcher.isDispatching()).to.be.false;

    // Subsequent dispatch should succeed cleanly
    let recovered = false;
    dispatcher.register(() => {
      recovered = true;
    });
    dispatcher.dispatch({ type: 'RECOVER' });
    expect(recovered).to.be.true;
  });
});

describe('ReduceStore', () => {
  let dispatcher;

  class TestStore extends ReduceStore {
    getInitialState () {
      return { count: 0, text: 'initial' };
    }

    reduce (state, action) {
      switch (action.type) {
        case 'INCREMENT':
          return { ...state, count: state.count + (action.amount || 1) };
        case 'UPDATE_TEXT':
          return { ...state, text: action.text };
        case 'SAME_STATE':
          return state; // returns exact same reference
        case 'RETURN_UNDEFINED':
          return undefined;
        default:
          return state;
      }
    }
  }

  beforeEach(() => {
    dispatcher = new FluxDispatcher();
  });

  it('throws TypeError if constructed without a valid dispatcher', () => {
    expect(() => new TestStore(null)).to.throw(TypeError);
    expect(() => new TestStore({})).to.throw(TypeError);
  });

  it('initializes with getInitialState()', () => {
    const store = new TestStore(dispatcher);
    expect(store.getState()).to.deep.equal({ count: 0, text: 'initial' });
  });

  it('reduces actions and updates state', () => {
    const store = new TestStore(dispatcher);
    dispatcher.dispatch({ type: 'INCREMENT', amount: 5 });
    expect(store.getState().count).to.equal(5);

    dispatcher.dispatch({ type: 'UPDATE_TEXT', text: 'updated' });
    expect(store.getState().text).to.equal('updated');
  });

  it('emits change events to subscribed listeners when state changes', () => {
    const store = new TestStore(dispatcher);
    let notifications = 0;

    const subscription = store.addListener(() => {
      notifications += 1;
    });

    dispatcher.dispatch({ type: 'INCREMENT' });
    expect(notifications).to.equal(1);

    dispatcher.dispatch({ type: 'INCREMENT' });
    expect(notifications).to.equal(2);

    // If state did not change (areEqual returns true), no notification should be emitted
    dispatcher.dispatch({ type: 'SAME_STATE' });
    expect(notifications).to.equal(2);

    // After removing listener, no more notifications
    subscription.remove();
    dispatcher.dispatch({ type: 'INCREMENT' });
    expect(notifications).to.equal(2);
  });

  it('supports multiple independent listeners using the same callback function', () => {
    const store = new TestStore(dispatcher);
    let callCount = 0;
    const callback = () => {
      callCount += 1;
    };

    const sub1 = store.addListener(callback);
    const sub2 = store.addListener(callback);

    dispatcher.dispatch({ type: 'INCREMENT' });
    expect(callCount).to.equal(2);

    // Removing sub1 should leave sub2 active
    sub1.remove();
    dispatcher.dispatch({ type: 'INCREMENT' });
    expect(callCount).to.equal(3);

    sub2.remove();
    dispatcher.dispatch({ type: 'INCREMENT' });
    expect(callCount).to.equal(3);
  });

  it('safely handles listener removal during emission', () => {
    const store = new TestStore(dispatcher);
    let sub2Called = false;

    const sub1 = {
      subscription: null,
    };
    sub1.subscription = store.addListener(() => {
      sub1.subscription.remove();
    });

    store.addListener(() => {
      sub2Called = true;
    });

    expect(() => dispatcher.dispatch({ type: 'INCREMENT' })).to.not.throw();
    expect(sub2Called).to.be.true;
  });

  it('throws error when reduce returns undefined', () => {
    // eslint-disable-next-line no-new
    new TestStore(dispatcher);
    expect(() => dispatcher.dispatch({ type: 'RETURN_UNDEFINED' })).to.throw(/returned undefined/);
  });

  it('exposes getDispatcher(), getDispatchToken(), and hasChanged()', () => {
    const store = new TestStore(dispatcher);
    expect(store.getDispatcher()).to.equal(dispatcher);
    expect(store.getDispatchToken()).to.be.a('string');
    expect(store.hasChanged()).to.be.false;
  });
});

describe('Store Integration (ActivityStore & Dispatcher)', () => {
  // eslint-disable-next-line global-require
  const Dispatcher = require('../../src/js/common/dispatcher/Dispatcher').default;
  // eslint-disable-next-line global-require
  const ActivityStore = require('../../src/js/stores/ActivityStore').default;

  it('ActivityStore initializes and responds to dispatched actions via the singleton Dispatcher', () => {
    expect(ActivityStore.allActivity()).to.be.an('array');

    let listenerTriggered = false;
    const sub = ActivityStore.addListener(() => {
      listenerTriggered = true;
    });

    Dispatcher.dispatch({
      type: 'activityListRetrieve',
      res: {
        success: true,
        activity_list: [
          {
            we_vote_id: 'wv01act123',
            statement_text: 'Voted early!',
          },
        ],
      },
    });

    expect(listenerTriggered).to.be.true;
    expect(ActivityStore.allActivity()).to.have.lengthOf(1);
    expect(ActivityStore.allActivity()[0].we_vote_id).to.equal('wv01act123');

    sub.remove();
  });

  it('ReadyStore initializes, updates state upon voterPlansForVoterRetrieve, and notifies subscribers', () => {
    // eslint-disable-next-line global-require
    const ReadyStore = require('../../src/js/stores/ReadyStore').default;

    expect(ReadyStore.getVoterPlansForVoterRetrieved()).to.be.false;

    let notified = false;
    const sub = ReadyStore.addListener(() => {
      notified = true;
    });

    Dispatcher.dispatch({
      type: 'voterPlansForVoterRetrieve',
      res: {
        success: true,
        voter_plan_list: [
          {
            google_civic_election_id: 1000,
            show_to_public: true,
            voter_plan_text: 'I will vote by mail on Tuesday',
          },
        ],
      },
    });

    expect(notified).to.be.true;
    expect(ReadyStore.getVoterPlansForVoterRetrieved()).to.be.true;
    expect(ReadyStore.getVoterPlanTextForVoterByElectionId(1000)).to.equal('I will vote by mail on Tuesday');

    sub.remove();
  });
});


