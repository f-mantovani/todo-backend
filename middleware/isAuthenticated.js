const jwt = require('jsonwebtoken')

const isAuthenticated = (req, res, next) => {
	const bearer = req.headers.authorization

	if (!bearer) {
		const error = {
			status: 401,
			message: 'Token not found',
		}
		next(error)
	}

	const token = bearer.split(' ')[1]

	if (!token) {
		const error = {
			status: 401,
			message: 'Token not found',
		}
		next(error)
	}

	const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)

	req.payload = { ...verifiedToken }
	next()
}

module.exports = { isAuthenticated }
