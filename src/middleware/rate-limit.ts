import rateLimit from 'express-rate-limit'

export const limiter = (max: number, windowSecs = 10) => rateLimit({
	windowMs: windowSecs * 1000,
	max,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})