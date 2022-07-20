
// import {balanceInterface} from "./controller";
import {Request, Response, NextFunction } from "express";
import z, { AnyZodObject } from "zod";

//const schema = z.Schema
 export const balance = z.object({
  body: z.object({
      balance: z
        .number({
          required_error: "Balance is required and must be number",
      })
  }),
})

export const validate = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
};


export const transaction = z.object({
  body: z.object({

    from: z
      .number({
        required_error: "Sender account number is required and must be number",
      }),

      to: z
      .number({
        required_error: "Receiver account number is required and must be number",
      }),

      amount: z.number({
        required_error: "amount is required and must be number",
      }),

      transferDescription: z.string({
        required_error: "transfer description is required and must be number",
      }),
  }),
});
