import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, styled, Button, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import { API } from "../../service/api";


const Outline = styled(Box)`
  width: 360px;
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

const NormalPassword = styled(Box)`
  display: flex;
  gap: 10px;
`;

const Error = styled(Typography)`
  font-size: 13px;
  color: #ff6161;
  line-height: 0;
  margin-top: 20px;
  font-weight: bolder;

`;

const initialValues = {
  email: 'k@gmail.com',
  password:'pass'
}


const ResetPassword = ({ isVerified }) => {
  const [visibility, setVisibility] = useState(false);
  const [passwordText, setPasswordText] = useState(false);
  const [confirmvisibility, setConfirmVisibility] = useState(false);
  const [confirmPasswordText, setConfirmPasswordText] = useState(false);

  const [details, setDetails] = useState(initialValues);
  

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

    const [wrong, setWrong] = useState(false);

  const navigate = useNavigate();

  const handleVisibility = () => {
    setVisibility(!visibility);
    setPasswordText(!passwordText);
  };

  const handleConfirmVisibility = () => {
    setConfirmVisibility(!confirmvisibility);
    setConfirmPasswordText(!confirmPasswordText);
  };

  const handleNormalPassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    console.log(password);
    
  };

  const handleConfirmPassword = (e) => {
    const newPassword = e.target.value;
    setConfirmPassword(newPassword);
    console.log(confirmPassword);
  };

  useEffect(() => {
    if (!isVerified) {
      navigate("/login");
    }
  }, [isVerified, navigate]);

  useEffect(() => {
    console.log(details);
  }, [details]);

  const savePassword = async() => {
    console.log(password);
      console.log(confirmPassword);
      

      if (password === confirmPassword) {
          setWrong(false);
        console.log(true);
        
      //  setDetails({...details,'password' : password})
        
          //Database save
          //Backend and sending email and getting email contents is remaining
        
        // console.log(details);
        
         const updatedDetails = { ...details, password: password }; //For setting Details it is taking time so used this
         setDetails(updatedDetails);

         try {
           const updating = await API.resetPassword(updatedDetails);
           console.log(updating);
           navigate("/login");
         } catch (error) {
           console.log("error in updating password: " + error);
         }
          

        // console.log(updating);


          
      }
      else {
          setWrong(true);
          console.log(false);

      }
    };
    
    useEffect(() => {
      console.log(password);
    }, [password]);

    useEffect(() => {
      console.log(confirmPassword);
    }, [confirmPassword]);

  return isVerified ? (
    <Outline>
      <Wrapper>
        {/* <Typography>Please Enter your Password</Typography> */}
        <NormalPassword>
          <TextField
            type={passwordText ? "text" : "password"}
            label="Password"
            variant="outlined"
            name="password"
            fullWidth
            onChange={(e) => handleNormalPassword(e)}
            required
          />
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => handleVisibility()}
          >
            {visibility ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </Button>
        </NormalPassword>

        <NormalPassword>
          <TextField
            type={confirmPasswordText ? "text" : "password"}
            label="Confirm Password"
            variant="outlined"
            onChange={(e) => handleConfirmPassword(e)}
            fullWidth
            required
          />
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => handleConfirmVisibility()}
          >
            {confirmvisibility ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </Button>
        </NormalPassword>

        <Button
          variant="contained"
          color="secondary"
          endIcon={<SaveIcon />}
          onClick={() => savePassword()}
        >
          Save
        </Button>

        {wrong && (
          <Error>Passwords do not match</Error>
        )}
      </Wrapper>
    </Outline>
  ) : null;
};

export default ResetPassword;
