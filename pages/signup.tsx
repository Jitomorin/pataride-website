import Link from "next/link";
import AuthButton from "../components/AuthButton";
import InputField from "../components/InputField";
import Logo from "../images/logo/Pata Ride.png";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { logout, signup } from "@/utils/firebase/authentication";
import { addData, addNewCart, addUser } from "@/utils/firebase/firestore";
import { set } from "sanity";
import {
  sendEmailVerification,
  sendSignInLinkToEmail,
  signOut,
} from "firebase/auth";
import Snackbar from "@/components/Snackbar";
import styled from "styled-components";
import { useTheme } from "@/components/Theme";
import { auth, firebaseAuthErrors } from "@/utils/firebase/config";

const Wrapper = styled.section<{ theme: any }>`
  background-color: ${(props) =>
    props.theme === "light" ? "#fff" : "#17191a"};
`;
const SignupContainer = styled.div<{ theme: any }>`
  height: 120vh;
  /* width: 100vw; */
  background-image: url("/images/signup/authentication_wallpaper.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50rem 0;
  @media (max-width: 768px) {
    padding: 80rem 0;
  }
`;
const Box = styled.div<{ theme: any }>`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  width: 40.486%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 47px;
  img {
    width: 185px;
    height: 80px;
  }
  h1 {
    font-family: "Oswald", sans-serif;
    font-size: 38px;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const InputContainer = styled.div<{ theme: any }>`
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  width: 100%;
  span {
    margin-bottom: 10px;
    font-size: 17px;
  }
  input {
    background-color: ${(props) =>
      props.theme === "light" ? "#fff" : "#272a2c"};
    padding: 19px 30px 19px 30px;
    border-radius: 10px;
    font-size: 1.6rem;
    border: none;
    outline: none;
    margin-bottom: 2.3rem;
    color: #6e747c;
  }
`;
const ButtonContainer = styled.div<{ theme: any }>`
  margin-top: 70px;
  width: 100%;
