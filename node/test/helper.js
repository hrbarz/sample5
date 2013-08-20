
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , Tasklist = mongoose.model('Tasklist')
  , User = mongoose.model('User')

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function (done) {
  var callback = function (item, fn) { item.remove(fn) }

  async.parallel([
    function (cb) {
      User.find().exec(function (err, users) {
        async.forEach(users, callback, cb)
      })
    },
    function (cb) {
      Tasklist.find().exec(function (err, apps) {
        async.forEach(apps, callback, cb)
      })
    }
  ], done)
}
