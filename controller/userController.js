const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendOTP, sendMessage } = require("../util/sendOTP");
const User = require("../models/user.model");
const { generateToken, generateRefreshToken } = require("../util/token");
const { findUserByPhoneNumber, signupService, deleteUser, getUsers, getUserById, updateUser, bulkUpdateById, findUserByIdNumber } = require("../services/userService");
let refreshTokens = require("../util/refreshTokens")
const { unlinkSync } = require("fs");
const { filterOption } = require("../util/filterOption");

const userController = {
    //user signup fun
    register: async (req, res) => {
        const idCardImage = req.files.idCardImage[0].filename ? req.files.idCardImage[0].filename : "";
        const image = req.files.image[0].filename ? req.files.image[0].filename : "";
        const userInfo = {
            ...req.body,
            idCardImage,
            image,
        }
        try {
            const user = await signupService(userInfo);
            const otp = await user.genaerateVerifyOTP();
            //send otp
            const response = await sendOTP(user.phoneNumber, otp);
            if (response.response_code !== 202) {
                //delete user
                await deleteUser(user._id);
                return res.status(400).json({ error: "Something went wrong" });
            }
            await user.save();
            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    //user login ==>
    login: async (req, res) => {
        const { password, IdNumber } = req.body;

        if (!IdNumber && !password) {
            return res.status(400).json({ error: "Please provide Id and password" });
        }
        try {
            const user = await findUserByIdNumber(IdNumber);
            if (!user) {
                return res.status(400).json({ error: "Invalid Id or password" });
            }
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(400).json({ error: "Invalid Id or password" });
            }
            if (!user.isVerified) {
                return res.status(400).json({ error: "Please verify your phone number" });
            }
            if (user.status !== "active") {
                return res.status(400).json({ error: "Your account is not activated yet" });
            }

            //generate access token
            const accessToken = generateToken(user._id)

            //generate refresh token
            const refreshToken = generateRefreshToken(user._id)

            //store refresh token
            refreshTokens.push(refreshToken);
            const { password: pwd, ...others } = user.toObject();
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refreshToken',
                maxAge: 70 * 24 * 60 * 60 * 1000 // 7d
            });
            res.status(200).json({
                success: true,
                message: "Successfully logged in",
                data: {
                    user: others,
                    accessToken,
                    refreshToken
                },
            })


        } catch (error) {;
            res.status(500).json({ error: error.message });
        }
    },
    //user logout
    logout: async (req, res) => {
        try {
            const refreshToken = req.body;
            if (!refreshToken) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            refreshTokens = refreshTokens.filter(token => token !== refreshToken);
            res.status(200).json({ message: "Successfully logged out" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //user refresh token
    refreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ error: "Forbidden" });
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({ error: "Forbidden" });
            }
            const accessToken = generateToken(user._id);
            res.status(200).json({ accessToken });
        });
    },
    // verify Id with verification code
    verifyPhoneNumber: async (req, res) => {
        const { phoneNumber, verificationCode } = req.body;
        try {
            const user = await findUserByPhoneNumber(phoneNumber);
            if (!user) {
                return res.status(400).json({ error: "Invalid phone number or verification code" });
            }
            if (user.verifyOTP !== verificationCode) {
                return res.status(400).json({ error: "Invalid phone number or verification code" });
            }
            user.isVerified = true;
            user.verifyOTP = undefined;
            user.verifyOTPExpire = undefined;
            await user.save();
            res.status(200).json({ message: "Phone number verified successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    passwordReset: async (req, res) => {
        const { IdNumber } = req.body;
        try {
            const user = await findUserByIdNumber(IdNumber);
            if (!user) {
                return res.status(400).json({ error: "Invalid Id" });
            }
            const otp = await user.generateVResestOTP();
            //send otp
            const response = await sendOTP(user.phoneNumber, otp);
            if (response.response_code !== 202) {
                return res.status(400).json({ error: "Something went wrong" });
            }
            await user.save();
            res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    passwordResetVerify: async (req, res) => {
        const { IdNumber, verificationCode, password } = req.body;
        try {
            const user = await findUserByIdNumber(IdNumber);
            if (!user) {
                return res.status(400).json({ error: "Invalid Id or verification code" });
            }
            if (user.resetOTP !== verificationCode) {
                return res.status(400).json({ error: "Invalid Id or verification code" });
            }
            // const hasedPassword = await bcrypt.hashSync(password, 10);

            user.password = password;
            user.isVerified = true;
            user.resetOTP = undefined;
            user.resetOTPExpire = undefined;
            await user.save();
            res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    passwordChange: async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const reqUser= res.locals.user;
        try {
            const user = await getUserById(reqUser._id);
            const validPassword = await bcrypt.compare(oldPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: "Invalid old password" });
            }
            user.password = newPassword;
            await user.save();
            res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },



    getUsers: async (req, res) => {
        try {
            const { filters, queries } = filterOption(req)
            console.log(req.query);
            console.log(filters, queries);
            const users = await getUsers(filters, queries);

            // remove password, verification code, reset code, reset code expire, verification code expire from the response
            users.users.forEach(user => {
                user.password = undefined;
                user.verificationCode = undefined;
                user.verifyOTPExpire = undefined;
                user.resetOTP = undefined;
                user.resetOTPExpire = undefined;
                user.verifyOTP = undefined;

            })
            res.status(200).json({
                success: true,
                data: users,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "can't get the data",
                error: error.message,
            });
        }
    },
    // get user by id
    getUser: async (req, res) => {
        try {
            const user = await getUserById(req.params.id);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "user not found",
                });
            }
            // remove password, verification code, reset code, reset code expire, verification code expire from the response
            user.password = undefined;
            user.verifyOTPExpire = undefined;
            user.resetOTP = undefined;
            user.resetOTPExpire = undefined;
            user.verifyOTP = undefined;

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "can't get the data",
                error: error.message,
            });
        }
    },
    // update user
    updateUser: async (req, res) => {
        try {
            const user = await updateUser(req.params.id, req.body);
            // remove password, verification code, reset code, reset code expire, verification code expire from the response
            user.password = undefined;
            user.resetOTP = undefined;
            user.resetOTPExpire = undefined;
            user.verifyOTP = undefined;
            user.verifyOTPExpire = undefined;

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "can't get the data",
                error: error.message,
            });
        }
    },

    // bulk status update
    bulkUpdate: async (req, res) => {
        const { ids, status } = req.body;
        try {

            const result = await bulkUpdateById(ids, status);
            // if no user updated

            if (result.modifiedCount === 0) {
                return res.status(400).json({
                    success: false,
                    message: "can't update the data",
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    data: `updated ${result.modifiedCount} users successfully`,
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "can't update the data",
                error: error.message,
            });
        }
    },

    // image and logo update
    imageAndIdCardUpdate: async (req, res) => {
        const user = await getUserById(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "can't update the data",
                error: "user not found",
            });
        }
        console.log();
        if (req.files.image === undefined && req.files.idCardImage === undefined) {
            return res.status(400).json({
                success: false,
                message: {
                    image: "image is required",
                    idCardImage: "id card image is required",
                }
            });
        }

        try {
            const logo = req.files?.idCardImage ? req.files.idCardImage[0].filename : user.idCardImage;
            const image = req.files?.image ? req.files?.image[0]?.filename : user.image;
            const result = await updateUser(req.params.id, { logo, image });
            // if image and logo  updated successfully then remove the old image and logo
            if (result) {
                if (req.files?.logo) {
                    unlinkSync(`./public/uploads/${user.idCardImage}`);
                }
                if (req.files?.image) {
                    unlinkSync(`./public/uploads/${user.image}`);
                }
            }
            result.password = undefined;
            result.resetOTP = undefined;
            result.resetOTPExpire = undefined;
            result.verifyOTP = undefined;
            result.verifyOTPExpire = undefined;

            res.status(200).json({
                success: true,
                message: "updated successfully",
                data: result,
            });
        }
        catch (error) {

            res.status(400).json({
                success: false,
                message: "can't update the data",
                error: error.message,
            });
        }
    },

    statusUpdate: async (req, res) => {
        const { id } = req.params;
        try {
            const { status } = req.body;
            const user = await getUserById(id);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "user not found",
                });
            }
            if (status === "delete") {
                //send user delete sms
                const message = `Dear ${user.name}, your have to re create account with correct information. Thanks`;
                console.log({user});
                await sendMessage(user.phoneNumber, message);
                await user.remove();
                return res.status(200).json({
                    success: true,
                    message: "user deleted successfully",
                });
            }
            user.status = status;
            await user.save();
            res.status(200).json({
                success: true,
                message: "user status updated successfully",
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "can't update the data",
                error: error.message,
            });
        }
    },
     allUsers :(async (req, res) => {
        const user = res.locals.user;
        try {
          const keyword = req.query.search
            ? {
                $or: [
                  { name: { $regex: req.query.search, $options: "i" } },
                  { email: { $regex: req.query.search, $options: "i" } },
                ],
              }
            : {};
          const allUserData = await User.find(keyword).find({
            _id: { $ne: user._id },
          });
          if (allUserData.length === 0) {
          return  res.status(200).json({
              message: "No user Exist",
            });
          }
       return   res.status(200).json({
            users: allUserData,
          });
        } catch (err) {
          res.status(500);
          throw new Error(err);
        }
      })

}



// module.exports = router;  
//defult export google auth
module.exports = userController;
// export default googleAuth;
// module.exports = googleAuthCallback;