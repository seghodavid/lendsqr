const db = require('../../database/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {
    const {
        name,
        mobile_number,
        work_email,
        business_name,
        password
    } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const randomAccountnumber = Math.floor(Math.random() * 10000000000);

    await db("users")
      .insert({
        name,
        mobile_number,
        work_email,
        business_name,
        account_number: randomAccountnumber,
        password: hashedPassword,
      })
      .then(async (user) => {
        return await db('wallets')
        .insert({
            user: user[0],
            balance: 0
        })
      })
      .then((user) => {
        return res.status(201).json({
          status: true,
          message: `User ${name} was registered successfully`,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: "Something went wrong",
        });
        console.log(err)
      });
}

exports.login = async (req, res) => {
  const user = await db("users").where({
    work_email: req.body.work_email,
  });

  if (user.length === 0) {
    return res.status(400).json({
      status: false,
      message: "User does not exist",
    });
  }


  if (user.length > 0 && (await bcrypt.compare(req.body.password, user[0].password))) {
     const jwtToken = jwt.sign(
       { payload: user[0].userId },
       process.env.TOKEN_SECRET,
       { expiresIn: "2hr" }
     );
      res.status(200).json({
        status: true,
        message: 'login successful',
        token: jwtToken
      })
  }else {
    res.status(403).json({
        status: false,
        message: 'Email or password is incorrect'
    })
  }
}

exports.getAllUsers = async (req, res) => {
    try {
          await db('users')
    .select({
        userId: 'userId',
        work_email: 'work_email',
        business_name: 'business_name',
        name: 'name'
    })
    .then((user) => {
        if (user.length > 0) {
          res.status(200).json({
            status: true,
            data: user,
          });
        } else {
          res.status(404).json({
            status: false,
            message: "User not found",
          });
        }
    })
    } catch(error) {
         console.error(error);
         return res.status(500).json({
           status: false,
           message: "Something went wrong",
         });
    }
}

exports.getOneUser = async (req, res) => {
    try {
          await db('users')
    .select({
        userId: 'userId',
        work_email: 'work_email',
        business_name: 'business_name',
        name: 'name'
    })
    .where ({
        userId: req.params.id
    })
    .then((user) => {
        if (user[0]) {
          res.status(200).json({
            status: true,
            data: user[0],
          });
        } else {
          res.status(404).json({
            status: false,
            message: "User not found",
          });
        }
    })
    } catch(error) {
         console.error(error);
         return res.status(500).json({
           status: false,
           message: "Something went wrong",
         });
    }
}

exports.updateUser = async (req,res) => {
    db('users')
    .where({
        userId: req.user.payload
    })
    .update(req.body)
    .then(() => {
        res.status(200).json({
            status: true,
            message: "User updated successfully"
        })
    })
    .catch(err => {
        res.status(500).json({
            status:false,
            message: 'something went wrong'
        })
    })
}

exports.deleteUser = async (req, res) => {
    const authenticatedUser = req.user
    const user = await db("users")
       .where({
         userId: req.params.id,
       })

       if(user.length === 0) {
         return res.status(400).json({
           status: false,
           message: "User does not exist",
         });
       }
       if(user[0] === authenticatedUser) {
         await db("users")
           .del(user)
           .then(() => {
                 res.status(200).json({
                   status: true,
                   message: "User deleted successfully",
                 });
           })
           .catch((err) => console.log(err));
        }else {
            res.status(403).json({
                mesage: "Unauthorized request"
            })
        }
}