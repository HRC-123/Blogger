import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.js";
import Token from "../model/token.js";
import { response } from "express";
import  nodemailer  from "nodemailer";



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

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your OTP Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
        }
        .content {
            font-size: 16px;
            color: #555555;
            line-height: 1.5;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #000000;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your One-Time Password (OTP)</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Your OTP for resetting your password is:</p>
            <div class="otp">${request.body.otp[0]} - ${request.body.otp[1]} - ${request.body.otp[2]} - ${request.body.otp[3]}</div>
            <p>Please use this OTP to complete your password reset. Do not share this OTP with anyone.</p>
            <p>Thank you for using our service!</p>
            <p>Best regards,<br>Blogger 🅱️</p>
        </div>
        <div class="footer">
            <p>If you did not request this OTP, please contact our support team immediately.</p>
        </div>
    </div>
</body>
</html>
`;
  
  
  console.log("Came to controller of forgot Password");
  console.log(request.body.email);
  console.log(request.body.otp);
  // console.log(request.body.otp[0]);

  //Here the game starts
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Blogger 🅱️" <${process.env.MAIL_USERNAME}>`, // sender address
    to: request.body.email, // list of receivers
    subject: "OTP for resetting password",// Subject line
    // text: "Hello world?", // plain text body
    html: htmlContent, // html body
  });

  console.log("Message sent: %s", info.messageId);

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


