import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import * as path from 'path'
import { getRandom } from './utilities/accountgenerator';

uuidv4();

interface data1 {
  reference: string;
  senderAccount: number;
  amount: number;
  receiverAccount: number;
  transferDescription: string;
  createdAt: string
}

let pathData = path.join(__dirname, '../database.json')
let pathData2 = path.join(__dirname, '../database2.json')

let isExists = fs.existsSync(pathData);
let isExists2 = fs.existsSync(pathData2);

if(isExists === false) {
  fs.writeFileSync(pathData, '[]');
}

if(isExists2 === false) {
  fs.writeFileSync(pathData2, '[]')
}

let database = JSON.parse(fs.readFileSync(pathData, "utf-8"));

export const allBalances = (req: Request, res: Response) => {
  fs.readFile(pathData, 'utf8', (err, content) => {
  res.send(content)
  });
}

export const createAccount = async (req: Request, res: Response) => {

  let body = req.body;
  let uniqueAcc = await getRandom(10);

  let uniqueUser = { account: uniqueAcc, balance: body.balance, createdAt: new Date().toISOString() }

  fs.readFile(pathData, 'utf8', function(err, data){
    let readData = JSON.parse(data);
    readData.push(uniqueUser);
    fs.writeFile(pathData, JSON.stringify(readData, null, 2), "utf8", err => console.log(err));
  });

 res.status(200).send({status: 0, uniqueUser});

}

export const individualBalance = (req: Request, res: Response) => {

  const id  = req.params.accountNumber;

  let result = database.find( (acc: { account: number | string; }) => acc.account == id);

  if(result) {
    return res.status(200).send({status: 0, result});
  } else {
  return res.status(404).send({status: 1, message: 'This account does not exist in the database'});
  }

}

export const transfer = (req: Request, res: Response) => {
  let body = req.body;

  let senderAcc = body.from;
  let receiverAcc = body.to;
  let amountRecieved = body.amount;
  let description = body.transferDescription;

  let find1 = database.findIndex((item: { account: number | string; }) => item.account === senderAcc);
  let find2 = database.findIndex((item: { account: number | string; }) => item.account === receiverAcc);

 if(amountRecieved < database[find1].balance) {

  let transaction1 = {
    ...database[find1],
    balance: database[find1].balance - amountRecieved,
    createdAt: database[find1].createdAt
  }

  database[find1] = transaction1;

  let transaction2 = {
    ...database[find2],
    balance: database[find2].balance + amountRecieved,
    createdAt: database[find2].createdAt
  }

  database[find2] = transaction2;

  fs.writeFile(pathData, JSON.stringify(database, null, 2), (err) => {
    console.log(err);
  })
  } else {
    return res.status(400).send({ message: "Insufficient funds" })
  }


  let transactionData: data1 = {
    reference: uuidv4(),
    senderAccount: senderAcc,
    amount: amountRecieved,
    receiverAccount: receiverAcc,
    transferDescription: description,
    createdAt: new Date().toISOString(),
  }

  fs.readFile(pathData2, 'utf8', function(err, data){
    let readData = JSON.parse(data);
    readData.push(transactionData);
    fs.writeFile(pathData2, JSON.stringify(readData, null, 2), "utf8", err => console.log(err));
  });

  res.send(JSON.stringify(transactionData, null, 2));
}



module.exports = {
  allBalances,
  createAccount,
  individualBalance,
  transfer
}
