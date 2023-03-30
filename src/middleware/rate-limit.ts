import { Response } from 'express'
import rateLimit from 'express-rate-limit'
import { RequestWithConfig } from './auth'

export const limiter = (max: number, windowSecs = 10) => rateLimit({
	windowMs: windowSecs * 1000,
	max: (req: RequestWithConfig, res: Response) => {
		if (req.disableRateLimit) {
			return 1000
		}
		return max
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})