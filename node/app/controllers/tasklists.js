
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Tasklist = mongoose.model('Tasklist')
  , utils = require('../../lib/utils')
  , _ = require('underscore')

/**
 * Load
 */

exports.load = function(req, res, next, idtasklist){
  var User = mongoose.model('User')

  Tasklist.load(idtasklist, function (err, tasklist) {
    if (err) return next(err)
    if (!tasklist) return next(new Error('not found'))
    req.tasklist = tasklist
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

  Tasklist.list(options, function(err, tasklist) {
    if (err) return res.render('500')
    Tasklist.count().exec(function (err, count) {
      res.json({
        title: 'Tasklists',
        articles: tasklist,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}

/**
 * New tasklist
 */

exports.new = function(req, res){
  res.json({
    title: 'New Tasklist',
    tasklist: new Tasklist({})
  })
}

/**
 * Create an tasklist
 */

exports.create = function (req, res) {
  var tasklist = new Tasklist(req.body)
  tasklist.user = req.user

  tasklist.save(function (err) {
    if (!err) {
      req.flash('message', 'Successfully created tasklist!')
      return res.redirect('/tasklists/'+tasklist._id)
    }

    res.json({
      title: 'New Tasklist',
      tasklist: tasklist,
      errors: utils.errors(err.errors || err)
    })
  })
}

/**
 * Edit an tasklist
 */

exports.edit = function (req, res) {
  res.json('tasklists/edit', {
    name: 'Edit ' + req.tasklist.name,
    tasklist: req.tasklist
  })
}

/**
 * Update tasklist
 */

exports.update = function(req, res){
  var article = req.article
  article = _.extend(article, req.body)

  article.save(function(err) {
    if (!err) {
      return res.redirect('/articles/' + article._id)
    }

    res.render('articles/edit', {
      title: 'Edit Article',
      article: article,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.json({
    message: req.flash('message'),
    title: req.article.title,
    article: req.article
  })
}

/**
 * Delete an article
 */

exports.destroy = function(req, res){
  var article = req.article
  article.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/articles')
  })
}
