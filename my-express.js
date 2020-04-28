
const http = require('http');

function myExpress() {
  return new LikeExpress();
}

class LikeExpress {
  constructor() {
    this.map = new Map();
    this.key = 0;
  }

  getFnList = (req) => {
    const path = req.url.split('?')[0];
    const keys = [...this.map.keys()];
    const execKeys = keys.filter(item => typeof item === 'number' || new RegExp(item).test(path));
    return execKeys.map(item => this.map.get(item)).flat();
  }

  callback = (req, res) => {
    console.log(this);
    const execFns = this.getFnList(req);
    res.json = (data) => {
      res.setHeader('Content-type', 'application/json');
      res.end(JSON.stringify(data));
    }
    execFnList(execFns, req, res);
  }

  listen = (port, callback) => {
    const server = http.createServer(this.callback.bind(this));
    server.listen(port, callback);
  }

  use = (arg1, ...args) => {
    if (typeof arg1 === 'string') {
      this.map.set(arg1 + '/.*', args);
    } else if (typeof arg1 === 'function') {
      this.map.set(this.key, arg1);
      this.key ++;
    }
    args.forEach((item) => {
      this.map.set(this.key, item);
      this.key ++;
    });
  }

  get = (path, ...args) => {
    this.map.set(path, args);
  }
  
  post = (path, ...args) => {
    this.map.set(path, args);
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

// 教程的实现
function execFnList2(fns, req, res) {
  const next = () => {
    const middleware = fns.shift();
    if (middleware) {
      middleware(req, res, next);
    }
  }
  next();
}
