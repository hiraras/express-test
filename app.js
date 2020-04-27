
const express = require('express');

const app = express();
// next相当于generator函数的it.next(); 故即便为异步操作也可以保证程序正常执行

app.use((req, res, next) => {
   console.log('请求数据', req.method, req.url);
   next();
});

app.use((req, res, next) => {
  req.cookie = {
    userId: 'abc123'
  };
  next();
});

app.use((req, res, next) => {
  setTimeout(() => {
    req.body = {
      username: 'zhangsan',
      password: '123'
    }
    next();
  }, 1000);
});
// app.get()和app.post()的路径必须完全对上才可匹配到
// app.use()则是'设定了个根目录',然后根目录能匹配上的都会执行
app.use('/api', (req, res, next) => {
  console.log('处理 api');
  next();
});

app.get('/api', (req, res, next) => {
  console.log('get api');
  next();
});

app.post('/api', (req, res, next) => {
  console.log('post api');
  next();
});

function check(req, res, next) {
  console.log('check');
  setTimeout(() => {
    next();
  }, 1000);
}

// 执行res返回数据后，再执行next会报错 Cannot set headers after they are sent to the client
// 下面是一个路由监听后执行多个中间件,每个中间件也需要执行next
app.get('/api/get-cookie', check, (req, res, next) => {
  console.log('get-cookie');
  res.json({
    errno: 0,
    cookie: req.cookie,
    query: req.query
  });
});

app.post('/api/get-post-body', (req, res, next) => {
  res.json({
    errno: 0,
    data: req.body
  });
});

app.use((req, res, next) => {
  res.json({
    errno: -1,
    msg: '404'
  });
});

app.listen(3000, () => {
  console.log('listen on 3000');
});
