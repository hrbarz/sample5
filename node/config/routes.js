
/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users       = require('../app/controllers/users')
  , tasks       = require('../app/controllers/tasks')
  , tasklists   = require('../app/controllers/tasklists')
  , auth        = require('./middlewares/authorization')

/**
 * Route middlewares
 */

//var taskAuth = [auth.requiresLogin, auth.article.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  
  app.post('/users', users.create)

  app.get('/users/:userId', users.show)
  
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session)
  
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin)

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback)


  app.get('/auth/github',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.signin)

  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.authCallback)


  app.get('/auth/twitter',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.signin)

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.authCallback)


  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin)

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback)


  app.param('userId', users.user)

  // tasklist routes
  app.get('/tasklists'                    , auth.requiresLogin, tasklists.index)
  app.get('/tasklists/new'                , auth.requiresLogin, tasklists.new) 
  app.post('/tasklists'                   , auth.requiresLogin, tasklists.create)  
  app.get('/tasklists/:idtasklist'        , auth.requiresLogin, tasklists.show)
  app.get('/tasklists/:idtasklist/edit'   , auth.requiresLogin, tasklists.edit)
  app.put('/tasklists/:idtasklist'        , auth.requiresLogin, tasklists.update)
  app.del('/tasklists/:idtasklist'        , auth.requiresLogin, tasklists.destroy)

  app.param('idtasklist', tasklists.load)



  // task routes

  app.get('/tasks'                      , auth.requiresLogin, tasks.index)
  app.get('/tasks/new'                  , auth.requiresLogin, tasks.new) 

  app.get('/tasks/count_alltasks_priority'   , auth.requiresLogin    , tasks.count_alltasks_priority)


  app.post('/tasks'                     , auth.requiresLogin, tasks.create)  
  app.get('/tasks/:idtask'              , auth.requiresLogin, tasks.show)
  app.get('/tasks/:idtask/edit'         , auth.requiresLogin, tasks.edit)
  app.put('/tasks/:idtask'              , auth.requiresLogin, tasks.update)
  app.del('/tasks/:idtask'              , auth.requiresLogin, tasks.destroy)

  app.get('/tasks/inlist/:idtasklist'          , auth.requiresLogin, tasks.indexinlist)

  app.param('idtask', tasks.load)

  app.get('/tasks/count_priority/:id'           , auth.requiresLogin, tasks.count_priority_all) 

  // home route
  app.get('/', auth.requiresLogin , tasklists.index)

}
