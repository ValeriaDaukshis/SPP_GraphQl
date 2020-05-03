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
        GetTask: (_, { id }) =>
        Task.findById(id, function(err, task) {
            if(err)
                return err.message;
            return task;
        }),
        SortedByDeadlineTasks: (_, { user_id }) => {
            return Task.find({user_id: new mongoose.Types.ObjectId(user_id)}, null, {sort: {deadline: 'asc'}}, function(err, result){
                if(err)
                    return err.message;
                return result;
    
            })
        },
     SortedByNameTasks: (_, { user_id }) => {
        return Task.find({user_id: new mongoose.Types.ObjectId(user_id)}, null, {sort: {name: 'asc'}}, function(err, result){
            if(err)
                return err.message;
            return result;

        })
    },
        
     UnfinishedTasks: (_, { user_id }) =>{
        return Task.find({user_id: new mongoose.Types.ObjectId(user_id), isMade: false}, null, null,
        function(err, result){
            if(err)
                return err.message;
            return result;
        })
      },
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
                    return 'error';
                }
                console.log(err);
                return 'error';
            }
            else {
                user.token = generationToken(user);
                return user;
            }
        })
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
      deleteTask: (root, args) => {
        Task.deleteOne({_id: args.id}, function(err, task) {
            if (err) {
                return false;
            } else {
                return task;
            } 
        });
      },

      setStatus: (root, args) => {
                return Task.findOneAndUpdate({_id: args.id}, args.status, {new: true}, function(err, result) {
                    if (err) {
                        return "error";
                    } else {
                        console.log(result);
                        return result;
                    } 
                });
        
      }, 

      updateTask: (root, args) => {
          console.log("update");
          const note = { 
            _id: args.id,
            name: args.name, 
            deadline: args.deadline, 
            details: args.details, 
            isMade: args.isMade, 
            user_id: args.user_id,
        };
         Task.findOneAndUpdate({_id: args.id}, note, {new: true}, function(err, task2) {
            if (err) {
                return 'error';
            } else {
                return task2;
            } 
        })
    },

        addTask: (root, args) => {
            console.log("addTask");
            const note = { 
                name: args.name, 
                deadline: args.deadline, 
                details: args.details, 
                isMade: args.isMade, 
                user_id: args.user_id,
            };

            var new_task = new Task(note);
            return new_task.save(function(err, task) {
                if (err) 
                    return 'error';
                else 
                    return task;
            });
        }, 
      
    },
  };

  let generationToken = (user) => {
    return jwt.sign({
        userName: user.userName
    }, auth.secretKey, {expiresIn: auth.expires});
};
  
  module.exports.Resolvers = resolvers;