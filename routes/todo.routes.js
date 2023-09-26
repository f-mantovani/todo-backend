const { isAuthenticated } = require('../middleware/isAuthenticated.js')
const Todo = require('../models/Todo.model.js')

const router = require('express').Router()

router.use(isAuthenticated)

// Create
router.post('/', (req, res, next) => {
	const { title } = req.body
	if (!title) {
		const error = {
			status: 400,
			message: 'Should have a title',
		}
		return next(error)
	}
	const owner = req.payload._id
	Todo.create({ title, owner })
		.then(newTodo => res.status(200).json(newTodo))
		.catch(error => next(error))
})

// Read all
router.get('/', (req, res, next) => {
	const owner = req.payload._id
	Todo.find({ owner })
		.then(todos => res.status(200).json(todos))
		.catch(error => next(error))
})

//Read one
router.get('/:id', (req, res, next) => {
	const { id } = req.params
	const owner = req.payload._id
	Todo.findOne({ _id: id, owner })
		.then(todo => res.status(200).json(todo))
		.catch(error => next(error))
})

// Update
router.put('/:id', (req, res, next) => {
	const { id } = req.params
	const owner = req.payload._id
	const { completed, title } = req.body
	Todo.findByIdAndUpdate({ _id: id, owner }, { completed, title }, { new: true })
		.then(updatedTodo => res.status(200).json(updatedTodo))
		.catch(error => next(error))
})

// Delete
router.delete('/:id', (req, res, next) => {
	const { id } = req.params
	const owner = req.payload._id
	Todo.findOneAndDelete({ _id: id, owner })
		.then(() => res.status(204).json())
		.catch(error => next(error))
})

module.exports = router
