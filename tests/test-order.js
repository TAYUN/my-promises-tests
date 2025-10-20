const MyPromise = require('../src/MyPromise');

function runTest(testName, PromiseImpl, prefix = '') {
  console.log(`\n=== ${testName} ===`);
  
  // 测试1: 基本的 Promise.resolve() 返回
  PromiseImpl.resolve()
    .then(() => {
      console.log(`${prefix}0`);
      return PromiseImpl.resolve(4);
    })
    .then((res) => {
      console.log(`${prefix}${res}`);
    });

  PromiseImpl.resolve()
    .then(() => {
      console.log(`${prefix}1`);
    })
    .then(() => {
      console.log(`${prefix}2`);
    })
    .then(() => {
      console.log(`${prefix}3`);
    })
    .then(() => {
      console.log(`${prefix}5`);
    })
    .then(() => {
      console.log(`${prefix}6`);
    });
}

function runAdvancedTest(testName, PromiseImpl, prefix = '') {
  console.log(`\n=== ${testName} - 高级测试 ===`);
  
  // 测试2: 嵌套 Promise 返回
  PromiseImpl.resolve()
    .then(() => {
      console.log(`${prefix}A1`);
      return PromiseImpl.resolve().then(() => PromiseImpl.resolve('A2'));
    })
    .then((res) => {
      console.log(`${prefix}${res}`);
    });

  PromiseImpl.resolve()
    .then(() => {
      console.log(`${prefix}B1`);
    })
    .then(() => {
      console.log(`${prefix}B2`);
    });

  // 测试3: 多层 Promise 链
  PromiseImpl.resolve()
    .then(() => {
      console.log(`${prefix}C1`);
      return PromiseImpl.resolve()
        .then(() => PromiseImpl.resolve('C2'));
    })
    .then((res) => {
      console.log(`${prefix}${res}`);
    });

  PromiseImpl.resolve()
    .then(() => {
      console.log(`${prefix}D1`);
    })
    .then(() => {
      console.log(`${prefix}D2`);
    })
    .then(() => {
      console.log(`${prefix}D3`);
    });
}

function runComplexTest(testName, PromiseImpl, prefix = '') {
  console.log(`\n=== ${testName} - 复杂测试 ===`);
  
  // 测试4: 混合 thenable 对象
  const thenable = {
    then(resolve) {
      console.log(`${prefix}thenable`);
      resolve('thenable-result');
    }
  };

  PromiseImpl.resolve()
    .then(() => {
      console.log(`${prefix}E1`);
      return thenable;
    })
    .then((res) => {
      console.log(`${prefix}${res}`);
    });

  PromiseImpl.resolve()
    .then(() => {
      console.log(`${prefix}F1`);
    })
    .then(() => {
      console.log(`${prefix}F2`);
    });

  // 测试5: Promise 构造函数
  new PromiseImpl((resolve) => {
    console.log(`${prefix}G1`);
    resolve(PromiseImpl.resolve('G2'));
  }).then((res) => {
    console.log(`${prefix}${res}`);
  });

  PromiseImpl.resolve()
    .then(() => {
      console.log(`${prefix}H1`);
    })
    .then(() => {
      console.log(`${prefix}H2`);
    });
}

// 运行 MyPromise 测试
runTest("MyPromise 基本测试", MyPromise, 'M');

setTimeout(() => {
  runAdvancedTest("MyPromise 高级测试", MyPromise, 'M');
}, 100);

setTimeout(() => {
  runComplexTest("MyPromise 复杂测试", MyPromise, 'M');
}, 200);

// 运行原生 Promise 测试
setTimeout(() => {
  runTest("原生 Promise 基本测试", Promise, 'N');
}, 300);

setTimeout(() => {
  runAdvancedTest("原生 Promise 高级测试", Promise, 'N');
}, 400);

setTimeout(() => {
  runComplexTest("原生 Promise 复杂测试", Promise, 'N');
}, 500);