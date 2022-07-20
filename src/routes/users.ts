import {getUserAccount, getAllAccounts, createAccount, transfer} from '../controllers/controller';
import express from 'express';
import { balance, transaction, validate } from '../validation';
const router = express.Router();

//import { postValidator } from '../Validation/inputValidation';
// var database = require('../database.json');

/* GET users listing. */
console.log('USER.TS, WE ARE HEREEEEEEEEEEEE')

router.get('/balance/:accountNo', getUserAccount);
router.get('/balance', getAllAccounts);
router.post('/create-account', validate(balance), createAccount);
router.post('/transfer', validate(transaction), transfer);
// router.put('/:id', updateUserData);
// router.delete('/:id', deleteUser);

export default router;
