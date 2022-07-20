var express = require('express');
var router = express.Router();
import { allBalances, createAccount, individualBalance, transfer } from '../../users';
import { balance, validate, transaction } from "../../inputValidator"


/* GET users listing. */

router.get('/balances', allBalances);

router.route('/create-account').post(validate(balance), createAccount);

router.get('/balances/:accountNumber', individualBalance)

router.route('/transfer').post(validate(transaction), transfer);

export default router;
