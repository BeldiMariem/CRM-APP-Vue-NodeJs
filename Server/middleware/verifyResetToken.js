const jwt = require('jsonwebtoken');
const response = require('ybha-response');

module.exports = function (req, res, next) {
    //const token = req.header('auth-token');
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.RESET_PASSWORD_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            //console.log("req.user", req.user)
            next();
        });
    } else {
        response.unauthorized(err);
        //res.sendStatus(401);
    }
    // if(!token) return res.status(401).send('ACCESS DENIED!!');
    // try{
    //     const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    //     req.user = verified;
    //     next();
    // }catch (err){
    //     res.status(400).send('Invalid Token');
    // }
}