`;
const AuthLink = styled.div<{ theme: any }>`
  margin-top: 20px;
  text-align: center;
  font-size: 15px;
  color: #000;
  text-decoration: none;
  display: flex;
  transition: ease-in-out 0.3s;

  p {
    margin-right: 2px;
    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
  a {
    border-bottom: 1px solid #f8d521;
    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
  a:hover {
    transition: ease-in-out 0.3s;

    scale: 1.03;
  }
`;
const AltSigninContianer = styled.div<{ theme: any }>`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  margin-top: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    div {
      margin-bottom: 1rem;
      margin-left: 5rem;
      margin-right: 5rem;
    }
  }
  div {
    background-color: white;
    border-radius: 10px;
    border: 0.5px solid #d1cece;
    /* height: auto; */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px;
  }
  img {
    width: 50px;
    height: 50px;
  }
  button:hover {
    transition: ease-in-out 0.3s;

    scale: 1.05;
  }
`;

function SignUp() {
  const { user }: any = useAuthContext();
  const router = useRouter();
  const { theme }: any = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");

  const emailCheck = () => {
    return (
      email !== "" &&
      email.includes("@") &&
      email.includes("@") &&
      (email.includes(".com") ||
        email.includes(".edu") ||
        email.includes(".net") ||
        email.includes(".org") ||
        email.includes(".gov") ||
        email.includes(".co") ||
        email.includes(".io") ||
        email.includes(".ai"))
    );
  };
  const passwordCheck = () => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-z]/i.test(password);
    return password.length >= 6 && hasUpperCase && hasNumber && hasLetter;
  };
  const confirmPasswordCheck = () => {
    return password === confirmPassword;
  };
  const fullNameCheck = () => {
    return fullName !== "";
  };
  const phoneNumberCheck = () => {
    // make sure number is 10 digits

    return phoneNumber.toString().length === 10;
  };

  const isFormValid = () => {
    if (
      emailCheck() &&
      passwordCheck() &&
      confirmPasswordCheck() &&
      fullNameCheck()
    ) {
      console.log("true");
      return true;
    }

    console.log("false");
    return false;
  };

  const createUser = (email: string, password: string, fullName: string) => {
    setLoading(true);
    // run an error check in the fields
    if (!isFormValid()) {
      setSnackbarMessage("Please fill in all fields correctly");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    } else {
      signup(email, password)
        .then((userCredential: any) => {
          if (!userCredential) {
            console.log("error:", userCredential);
            setSnackbarMessage("Error creating account");
            setSnackbarOpen(true);
          } else {
            const uid = userCredential.user?.uid;
            addUser({
              uid,
              email,
              fullName,
              role: "client",
              bio: "",
              profileUrl: "",
              coverImageURL: "",
              phoneNumber,
            }).then((res) => {
              addNewCart(uid).then((res) => {
                sendEmailVerification(userCredential, {
                  handleCodeInApp: true,
                  url: "http://localhost:3000/login",
                }).then(() => {
                  setSnackbarMessage(
                    "Email verification link sent to your email"
                  );
                  setSnackbarOpen(true);
                  logout().then(() => {
                    console.log("User logged out");

                    // sendSignInLinkToEmail(auth, email, {
                    //   handleCodeInApp: true,
                    //   url: "http://localhost:3000/login",
                    // }).then((res: any) => {
                    //   console.log(res);
                    //   router.push("/login");
                    // });
                  });
                });
              });
            });
          }
        })
        .catch((error) => {
          console.log("error:", error.code);
          firebaseAuthErrors
            .filter((doc) => doc?.code === error.code)
            .map((doc) => {
              setSnackbarMessage(doc?.message);
              setSnackbarOpen(true);
            });
        });
    }
    // signup function

    setLoading(false);
  };

  useEffect(() => {
    if (user != null) router.push("/");
  }, [user]);

  return (
    <>
      {/* <Navbar /> */}
      <Wrapper theme={theme}>
        {/* <HeroPages name="Vehicle Models" /> */}
        <SignupContainer>
          <Box theme={theme}>
            <Link href="/">
              <img
                src={"../images/logo/Pata Ride.png"}
                alt="logo"
                className=""
              />
            </Link>
            <h1>Create a new account</h1>
            <InputContainer theme={theme}>
              <div style={{ display: "flex" }}>
                <span>Email</span>
                {
                  <span style={{ marginLeft: "1px", color: "red" }}>
                    {emailCheck() ? "" : "*"}
                  </span>
                }
              </div>

              <InputField
                value={email}
                onChange={(e: any) => {
                  setEmail(e.target.value);
                }}
                placeholder="Enter your email"
              />
            </InputContainer>
            <InputContainer theme={theme}>
              <div style={{ display: "flex" }}>
                <span>Full Name</span>
                <span style={{ marginLeft: "1px", color: "red" }}>
                  {fullNameCheck() ? "" : "*"}
                </span>
              </div>

              <InputField
                value={fullName}
                onChange={(e: any) => {
                  setFullName(e.target.value);
                }}
                placeholder="Enter your full name"
              />
            </InputContainer>
            <InputContainer theme={theme}>
              <div style={{ display: "flex" }}>
                <span>Password</span>
                <span style={{ marginLeft: "1px", color: "red" }}>
                  {passwordCheck() ? "" : "*"}
                </span>
              </div>

              <InputField
                value={password}
                onChange={(e: any) => {
                  setPassword(e.target.value);
                }}
                placeholder="Enter your full password"
                type="password"
              />
              {passwordCheck() ? (
                <></>
              ) : (
                <span
                  style={{ fontSize: "10px", marginTop: "1rem", color: "red" }}
                >
                  Password must contain at least 6 characters 1 uppercase letter
                  and 1 number
                </span>
              )}
            </InputContainer>
            <InputContainer theme={theme}>
              <div style={{ display: "flex" }}>
                <span>Confirm password</span>
                <span style={{ marginLeft: "1px", color: "red" }}>
                  {confirmPasswordCheck() ? "" : "*"}
                </span>
              </div>

              <InputField
                value={confirmPassword}
                onChange={(e: any) => {
                  setConfirmPassword(e.target.value);
                }}
                placeholder="Confirm your password"
                type="password"
              />
            </InputContainer>
            <ButtonContainer theme={theme}>
              <AuthButton
                onClick={() => {
                  createUser(email, password, fullName);
                }}
                text={loading ? "Loading..." : "Continue"}
              />
            </ButtonContainer>
            <AuthLink theme={theme}>
              <p>Already have an account?</p>
              <Link href="/login">Log in</Link>
            </AuthLink>
          </Box>
        </SignupContainer>
        <Snackbar
          message={snackbarMessage}
          isVisible={snackbarOpen}
          onClose={() => {
            setSnackbarOpen(false);
          }}
        />
      </Wrapper>
    </>
  );
}

export default SignUp;
