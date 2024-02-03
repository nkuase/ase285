var exec = require('child_process').exec;

const add = require('../src/arith').add;
const all_more_than_5 = require('../src/logic').all_more_than_5;

exec('jest -i tests/arith.test.js',
    function (error, stdout, stderr) {
      if (error != null) {
        console.error('exec error' + error)
      }
      console.log('Unit Test: arith.test.js OK')
    });
exec('jest -i tests/logic.test.js',
    function (error, stdout, stderr) {
      if (error != null) {
        console.error('exec error' + error)
      }
      console.log('Unit Test: logic.test.js OK')
    });
exec('jest -i tests/arith_logic.test.js',
    function (error, stdout, stderr) {
      if (error != null) {
        console.error('exec error' + error)
      }
      console.log('Integration Test: arith_logic.test.js OK')
    });    