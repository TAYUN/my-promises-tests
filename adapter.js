const MyPromise = require('./MyPromise');

module.exports = {
  // 创建一个已解决的 promise
  resolved: function(value) {
    return MyPromise.resolve(value);
  },
  
  // 创建一个已拒绝的 promise
  rejected: function(reason) {
    return MyPromise.reject(reason);
  },
  
  // 创建一个延迟对象，包含 promise、resolve 和 reject
  deferred: function() {
    let resolve, reject;
    const promise = new MyPromise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    
    return {
      promise: promise,
      resolve: resolve,
      reject: reject
    };
  }
};