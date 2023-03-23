
const { verifyAccessToken } = require('../../util/token');
module.exports = (...roles) => {

    return (req, res, next) => {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(400).json({ msg: "Invalid Authentication" });
        const decode = verifyAccessToken(token);
        const { id, role, phoneNumber, IdNumber, name, gender } = decode;
        req.userId = id;
        // req.email = email;
        console.log(decode);
        req.role = role;
        req.name = name;
        req.IdNumber = IdNumber;
        req.phoneNumber = phoneNumber;
        req.gender = gender
        if (!role) {
            return res.status(400).json({ msg: "Invalid Authentication", status: "fail" });
        }
        if (!roles.includes(role)) {
            return res.status(403).json({
                status: "fail",
                error: "You are not authorized to access this"
            });
        }
        next();
    };
};