"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = exports.requireSignin = exports.signout = exports.signin = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_jwt_1 = require("express-jwt");
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({
                message: "User already exists with this email",
            });
            return;
        }
        const createdUser = await User_1.default.create({
            name,
            email,
            password,
        });
        if (!createdUser) {
            res.status(500).json({
                message: "Some Error Occured. Please Try Again",
            });
            return;
        }
        res.status(200).json({
            message: "Signup Successful. Please Login.",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Some Error Occured. Please Try Again",
        });
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userFound = await User_1.default.findOne({ email });
        if (!userFound) {
            res.status(400).json({
                message: "User not found with this email",
            });
        }
        const isPasswordValid = await userFound?.comparePassword(password);
        if (!isPasswordValid) {
            res.status(400).json({
                message: "Email or Password is incorrect",
            });
            return;
        }
        const userId = await userFound?._id;
        const signedToken = jsonwebtoken_1.default.sign({ userId }, process.env.JSON_SECRET, {
            expiresIn: "30d",
        });
        res.cookie("cookieData", signedToken, {
            expires: new Date(Date.now() + 900000),
            secure: true,
            sameSite: "none",
            httpOnly: true,
        });
        res.status(200).json({
            message: "Success",
        });
        return;
    }
    catch (err) {
        res.status(500).json({
            message: "Some Error Occured. Please Try Again",
        });
        return;
    }
};
exports.signin = signin;
const signout = async (req, res) => {
    res.clearCookie("cookieData", { path: "/" }).send();
    res.status(200).json({
        message: "Logout Successful",
    });
    return;
};
exports.signout = signout;
exports.requireSignin = (0, express_jwt_1.expressjwt)({
    secret: process.env.JSON_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth",
    getToken: (req) => req.cookies?.cookieData || null,
});
const isLoggedIn = (req, res) => {
    if (req.cookies.cookieData) {
        const authReq = req;
        res.status(200).json({
            userId: authReq.auth.userId,
        });
        return;
    }
    res.status(401);
    return;
};
exports.isLoggedIn = isLoggedIn;
