/* eslint-disable max-classes-per-file */

class LinkedListNode {
  constructor (data, next = null) {
    this.data = data;
    this.next = next;
  }
}

const isValid = (input) => {
  // Check type
  const isArray = input instanceof Array;
  if (!isArray) throw new TypeError('Please enter an array.');
  // Check length
  const isLongEnough = input.length > 1;
  if (!isLongEnough) throw new Error('Please enter an array a, such that a.length > 1.');
  return true;
};

export default class CircularLinkedList {
  constructor (input) {
    if (isValid(input)) {
      const dummy = new LinkedListNode(null);
      let tail = dummy;
      for (let i = 0; i < input.length; i++) {
        const element = input.at(i);
        tail.next = new LinkedListNode(element);
        tail = tail.next;
      }
      const head = dummy.next;
      tail.next = head;
      this.head = head;
    }
  }
}
