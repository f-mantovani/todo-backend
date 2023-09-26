const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User.model.js')
const { isAuthenticated } = require('../middleware/isAuthenticated.js')

router.post('/signup', (req, res, next) => {
	const { email, password } = req.body
	if (!email || !password) {
		const error = {
			status: 400,
			message: 'Please fill in the email and/or password field',
		}
		return next(error)
	}

	bcrypt
		.hash(password, 12)
		.then(passwordHashed => {
			return User.create({ email, password: passwordHashed })
		})
		.then(newUser => {
			res.status(200).json({ message: 'User created successfully', email: newUser.email })
		})
		.catch(error => next(error))
})

router.post('/login', (req, res, next) => {
	const { email, password } = req.body
	if (!email || !password) {
		const error = {
			status: 400,
			message: 'Please fill in the email and/or password field',
		}
		next(error)
	}

	User.findOne({ email })
		.then(user => {
			if (!user) {
				const error = {
					status: 400,
					message: 'Email and/or password incorrect',
				}
				return next(error)
			}

			const passwordMatch = bcrypt.compareSync(password, user.password)

			if (!passwordMatch) {
				const error = {
					status: 400,
					message: 'Email and/or password incorrect',
				}
				next(error)
				return
			}

			const payload = {
				email: user.email,
				_id: user._id,
			}
			const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' })

			res.status(200).json({ token })
		})
		.catch(error => next(error))
})

router.get('/verify', isAuthenticated, (req, res, next) => {
	res.status(200).json(req.payload)
})

module.exports = router
