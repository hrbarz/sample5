
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Tasklist Schema
 */

var TasklistSchema = new Schema({
  name:         {type : String, default : '', trim : true},
  description:  {type : String, default : '', trim : true},
  user:         {type : Schema.ObjectId, ref: 'User'},
  tasks:        [{type : Schema.ObjectId, ref: 'Task' }],
  created_at:   {type : Date, default : Date.now},
  updated_at:   {type : Date, default : Date.now},
})

/**
 * Validations
 */

TasklistSchema.path('name').validate(function (name) {
  return name.length > 0
}, 'Tasklist name cannot be blank')

/**
 * Pre-remove hook
 */

TasklistSchema.pre('remove', function (next) {
  
  next()

})

/**
 * Methods
 */

TasklistSchema.methods = {

  
}

/**
 * Statics
 */

TasklistSchema.statics = {

  /**
   * Find Tasklist by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .exec(cb)
  },

  /**
   * List Tasklists
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Tasklist', TasklistSchema)
