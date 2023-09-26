const { Schema, model } = require('mongoose')

const todoSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
)

const Todo = model('Todo', todoSchema)

module.exports = Todo
