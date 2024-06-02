import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.js";
import Token from "../model/token.js";
import { response } from "express";

dotenv.config();
export const signupUser = async (request, response) => {
  try {
    // const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    const user = {
      username: request.body.username,
      email: request.body.email,
      password: hashedPassword,
    };

    const newUser = new User(user);
    await newUser.save();

    // console.log("Response is by user-controller.js " + response);
    return response.status(200).json({ msg: "signup successful" });
  } catch (error) {
    console.log("Error is by user-controller.js " + error + response);
    return response
      .status(500)
      .json({ msg: "Error while signing up the user" });
  }
};

export const loginUser = async (request, response) => {
  let user = await User.findOne({ username: request.body.username });

  console.log(user);
  if (!user) {
    return response.status(400).json({ msg: "Username doesn't match" });
  }

  try {
    // console.log('aa')
    const match = await bcrypt.compare(request.body.password, user.password);
    if (match) {
      // console.log('bb')
      //!JWT AUTHENTICATION

      const accessToken = jwt.sign(
        user.toJSON(),
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: "15m" }
      );

      // console.log('cc');

      const refreshToken = jwt.sign(
        user.toJSON(),
        process.env.REFRESH_SECRET_KEY
      );

      // console.log('dd')

      //? If refresh token exists then we will create a new accessToken other wise we will not create a new access token
      const newToken = await new Token({ token: refreshToken });
      await newToken.save();

      return response
        .status(200)
        .json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          email: user.email,
          username: user.username,
        });
    } else {
      return response.status(400).json({ msg: "Password doesn't match" });
    }
  } catch (error) {
    return response
      .status(500)
      .json({ msg: "Error while logging in the user" });
  }
};

export const forgotPassword = async (request, response) => {
  console.log("Came to controller of forgot Password");
  return response.status(200).json({ msg: "Working Fine" });
};

export const resetPassword = async (request, response) => {
  try {
    console.log(request.body.password +"pass");
    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    console.log(hashedPassword);
 
    // const user = await User.find({});
    // const user = await User.findOne({ name: request.body.name });
    const user = await User.updateOne(
      { email: request.body.email},
      {
        $set: {
          password: hashedPassword,
        },
      }
    ).then((user) => {

      console.log(user);
    }).catch((error) => {
      console.log('error' + error);
    });

    // console.log(user);

    return response.status(200).json({ msg: "Done resetting password" });
  } catch (error) {
    return response
      .status(500)
      .json({ msg: "Error resetting the password of user" });
  }
};
