
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
 * Task Schema
 */

var TaskSchema = new Schema({
  name:         {type : String, default : '', trim : true},
  description:  {type : String, default : '', trim : true},
  user:         {type : Schema.ObjectId, ref: 'User'},
  tasklist:     {type : Schema.ObjectId, ref: 'Tasklist' },
  priority:     {type : Number, min: 0, max: 3, default: 0 },
  status:       {type : Number, default: 0 },
  tags:         {type : [], get: getTags, set: setTags},
  created_at:   {type : Date, default : Date.now},
  updated_at:   {type : Date, default : Date.now},
})

/**
 * Validations
 */

TaskSchema.path('name').validate(function (name) {
  return name.length > 0
}, 'Task name cannot be blank')

/**
 * Pre-remove hook
 */

TaskSchema.pre('remove', function (next) {
  
  next()

})

/**
 * Methods
 */

TaskSchema.methods = {


}

/**
 * Statics
 */

TaskSchema.statics = {

  /**
   * Find Task by id
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
   * List Tasks
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

mongoose.model('Task', TaskSchema)
