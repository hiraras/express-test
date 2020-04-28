const myExpress = require('./my-express');

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

function check(req, res, next) {
  console.log('check');
  next();
}

app.use('/test', check, function(req, res, next) {
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

app.listen(8000, function() {
  console.log('server listen of 3000');
});
