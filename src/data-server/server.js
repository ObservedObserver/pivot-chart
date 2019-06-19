const express = require('express');
const fs = require('fs')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const loadCSVData = require('./loadData.js')
app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}));
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});

app.get('/api/data/students', function (req, res) {
    fs.readFileSync('./StudentsPerformance.csv')
    const result = loadCSVData('./StudentsPerformance.csv')
    res.json(result)
})

var server = app.listen(8000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
