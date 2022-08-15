const express = require("express");

const transactionController = require("../controller/transaction");
const isAuth = require("../../middleware/auth");

const router = express.Router();


router.post('/user/:userId/transaction', isAuth, transactionController.createTransactions)



module.exports = router