
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Task     = mongoose.model('Task')
  , utils    = require('../../lib/utils')
  , _        = require('underscore')

/**
 * Load
 */

exports.load = function(req, res, next, idtask){
  
  var User = mongoose.model('User')

  Task.load(idtask, function (err, task) {
    if (err) return next(err)
    if (!Task) return next(new Error('not found'))
    req.task = task
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  
  var criteria = { user: req.user },
      page = (req.param('page') > 0 ? req.param('page') : 1) - 1,
      perPage = 30,
      options = {
        criteria: criteria,
        perPage: perPage,
        page: page
      }

  Task.list(options, function(err, Task) {
    if (err) return res.render('500')
    Task.count().exec(function (err, count) {
      res.json({
        title: 'Tasks',
        tasks: Task,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}

/**
 * New Task
 */

exports.new = function(req, res){
  res.json({
    title: 'New Task',
    Task: new Task({})
  })
}

/**
 * Create an Task
 */

exports.create = function (req, res) {

  console.log(req.body);

  var Task = new Task(req.body)
  Task.user = req.user

  Task.save(function (err) {
    if (!err) {
      req.flash('message', 'Successfully created Task!')
      return res.redirect('/tasks/'+Task._id)
    }

    res.json({
      title: 'New Task',
      Task: Task,
      errors: utils.errors(err.errors || err)
    })
  })
}

/**
 * Edit an Task
 */

exports.edit = function (req, res) {
  res.json('tasks/edit', {
    name: 'Edit ' + req.task.name,
    Task: req.task
  })
}

/**
 * Update Task
 */

exports.update = function(req, res){
  var Task = req.task
  Task = _.extend(Task, req.body)

  Task.save(function(err) {
    if (!err) {
      return res.redirect('/tasks/' + Task._id)
    }

    res.json({
      title: 'Edit Task',
      Task: Task,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.json({
    message: req.flash(''),
    title: req.task.title,
    Task: req.task
  })
}

/**
 * Delete an task
 */

exports.destroy = function(req, res){
  var Task = req.task
  Task.remove(function(err){
    req.flash('message', 'Deleted successfully')
    res.redirect('/tasks')
  })
}
