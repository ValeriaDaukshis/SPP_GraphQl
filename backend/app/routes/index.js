'use strict';

module.exports = function(app) {
  var controller = require('../controllers/tasksController');
  var authController = require('../controllers/authController');
  console.log("index");

  app.route('/:userId/tasks').get(controller.getAllTasks);
  app.route('/:userId/tasks/sortByName').get(controller.getSortedByName);
  app.route('/:userId/tasks/sortByDeadline').get(controller.getSortedByDeadline);
  app.route('/:userId/tasks/getUnfinished').get(controller.getUnfinished);
  app.route('/:userId/tasks/:id').get(controller.getTaskById);

  app.route('/:userId/task').post(controller.createTask);
  app.route('/:userId/task/:id').put(controller.updateTask);
  app.route('/:userId/task/:id/status/:statusBool').put(controller.changeTaskStatus);

  app.route('/:userId/task/:id').delete(controller.deleteTask);

  app.route('/login').post(authController.login);
  app.route('/registrate').post(authController.registrate);
};