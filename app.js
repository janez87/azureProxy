const express = require('express')
const bodyParser = require('body-parser')
const proxy = require('./lib/proxy.js')

let app = express()

app.use(bodyParser.json())

app.get('/', function (req, res) {

  proxy.getStatistics((error,result)=>{
    res.send(error || result)
  })

})

app.post('/', function (req, res) {
  
  proxy.sendData(req.body,(err,result)=>{
    res.send(err || result)
  })

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})