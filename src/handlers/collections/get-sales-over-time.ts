import { NextFunction, Request, Response } from "express";
import { getSalesOverTime } from "../../db";

export async function handleGetSalesOverTime(req: Request, res: Response, next: NextFunction) {
  const { collection } = req.params;
  try {
    const sales = await getSalesOverTime(collection)

    res.status(200).json(sales);
  } catch (err) {
    next(err)
  }
}