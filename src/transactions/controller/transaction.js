const db = require("../../database/db");
const joi = require('joi')

exports.createTransactions = async(req, res) => {
    const user = req.params.userId
    const {
        amount, transactionTypes
    } = req.body

  //  joi.assert(amount, joi.number().integer().min(10));

    //find the wallet
    const wallet = await db('wallets').where({user: user})

    if (!wallet) {
      return res.status(400).json({ status:false, message: "Client not found" });
    }

    await db('transactions')
        .insert({
            amount,
            transactionTypes,
            wallet: wallet[0].walletId
        })
        .then(async(transaction) => {
          const userTransaction = await db("transactions").where({
            transactionId: transaction[0],
          });
          const wallet = await db("wallets").where({
            walletId: userTransaction[0].wallet,
          });

          if (userTransaction[0].transactionTypes === 'deposit') {
            const newBalance = (wallet[0].balance + userTransaction[0].amount);
            await db("wallets")
              .where({ walletId: userTransaction[0].wallet })
              .update({
                balance: newBalance,
              });
          } else if (userTransaction[0].transactionTypes === 'withdrawal') {
             const newBalance = wallet[0].balance - userTransaction[0].amount;
             await db("wallets")
               .where({ walletId: userTransaction[0].wallet })
               .update({
                 balance: newBalance,
               });
          } else if (userTransaction[0].transactionTypes === 'transfer') {
            const account_number = req.body.account_number;

            const newBalance = wallet[0].balance - userTransaction[0].amount;
            const user =  await db('users')
            .select({
              account_number: 'account_number', 
              name: 'name', 
              userId: 'userId'
            })
            .where({account_number: account_number})

            const creditedWallet = await db("wallets").where({
              user: user[0].userId,
            });

            //UPDATE CREDITED USER BALANCE
            await db("wallets")
              .where({ user: user[0].userId })
              .update({
                balance: userTransaction[0].amount + creditedWallet[0].balance,
              });
            
            // UPDATE DEBITED USER BALANCE
            await db("wallets")
              .where({ walletId: userTransaction[0].wallet })
              .update({
                balance: newBalance,
              });
          }
        })
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Your transaction was successful'
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 'failure',
                message: 'Something went wrong'
            })
        })
}