import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, styled, Button, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

const Outline = styled(Box)`
  width: 380px;
  height: auto;
  margin: auto;
  box-shadow: 5px 2px 5px 2px rgb(0 0 0 / 0.6);
`;

const Wrapper = styled(Box)`
  padding: 0px 30px 25px;
  display: flex;
  flex: 1;
  flex-direction: column;

  & > div,
  & > button {
    margin-top: 20px;
  }
`;

const OTPName = styled(Typography)`
  color: #1976d2;
  font-weight: bolder;
  margin: 4px 0px;
`;

const OTPBox = styled(Box)`
  margin: 0px;
`;
const OTP = styled(Box)`
  display: flex;
  gap: 11px;
  align-items: center;
  height: 50px;
  justify-content: center;
  margin-bottom: 4px;
`;

const Number = styled(TextField)`
  height: 50px;
  width: 50px;

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const Error = styled(Typography)`
  font-size: 13px;
  color: #ff6161;
  line-height: 0;
  margin-top: 20px;
  font-weight: bolder;
  margin-left: 10px;
`;

const OTPButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
`;

const SuccessText = styled("span")(({ success }) => ({
  color: success ? "green" : "red",
  fontWeight: "bolder",
  fontSize: "14px",
  marginTop: "22px",
  marginLeft: "10px",
}));

const SuccessVerify = styled("span")(({ verified }) => ({
  color: verified ? "green" : "red",
  fontWeight: "bolder",
  fontSize: "14px",
  marginTop: "22px",
  marginLeft: "10px",
}));

var digit1;
var digit2;
var digit3;
var digit4;

const ForgotPassword = ({ isUserVerified }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [verifyText, setVerifyText] = useState("");
  const [attempted, setAttempted] = useState(false);

  const inputRefs = useRef([]);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setOtp(["", "", "", ""]);
    setEmail(event.target.value);
    setError(false);
    setHelperText("");
    setSuccess(false);
  };

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      setError(true);
      setHelperText("Please enter a valid email");
      setSuccess(false);
    } else {
      setError(false);
      setHelperText("Success");
      setSuccess(true);
      setTimeout(() => {
        digit1 = randomNumberInRange(0, 9);
        digit2 = randomNumberInRange(0, 9);
        digit3 = randomNumberInRange(0, 9);
        digit4 = randomNumberInRange(0, 9);
        console.log(digit1, digit2, digit3, digit4);
      }, 500);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInput = (e, index) => {
    const value = e.target.value;

    if (value >= 0 && value <= 9) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index] === "" && index > 0) {
        newOtp[index - 1] = "";
        inputRefs.current[index - 1].focus();
      } else {
        newOtp[index] = "";
      }
      setOtp(newOtp);
    }
  };

  const isOtpComplete = () => {
    return otp.every((digit) => digit !== "");
  };

  useEffect(() => {
    console.log(otp.join(""));
  }, [otp]);

  const verifyInput = () => {
    setAttempted(true);
    if (
      digit1 == otp[0] &&
      digit2 == otp[1] &&
      digit3 == otp[2] &&
      digit4 == otp[3]
    ) {
      console.log("Otp right");
      setVerified(true);
      setVerifyText("Verification Successful");

      isUserVerified(true);

      console.log("Going on......");

      navigate("/resetPassword");
    } else {
      console.log("Wrong");
      setVerified(false);
      setVerifyText("Otp not verified! Please try again!!");
    }
  };

  return (
    <Outline>
      <Wrapper>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={handleChange}
          error={error}
          helperText={
            helperText ? (
              !success ? (
                <SuccessText>{helperText}</SuccessText>
              ) : (
                <></>
              )
            ) : (
              <></>
            )
          }
          required
          focused
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
        >
          Send
        </Button>

        {success && <SuccessText success={success}>{helperText}</SuccessText>}

        {success && (
          <OTPBox>
            <OTPName>OTP :</OTPName>
            <OTP>
              {otp.map((digit, index) => (
                <React.Fragment key={index}>
                  <Number
                    type="number"
                    value={digit}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    inputProps={{ maxLength: 1 }}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    required
                    focused
                  />
                  {index < otp.length - 1 && <span>-</span>}
                </React.Fragment>
              ))}
            </OTP>
            {isOtpComplete() ? (
              <OTPButton
                variant="contained"
                color="success"
                onClick={() => verifyInput()}
              >
                Verify
              </OTPButton>
            ) : (
              <OTPButton variant="outlined" color="error" disabled>
                Verify
              </OTPButton>
            )}

            {attempted && (
              <SuccessVerify verified={verified}>{verifyText}</SuccessVerify>
            )}
          </OTPBox>
        )}
      </Wrapper>
    </Outline>
  );
};

export default ForgotPassword;
