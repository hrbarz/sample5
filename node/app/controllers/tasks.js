
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Task     = mongoose.model('Task')
  , Tasklist = mongoose.model('Tasklist')
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

  Task.list(options, function(err, task) {
    if (err) return res.render('500')
    task.count().exec(function (err, count) {
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
 * In List
 */

exports.indexinlist = function(req, res){
  
  var criteria = { 
          user: req.user.id, 
          tasklist: req.tasklist.id          
      }
  
  if(req.param('status'))  criteria.status = req.param('status')


  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1,
      perPage = 30,
      options = {
        criteria: criteria,
        perPage: perPage,
        page: page
      }

  
  Task.list(options, function(err, task) {
    if (err) return res.render('500')
    Task.count().exec(function (err, count) {
      res.json({
        title: 'Tasks',
        tasks: task,
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

  Tasklist.ckeckInsertTask(req.body.tasklist,req.user,function(err,tasklist){

    var task = new Task(req.body)

    task.user = req.user
    task.tasklist = tasklist.id

    task.save(function (err) {

      if (!err  ) {

        tasklist.tasks.push(task._id)

        tasklist.save(function (err){

          req.flash('message', 'Successfully created Task!')
          return res.redirect('/tasks/'+task._id)

        })

      }else{

        res.json({
          title: 'New Task',
          task: task,
          errors: utils.errors(err.errors || err)
        })

      }

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
  var task = req.task
  task = _.extend(Task, req.body)

  task.save(function(err) {
    if (!err) {
      return res.redirect('/tasks/' + task._id)
    }

    res.json({
      title: 'Edit Task',
      Task: task,
      errors: err.errors
    })
  })
}


/**
 * Show
 */

exports.show = function(req, res){
  res.json({
    fash: req.flash(''),
    title: req.task.title,
    task: req.task
  })
}

/**
 * Delete an task
 */

exports.destroy = function(req, res){
  var task = req.task
  task.remove(function(err){
    req.flash('message', 'Deleted successfully')
    res.redirect('/tasks')
  })
}


/**
 * Get count task 
 */


exports.count_alltasks_priority = function(req,res){

    //res.header("Access-Control-Allow-Origin", '*'); 
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var min_priority = 0,
        max_priority = 3

    var get_count = function(priority,values,cb){
  
      Task.count(
           { 
               user: req.user.id
              ,priority:priority
              ,status:0
           
           }, function (err, count) {

            values.push(count);

            priority++;

            if(priority > max_priority){
              return cb(values);
            }

            get_count(priority,values,cb);

        }
      );
  }

  get_count( min_priority , [] ,function (values){

    res.json({count:values});
  
  });
  
}

exports.count_priority_all = function(req,res){

    //res.header("Access-Control-Allow-Origin", '*'); 
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var get_count = function(tasklist,priority,values,end){
  
      Task.count(
           { 
               tasklist:tasklist
              ,priority:priority
              ,status:0
           }
          , function (err, count) {

            values.push(count);

            priority++;

            if(priority == 3){
            return end(values);
          }

              get_count(tasklist,priority,values,end);

        }
      );
  }

  get_count(req.params.id , 0 , [] ,function (values){

    res.json({id: req.params.id ,count:values});
  
  });
  
}

