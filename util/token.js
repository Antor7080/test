const jwt = require("jsonwebtoken");


exports.generateToken = (id) => {

  const token = jwt.sign({id:id}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7days"
  });
  return token;
};
exports.generateRefreshToken = (id) => {


  const token = jwt.sign({id: id}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "70days"
  });
  return token;
}
exports.verifyAccessToken = (token) => {
  return (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return err;
    if (user) {
      return user
    } else {
      // console.error("invalid access token");
      throw createError("invalid access token")
    }
  }));
  // return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}
exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return err;
    return user;
  });
}