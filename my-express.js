
function myExpress() {
  const http = require('http');
  const map = new Map();
  let key = 0;
  return {
    listen: function(port, callback) {
      http.createServer(function(req, res) {
        const path = req.url.split('?')[0];
        const keys = [...map.keys()];
        const execKeys = keys.filter(item => typeof item === 'number' || new RegExp(item).test(path));
        const execFns = execKeys.map(item => map.get(item)).flat();
        execFnList(execFns, req, res);
      }).listen(port, callback);
    },
    use: function(arg1, ...args) {
      if (typeof arg1 === 'string') {
        map.set(arg1 + '/.*', args);
      } else if (typeof arg1 === 'function') {
        map.set(key, arg1);
        key ++;
      } else {
        throw new Error('param fault');
      }
      args.forEach(function(item) {
        if (typeof item === 'function') {
          map.set(key, item);
          key ++;
        } else {
          throw new Error('param fault');
        }
      });
    },
    get: function(path, ...args) {
      map.set(path, args);
    },
    post: function() {
      map.set(path, args);
    }
  }
}

const app = myExpress();
app.use(function(req, res, next) {
  console.log(1);
  next();
});
app.use(function(req, res, next) {
  setTimeout(function() {
    console.log('settimeout');
    next();
  }, 1000);
});
app.use('/test', function(req, res, next) {
  console.log('test use');
  next();
});

app.use(function(req, res, next) {
  console.log(3);
  next();
});

app.use(function(req, res, next) {
  console.log(4);
  next();
});

app.get('/test/get', function(req, res, next) {
  console.log('test get');
  res.end('test get end');
});

app.use(function(req, res, next) {
  res.end('end');
});

app.listen(3000, function() {
  console.log('server listen of 3000');
});

module.exports = myExpress;

function execFnList(fns, req, res) {
  function f(num) {
    fns[num](req, res, function() {
      fns[num + 1] && f(num + 1);
    });
  }
  fns[0] && f(0);
}
