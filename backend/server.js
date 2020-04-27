var express = require('express'),
  app = express(),
  port = 8000,
  mongoose = require('mongoose'),
  tasks = require('./app/models/task.model'), 
  users = require('./app/models/user.model'), 
  db = require('./app/config/db'),
  bodyParser = require('body-parser');
  
  const cors  = require('cors');
  const graphqlHTTP = require("express-graphql");
  const { makeExecutableSchema } = require("graphql-tools");

  const typeDefs = require("./app/graphql/schema").Schema;
  const resolvers = require("./app/graphql/resolvers").Resolvers;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: {
    log: e => console.log(e)
  }
});
  
mongoose.Promise = global.Promise;
mongoose.connect(db.url, { useUnifiedTopology: true,useNewUrlParser: true }); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  "/graphql",
  graphqlHTTP(request => ({
    schema: schema,
    graphiql: true
  }))
);

app.listen(port, () => {
  console.log('Server starts on ' + port);
});
