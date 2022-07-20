import { Request, Response, NextFunction } from 'express';
import z, { AnyZodObject } from 'zod';

export const balance = z.object({
  body: z.object({
    balance: z.number({
      required_error: 'Balance is required',
    }),
  }),
});

export const transaction = z.object({
  body: z.object({
    senderAccount: z
      .number({
        required_error: 'Sender account number is required',
      })
      .min(10, { message: 'Must be 10 or more characters long' }),
    amount: z.number({
      required_error: 'amount is required',
    }),
    receiverAccount: z
      .number({
        required_error: 'Receiver account number is required',
      })
      .min(10, { message: 'Must be 10 or more characters long' }),
    transferDescription: z.string({
      required_error: 'Transfer description is required',
    }),
  }),
});

export const validate =
  (schema: AnyZodObject) =>
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
