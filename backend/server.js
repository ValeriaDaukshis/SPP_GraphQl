var express = require('express'),
  app = express(),
  port = 8000,
  mongoose = require('mongoose'),
  tasks = require('./app/models/task.model'), //created model loading here
  users = require('./app/models/user.model'), //created model loading here
  db = require('./app/config/db'),
  bodyParser = require('body-parser');
  
  const cors           = require('cors');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(db.url, { useUnifiedTopology: true,useNewUrlParser: true }); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors());

var routes = require('./app/routes/index'); //importing route
routes(app); //register the route

app.listen(port, () => {
  console.log('Server starts on ' + port);
});
