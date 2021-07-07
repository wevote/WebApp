export default function factory (promiseFactory) {
  if (promiseFactory instanceof Array !== true) throw new Error('wrong type');

  const firstPromiseFn = promiseFactory.shift();

  if (firstPromiseFn instanceof Function !== true) throw new Error('first promise is not function');

  promiseFactory.reduce((curr, next) => {
    if (next instanceof Function !== true) throw new Error('next is not a function');
    return curr.then((data) => new Promise(next.bind(data)));
  }, new Promise(firstPromiseFn));
}
