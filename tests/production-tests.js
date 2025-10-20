const MyPromise = require('../src/MyPromise');

console.log('🚀 生产级 Promise 测试套件');
console.log('='.repeat(50));

// 测试结果收集
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, testFn) {
  try {
    const result = testFn();
    if (result === true || result === undefined) {
      console.log(`✅ ${name}`);
      results.passed++;
      results.tests.push({ name, status: 'PASS' });
    } else {
      console.log(`❌ ${name}: ${result}`);
      results.failed++;
      results.tests.push({ name, status: 'FAIL', reason: result });
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    results.failed++;
    results.tests.push({ name, status: 'ERROR', reason: error.message });
  }
}

function asyncTest(name, testFn) {
  return new Promise((resolve) => {
    testFn()
      .then((result) => {
        if (result === true || result === undefined) {
          console.log(`✅ ${name}`);
          results.passed++;
          results.tests.push({ name, status: 'PASS' });
        } else {
          console.log(`❌ ${name}: ${result}`);
          results.failed++;
          results.tests.push({ name, status: 'FAIL', reason: result });
        }
        resolve();
      })
      .catch((error) => {
        console.log(`❌ ${name}: ${error.message}`);
        results.failed++;
        results.tests.push({ name, status: 'ERROR', reason: error.message });
        resolve();
      });
  });
}

// 1. 构造函数行为测试
console.log('\n📋 1. 构造函数行为测试');
console.log('-'.repeat(30));

test('构造函数立即执行 executor', () => {
  let executed = false;
  new MyPromise(() => { executed = true; });
  return executed === true;
});

test('构造函数自动 catch executor 抛错', () => {
  let caught = false;
  const p = new MyPromise(() => { throw new Error('test error'); });
  // 检查 promise 是否被正确 reject
  return new Promise((resolve) => {
    p.catch(() => { caught = true; });
    setTimeout(() => resolve(caught), 10);
  });
});

test('原生 Promise 构造函数立即执行', () => {
  let executed = false;
  new Promise(() => { executed = true; });
  return executed === true;
});

test('原生 Promise 构造函数自动 catch 抛错', () => {
  let caught = false;
  const p = new Promise(() => { throw new Error('test error'); });
  return new Promise((resolve) => {
    p.catch(() => { caught = true; });
    setTimeout(() => resolve(caught), 10);
  });
});

// 2. 静态方法测试
console.log('\n📋 2. 静态方法测试');
console.log('-'.repeat(30));

test('MyPromise.resolve 存在', () => {
  return typeof MyPromise.resolve === 'function';
});

test('MyPromise.reject 存在', () => {
  return typeof MyPromise.reject === 'function';
});

test('MyPromise.all 存在', () => {
  return typeof MyPromise.all === 'function';
});

test('MyPromise.race 存在', () => {
  return typeof MyPromise.race === 'function';
});

test('MyPromise.allSettled 存在', () => {
  return typeof MyPromise.allSettled === 'function';
});

test('MyPromise.any 存在', () => {
  return typeof MyPromise.any === 'function';
});

// 3. 微任务队列测试
console.log('\n📋 3. 微任务队列测试');
console.log('-'.repeat(30));

function testMicrotaskOrder() {
  return new Promise((resolve) => {
    const myOrder = [];
    const nativeOrder = [];
    
    // MyPromise 测试
    MyPromise.resolve().then(() => myOrder.push(1));
    myOrder.push(0);
    
    setTimeout(() => {
      // 原生 Promise 测试
      Promise.resolve().then(() => nativeOrder.push(1));
      nativeOrder.push(0);
      
      setTimeout(() => {
        const myResult = myOrder.join('');
        const nativeResult = nativeOrder.join('');
        resolve(myResult === nativeResult);
      }, 10);
    }, 10);
  });
}

// 4. then 返回值测试
console.log('\n📋 4. then 返回值测试');
console.log('-'.repeat(30));

test('then 总是返回新的 Promise 实例', () => {
  const p1 = MyPromise.resolve(1);
  const p2 = p1.then(() => {});
  const p3 = p1.then(() => {});
  
  return p1 !== p2 && p2 !== p3 && p1 !== p3;
});

test('原生 Promise then 总是返回新实例', () => {
  const p1 = Promise.resolve(1);
  const p2 = p1.then(() => {});
  const p3 = p1.then(() => {});
  
  return p1 !== p2 && p2 !== p3 && p1 !== p3;
});

// 5. Symbol.toStringTag 测试
console.log('\n📋 5. Symbol.toStringTag 测试');
console.log('-'.repeat(30));

test('MyPromise 的 toString 标签', () => {
  const p = new MyPromise(() => {});
  const tag = Object.prototype.toString.call(p);
  console.log(`  MyPromise toString: ${tag}`);
  return true; // 只是展示，不强制要求
});

test('原生 Promise 的 toString 标签', () => {
  const p = new Promise(() => {});
  const tag = Object.prototype.toString.call(p);
  console.log(`  原生 Promise toString: ${tag}`);
  return true; // 只是展示
});

// 6. 性能和内存测试
console.log('\n📋 6. 性能和内存测试');
console.log('-'.repeat(30));

test('长链测试 (1000 个 then)', () => {
  let p = MyPromise.resolve(0);
  for (let i = 0; i < 1000; i++) {
    p = p.then(x => x + 1);
  }
  
  return new Promise((resolve) => {
    p.then(result => {
      resolve(result === 1000);
    }).catch(() => {
      resolve('长链执行失败');
    });
  });
});

test('大量并发 Promise (1000 个)', () => {
  const promises = [];
  for (let i = 0; i < 1000; i++) {
    promises.push(MyPromise.resolve(i));
  }
  
  return MyPromise.all(promises)
    .then(results => results.length === 1000)
    .catch(() => '大量并发失败');
});

// 7. 复杂场景测试
console.log('\n📋 7. 复杂场景测试');
console.log('-'.repeat(30));

test('async/await 兼容性', async () => {
  try {
    // 注意：这个测试可能不会通过，因为 async/await 需要原生 Promise
    const result = await MyPromise.resolve(42);
    return result === 42;
  } catch (e) {
    return 'async/await 不兼容 (预期行为)';
  }
});

test('Promise.all 混合使用', () => {
  const mixed = [
    MyPromise.resolve(1),
    Promise.resolve(2),
    MyPromise.resolve(3)
  ];
  
  return Promise.all(mixed)
    .then(results => {
      return JSON.stringify(results) === JSON.stringify([1, 2, 3]);
    })
    .catch(() => '混合使用失败');
});

// 执行异步测试
async function runAsyncTests() {
  console.log('\n📋 异步测试执行中...');
  console.log('-'.repeat(30));
  
  await asyncTest('构造函数异常捕获 (MyPromise)', async () => {
    return new Promise((resolve) => {
      let caught = false;
      const p = new MyPromise(() => { throw new Error('test'); });
      p.catch(() => { caught = true; });
      setTimeout(() => resolve(caught), 50);
    });
  });
  
  await asyncTest('微任务执行顺序一致性', testMicrotaskOrder);
  
  await asyncTest('长链异步测试', async () => {
    let p = MyPromise.resolve(0);
    for (let i = 0; i < 100; i++) {
      p = p.then(x => x + 1);
    }
    const result = await p;
    return result === 100;
  });
  
  await asyncTest('大量并发异步测试', async () => {
    const promises = Array.from({ length: 100 }, (_, i) => 
      MyPromise.resolve(i).then(x => x * 2)
    );
    const results = await MyPromise.all(promises);
    return results.every((val, idx) => val === idx * 2);
  });
  
  // 输出最终结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(50));
  console.log(`✅ 通过: ${results.passed}`);
  console.log(`❌ 失败: ${results.failed}`);
  console.log(`📈 通过率: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.failed > 0) {
    console.log('\n❌ 失败的测试:');
    results.tests
      .filter(t => t.status !== 'PASS')
      .forEach(t => {
        console.log(`  - ${t.name}: ${t.reason || t.status}`);
      });
  }
  
  console.log('\n💡 分析建议:');
  console.log('- Promises/A+ 测试通过 ≠ 生产可用');
  console.log('- 需要补齐静态方法、异常处理、微任务调度');
  console.log('- Symbol.toStringTag 影响调试体验');
  console.log('- async/await 需要引擎级支持，自实现无法完全兼容');
}

// 启动测试
setTimeout(runAsyncTests, 100);