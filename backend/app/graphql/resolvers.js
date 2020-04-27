const { GraphQLScalarType } = require("graphql");
var mongoose = require('mongoose'),
    Task = mongoose.model('tasks');
    mongoose.set('useFindAndModify', false);
    User = mongoose.model('users');
const jwt = require('jsonwebtoken');
const auth = require('../config/auth');

const resolvers = {
    Query: {
      Tasks: (_, { user_id }) => 
        Task.find({user_id: new mongoose.Types.ObjectId(user_id)}, function(err, result){
            if(err)
                return err.message;
            return result;
        }),
      Task: (_, { id }) =>
        Task.findById(id, function(err, task) {
            if(err)
                return err.message;
            return task;
        }),
     SortedByDeadlineTasks: async (_, { user_id }) => {
         Task.find({user_id: new mongoose.Types.ObjectId(user_id)})
        .sort({deadline: 'asc'}).exec(function(err, result){
            console.log(result);
            if(err)
                return err.message;
            return result;
        })},
     SortedByNameTasks: (_, { user_id }) => {
        return Task.find({user_id: new mongoose.Types.ObjectId(user_id)})
        .sort({name: 'asc'}).exec(function(err, result){
            if(err)
                return err.message;
            
            return result;
        })},
     UnfinishedTasks: (_, { user_id }) =>{
     return Task.find({user_id: new mongoose.Types.ObjectId(user_id), isMade: false})
     .exec(function(err, result){
            if(err)
                return err.message;
            return result;
        })},
    },
    Mutation: {
      registration: (root, args) => {
        const note = { 
            userName: args.userName, 
            password: args.password
        };
       
        var new_task = new User(note);
        new_task.save(function(err, user) {
            if (err) {
                if (err.code === 11000) {
                    res.status(409).send({message: 'Account already exists.'});
                    return;
                }
                console.log(err);
                res.status(400).send(err);
                return
            }
            else {
                user.token = generationToken(user);
                return user;
            }
        });
      }, 
      login: (root, args) => {
        const note = { 
            userName: args.userName, 
            password: args.password
        };
       
        return User.findOne(note, (err, user) => {
            if (!user) {
                return "error";
            }
            if (err) {
                return "error 2";
            }
            user.token = jwt.sign({
                userName: user.userName
            }, auth.secretKey, {expiresIn: auth.expires});
            
            return user;
        })
      }, 
      
    },
  };

  let generationToken = (user) => {
    return jwt.sign({
        userName: user.userName
    }, auth.secretKey, {expiresIn: auth.expires});
};
  
  module.exports.Resolvers = resolvers;