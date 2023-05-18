
const { getUserById } = require('../../services/userService');
const { verifyAccessToken } = require('../../util/token');
module.exports = (...roles) => {

    return async(req, res, next) => {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(400).json({ msg: "Invalid Authentication" });
        const decode = verifyAccessToken(token);
        const { id } = decode;
        req.userId = id;
        // req.email = email;
        const user= await getUserById(id);
        if (!user) {
            return res.status(400).json({ msg: "Invalid Authentication", status: "fail" });
        }
        //set user info in res.locals
        res.locals.user = user;
        if (!user.role) {
            return res.status(400).json({ msg: "Invalid Authentication", status: "fail" });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({
                status: "fail",
                error: "You are not authorized to access this"
            });
        }
        next();
    };
};