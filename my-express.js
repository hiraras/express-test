
const http = require('http');

function myExpress() {
  return new LikeExpress();
}

class LikeExpress {
  constructor() {
    this.map = new Map();
    this.key = 0;
  }

  getFnList = (req, res) => {
    const path = req.url.split('?')[0];
    if (path.includes('favicon.ico')) {
      res.json('not exist');
      return [];
    }
    const keys = [...this.map.keys()];
    const execKeys = keys.filter(item => typeof item === 'number' || new RegExp(item).test(path));
    return execKeys.map(item => this.map.get(item)).flat();
  }

  callback = (req, res) => {
    res.json = (data) => {
      res.setHeader('Content-type', 'application/json');
      res.end(JSON.stringify(data));
    }
    const execFns = this.getFnList(req, res);
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
