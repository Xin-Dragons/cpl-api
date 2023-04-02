import { NextFunction, Request, Response } from "express";
import { getWeeklyLeaders } from "../../db";

export async function handleGetWeeklyLeaders(req: Request, res: Response, next: NextFunction) {
  try {
    const weeklyLeaders = await getWeeklyLeaders();
    res.status(200).json(weeklyLeaders)
  } catch (err) {
    next(err)
  }
}