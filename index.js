const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./src/user/routes/user')
const transactionRouter = require('./src/transactions/routes/transaction')

dotenv.config()

const app = express()

app.use(express.json());
app.use(userRouter)
app.use(transactionRouter)

app.get('/', (req, res) => {
    res.send('Hello from Lendsqr')
})

app.listen(process.env.PORT || 4000, ()=> {
    console.log('The lendsqr server is up and running')
})

module.exports = app;