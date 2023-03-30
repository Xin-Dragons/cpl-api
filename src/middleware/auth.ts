import { NextFunction, Request, Response } from "express";
import { lookupApiKey } from "../db";

export interface RequestWithConfig extends Request {
  disableRateLimit?: boolean;
}

export async function auth(req: RequestWithConfig, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;
  
    if (!authorization) {
      throw new Error('API key required');
    }
  
    const apiKey = authorization.replace('Bearer ', '');
    const client = await lookupApiKey(apiKey);
  
    if (!client) {
      throw new Error('API key not found');
    }
  
    if (!client.active) {
      throw new Error('API key inactive');
    }

    if (client.disable_rate_limit) {
      req.disableRateLimit = true;
    }
  
    next();
  } catch (err: any) {
    next(err);
  }
}