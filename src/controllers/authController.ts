import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";

interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
  };
}

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        message: "User already exists with this email",
      });
      return;
    }

    const createdUser = await User.create({
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
  } catch (err) {
    res.status(500).json({
      message: "Some Error Occured. Please Try Again",
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

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

    const signedToken = jwt.sign(
      { userId },
      process.env.JSON_SECRET as string,
      {
        expiresIn: "30d",
      }
    );

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
  } catch (err) {
    res.status(500).json({
      message: "Some Error Occured. Please Try Again",
    });
    return;
  }
};

export const signout = async (req: Request, res: Response) => {
  res.clearCookie("cookieData", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // ==
  });

  res.status(200).json({ message: "Logout Successful" });
  return;
};

export const requireSignin = expressjwt({
  secret: process.env.JSON_SECRET as string,
  algorithms: ["HS256"],
  requestProperty: "auth",
  getToken: (req: Request) => req.cookies?.cookieData || null,
});

export const isLoggedIn = (req: Request, res: Response) => {
  if (req.cookies.cookieData) {
    const authReq = req as AuthenticatedRequest;
    res.status(200).json({
      userId: authReq.auth.userId,
    });
    return;
  }
  res.status(401);
  return;
};
