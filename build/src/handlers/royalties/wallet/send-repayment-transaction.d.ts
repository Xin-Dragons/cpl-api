import { NextFunction, Request, Response } from "express";
export declare function handleSendRepaymentTransaction(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
