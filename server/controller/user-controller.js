import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.js";
import Token from "../model/token.js";

dotenv.config();
export const signupUser = async (request, response) => {
  try {
    // const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    const user = {
      username: request.body.username,
      name: request.body.name,
      password: hashedPassword,
    };

    const newUser = new User(user);
    await newUser.save();

    // console.log("Response is by user-controller.js " + response);
    return response.status(200).json({ msg: "signup successful" });
  } catch (error) {
    // console.log("Error is by user-controller.js " + error + response);
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
      const newToken = await new Token({token:refreshToken});
      await newToken.save();

      return response.status(200).json({accessToken:accessToken,refreshToken:refreshToken,name:user.name,username:user.username});
    } else {
      return response.status(400).json({ msg: "Password doesn't match" });
    }
  } catch (error) {
    return response.status(500).json({msg:'Error while logging in the user'})
  }
};
