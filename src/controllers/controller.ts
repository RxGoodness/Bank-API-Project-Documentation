/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import fs from 'fs';
import { Request, Response } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { balancesInterface } from '../routes/interface';

uuidv4();

const balanceDataPath = path.join(__dirname, '../../balanceDatabase.json');
const balanceDatabaseExist = fs.existsSync(balanceDataPath);
if (balanceDatabaseExist === false) {
  fs.writeFile(balanceDataPath, '[]', 'utf8', (err) => console.log(err));
}
const balanceDatabase = JSON.parse(fs.readFileSync(balanceDataPath, 'utf-8'));

const transactionDataPath = path.join(
  __dirname,
  '../../transactionDatabase.json',
);
const transactionDataExist = fs.existsSync(transactionDataPath);
if (transactionDataExist === false) {
  fs.writeFile(transactionDataPath, '[]', 'utf8', (err) => console.log(err));
}

export const createAccount = (req: Request, res: Response) => {
  const accountNumber = Math.floor(Math.random() * 10000000000);
  const body = req.body;
  const userWithAcc = {
    accountNo: accountNumber,
    balance: body.balance,
    createdAt: new Date().toISOString(),
  };
  fs.readFile('./balanceDatabase.json', 'utf8', function (err, data) {
    const readData = JSON.parse(data);
    readData.push(userWithAcc);
    fs.writeFile(
      './balanceDatabase.json',
      JSON.stringify(readData, null, 2),
      'utf8',
      (err) => console.log(err),
    );
  });
  res.send(userWithAcc);
};

export const getUserAccount = (req: Request, res: Response) => {
  const accountNum = req.params.accountNo;
  const data = balanceDatabase.find(
    (balance: balancesInterface) => balance.accountNo == Number(accountNum),
  );
  if (data) {
    res.status(200).send(data);
  } else {
    res.status(404).send('This account does not exist on balanceDatabase');
  }
};

export const getAllAccounts = (req: Request, res: Response) => {
  if (balanceDatabaseExist == true) {
    fs.readFile('./balanceDatabase.json', 'utf8', (err, content) => {
      res.send(content);
    });
  } else {
    res.send('Database is empty');
  }
};

export const transfer = (req: Request, res: Response) => {
  const body = req.body;
  const senderAcc = body.senderAccount;
  const receiverAcc = body.receiverAccount;
  const amountRecieved = body.amount;
  const description = body.transferDescription;

  const find1 = balanceDatabase.findIndex(
    (item: { accountNo: number }) => item.accountNo === senderAcc,
  );
  const find2 = balanceDatabase.findIndex(
    (item: { accountNo: number }) => item.accountNo === receiverAcc,
  );

  if (amountRecieved < balanceDatabase[find1].balance) {
    console.log(balanceDatabase[find1].balance);
    const transaction1 = {
      ...balanceDatabase[find1],
      balance: balanceDatabase[find1].balance - amountRecieved,
      createdAt: balanceDatabase[find1].createdAt,
    };

    balanceDatabase[find1] = transaction1;

    const transaction2 = {
      ...balanceDatabase[find2],
      balance: balanceDatabase[find2].balance + amountRecieved,
      createdAt: balanceDatabase[find2].createdAt,
    };
    balanceDatabase[find2] = transaction2;

    fs.writeFile(
      './balanceDatabase.json',
      JSON.stringify(balanceDatabase, null, 2),
      (err) => {
        console.log(err);
      },
    );
  } else {
    return res.status(404).send({ message: 'Insufficient fund' });
  }
  const transactionData = {
    reference: uuidv4(),
    senderAccount: senderAcc,
    amount: amountRecieved,
    receiverAccount: receiverAcc,
    transferDescription: description,
    createdAt: new Date().toISOString(),
  };

  fs.readFile(transactionDataPath, 'utf8', function (err, data) {
    const readData = JSON.parse(data);
    readData.push(transactionData);
    fs.writeFile(
      transactionDataPath,
      JSON.stringify(readData, null, 2),
      'utf8',
      (err) => console.log(err),
    );
  });

  res.send(JSON.stringify(transactionData, null, 2));
};
