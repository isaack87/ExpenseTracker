// want to save to a mongo DB using servers with users if I have time

const express = require('express')
let bodyParser = require('body-parser')
let db = require('/Users/isaackim/Desktop/Rpp29/hr-rpp29-mvp/database/index.js')
let app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', function (req, res) {

      var expense = req.body

      db.save(expense, 'testing here now')
      res.send('server got data')
});

app.get('/', function (req, res) {
  res.send('success')
});

let port = 8000
app.listen(port, function() {
  console.log(`Listening on port ${port}`)
});