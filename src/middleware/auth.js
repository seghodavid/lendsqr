const jwt = require('jsonwebtoken')

module.exports = async(req, res, next) => {
    const headerToken = req.headers['authorization']

    const token = headerToken && headerToken.split(' ')[1]

    if (token === null) {
        return res.status(401).json({
            status: false,
            message: 'Unauthorized request'
        })
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: false,
                message: ' Unauthorized request'
            })
        }

        req.user = user;
    })

    next()
}


//    let decrypt;
//    try {
//      decrypt = jwt.verify(token, process.env.TOKEN_SECRET);
//    } catch (e) {
//      return res.status(403).json({
//        status: false,
//        message: " Unauthorized request",
//      });
//    }

//    if (!decrypt) {
//      return res.status(403).json({
//        status: false,
//        message: " Unauthorized request",
//      });
//    }
//    console.log(decrypt);
//    try {
//      decrypt = jwt.verify(token, process.env.TOKEN_SECRET);
//    } catch (e) {
//      return res.status(403).json({
//        status: false,
//        message: " Unauthorized request",
//      });
//    }

//    if (!decrypt) {
//      return res.status(403).json({
//        status: false,
//        message: " Unauthorized request",
//      });
//    }
//    console.log(decrypt);