import { useState, useContext } from "react";
// import { Link } from "react-router-dom";
import { Box, TextField, Button, styled, Typography,Link } from "@mui/material";

import { API } from "../../service/api";
import { DataContext } from "../../context/DataProvider";

import { useNavigate } from "react-router-dom"; //?Custom hook

const Component = styled(Box)`
  width: 380px;
  margin: auto;
  box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
`;

const Image = styled("img")({
  width: "auto",
  margin: "auto",
  height: "90px",
  display: "flex",
  padding: "30px 10px",
  // "mix-blend-mode": "multiply",
});

const Wrapper = styled(Box)`
  padding: 0px 30px 25px;
  display: flex;
  flex: 1;
  flex-direction: column;
  margin:0px;
  & > div,
  & > button,
  & > p {
    margin-top: 20px;
  }
`;

const LoginButton = styled(Button)`
  text-transform: none;
  background: #fb641b;
  color: #fff;
  height: 48px;
  border-radius: 2px;
`;

const SignupButton = styled(Button)`
  text-transform: none;
  background: #fff;
  color: #2874f0;
  height: 48px;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0/20%);
`;

const Error = styled(Typography)`
  font-size: 10px;
  color: #ff6161;
  line-height: 0;
  margin-top: 10px;
  font-weight: 600;
`;

const Text = styled(Typography)`
  color: #878787;
  font-size: 12px;
`;

const signupInitialValues = {
  name: "",
  username: "",
  password: "",
};

const loginInitialValues = {
  username: "",
  password: "",
};

const ForgotPassword = styled(Typography)`
  font-size: 12px;
  color: blue;
  text-decoration: underline;
  cursor:pointer;
`;

const ForgotPasswordLink = styled(Link)`
  margin-top:10px;
`

const Login = ({ isUserAuthenticated }) => {
  const imageURL =
    "/logo-color.png";
  const [account, toggleAccount] = useState("login");
  const [signup, setSignup] = useState(signupInitialValues);
  const [login, setLogin] = useState(loginInitialValues);
  const [error, showError] = useState("");

  const { setAccount } = useContext(DataContext);

  const navigate = useNavigate();

  const toggleSignup = () => {
    showError("");
    account === "login" ? toggleAccount("signup") : toggleAccount("login");
  };

  function onInputChange(e) {
    //  console.log(e.target.name,e.target.value);
    setSignup({ ...signup, [e.target.name]: e.target.value });
    //  console.log(signup);
  }

  const signupUser = async () => {
    let response = await API.userSignup(signup)
      .then((response) => {
        if (response.isSuccess) {
          setSignup(signupInitialValues);
          // console.log("-"+error);
          showError("");
          toggleAccount("login");
        } else {
          showError("Something went wrong! please try again later");
        }
      })
      .catch((e) => {
        // console.log("------------------" + error+ "------------");
        showError("Something went wrong! please try again later");
      });
  };

  const onValueChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const loginUser = async () => {
    let response = await API.userLogin(login)
      .then((response) => {
        if (response.isSuccess) {
          //  setLogin(loginInitialValues);
          // console.log("-"+error);
          showError("");

          sessionStorage.setItem(
            "accessToken",
            `Bearer ${response.data.accessToken}`
          );
          sessionStorage.setItem(
            "refreshToken",
            `Bearer ${response.data.refreshToken}`
          );

          //?need to set username and name as global variables through context api

          setAccount({
            username: response.data.username,
            name: response.data.name,
          });

          isUserAuthenticated(true);
          navigate("/home");
        } else {
          showError(
            "Something went wrong while logging in! please try again later"
          );
        }
      })
      .catch((e) => {
        // console.log("------------------" + error+ "------------");
        showError(
          "Something went wrong while logging in! please try again later"
        );
      });
  };

  const forgotpassword = async () => {
    // const response = await API.forgotPassword().then((response) => {
      // console.log(response);
     
    // }).catch((err)=> console.log("error" + err));

    // console.log(response);

    navigate("/forgotPassword");

    console.log("In forgot Password");
  };

  return (
    <Component>
      <Box>
        <Image src={imageURL} alt="Login" />
        {account === "login" ? (
          <Wrapper>
            <TextField
              variant="standard"
              value={login.username}
              onChange={(e) => onValueChange(e)}
              name="username"
              label="User Name"
            />
            <TextField
              variant="standard"
              value={login.password}
              onChange={(e) => onValueChange(e)}
              name="password"
              label="Password"
            />

            {error && <Error>{error}</Error>}

            <LoginButton onClick={() => loginUser()} variant="contained">
              Login
            </LoginButton>

            <ForgotPasswordLink onClick={() => forgotpassword()}>
              <ForgotPassword>Forgot Password?</ForgotPassword>
            </ForgotPasswordLink>

            <Text style={{ textAlign: "center" }}>OR</Text>
            <SignupButton onClick={() => toggleSignup()}>
              Create an account
            </SignupButton>
          </Wrapper>
        ) : (
          <Wrapper>
            <TextField
              variant="standard"
              onChange={(e) => {
                onInputChange(e);
              }}
              name="name"
              label="Name"
            />
            <TextField
              variant="standard"
              onChange={(e) => {
                onInputChange(e);
              }}
              name="username"
              label="User Name"
            />
            <TextField
              variant="standard"
              onChange={(e) => {
                onInputChange(e);
              }}
              name="password"
              label="Password"
            />

            {error && <Error>{error}</Error>}

            <SignupButton onClick={() => signupUser()}>Sign Up</SignupButton>
            <Text style={{ textAlign: "center" }}>OR</Text>
            <LoginButton variant="contained" onClick={() => toggleSignup()}>
              Already have an account
            </LoginButton>
          </Wrapper>
        )}
      </Box>
    </Component>
  );
};

export default Login;
