import { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  styled,
  Typography,
  Link,
} from "@mui/material";
import { API } from "../../service/api";
import { DataContext } from "../../context/DataProvider";
import { useNavigate } from "react-router-dom";

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
});

const Wrapper = styled(Box)`
  padding: 0px 30px 25px;
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0px;
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
  email: "",
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
  cursor: pointer;
`;

const ForgotPasswordLink = styled(Link)`
  margin-top: 10px;
`;

const Login = ({ isUserAuthenticated }) => {
  const imageURL = "/logo-color.png";
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
    setSignup({ ...signup, [e.target.name]: e.target.value });
  }

  const signupUser = async () => {
    let response = await API.userSignup(signup)
      .then((response) => {
        if (response.isSuccess) {
          setSignup(signupInitialValues);
          showError("");
          toggleAccount("login");
        } else {
          showError("Something went wrong! please try again later");
        }
      })
      .catch(() => {
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
          showError("");

          sessionStorage.setItem(
            "accessToken",
            `Bearer ${response.data.accessToken}`
          );
          sessionStorage.setItem(
            "refreshToken",
            `Bearer ${response.data.refreshToken}`
          );

          setAccount({
            username: response.data.username,
            email: response.data.email,
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
        console.log(e);
        showError(
          "Something went wrong while logging in! please try again later"
        );
      });
  };

  const forgotpassword = async () => {
    navigate("/forgotPassword");
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
              onChange={onValueChange}
              name="username"
              label="User Name"
            />
            <TextField
              variant="standard"
              value={login.password}
              onChange={onValueChange}
              name="password"
              label="Password"
            />

            {error && <Error>{error}</Error>}

            <LoginButton onClick={loginUser} variant="contained">
              Login
            </LoginButton>

            <ForgotPasswordLink onClick={forgotpassword}>
              <ForgotPassword>Forgot Password?</ForgotPassword>
            </ForgotPasswordLink>

            <Text style={{ textAlign: "center" }}>OR</Text>
            <SignupButton onClick={toggleSignup}>
              Create an account
            </SignupButton>
          </Wrapper>
        ) : (
          <Wrapper>
            <TextField
              variant="standard"
              onChange={onInputChange}
              name="email"
              label="Email"
              value={signup.email}
            />
            <TextField
              variant="standard"
              onChange={onInputChange}
              name="username"
              label="User Name"
              value={signup.username}
            />
            <TextField
              variant="standard"
              onChange={onInputChange}
              name="password"
              label="Password"
              value={signup.password}
            />

            {error && <Error>{error}</Error>}

            <SignupButton onClick={signupUser}>Sign Up</SignupButton>
            <Text style={{ textAlign: "center" }}>OR</Text>
            <LoginButton variant="contained" onClick={toggleSignup}>
              Already have an account
            </LoginButton>
          </Wrapper>
        )}
      </Box>
    </Component>
  );
};

export default Login;
