import styles from "./auth.module.css";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authentication } from "../../functions/authFormValidation";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "../../redux/auth/userAction";
import axios from "axios";
import bcrypt from "bcryptjs";
import useTitle from "../../hooks/useTitle";
import jwt_decode from "jwt-decode"






// data fetch latency 



const Login = () => {
  useTitle("Log in");

  const success = useRef();
  const failed = useRef();
  const GoogleBTN = useRef();

  const router = useRouter();

  const { isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [input, setInput] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [user, setUser] = useState({});

  const handleCallbackResponse = (response) => {

    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users`).then((res) => {
      const GoogleUser = res.data.find((user) => user.email === jwt_decode(response.credential).email);

      if (!GoogleUser) {
         fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users/signup/google`, {
          method: "POST",
          body: JSON.stringify({fullName: jwt_decode(response.credential).name, email: jwt_decode(response.credential).email}),
          headers: {"Content-Type": "application/json"}
        })
        if (jwt_decode(response.credential).email) {
          const emailBody = `We're verifying a recent passwordless log in via Google for ${jwt_decode(response.credential).email} at ${new Date().toLocaleDateString('fa-IR-u-nu-latn', { year:'numeric',month:'2-digit',day:'2-digit'})}, ${new Date().toString().substring(15, 21)}; If you believe that this log in is suspicious, please contact: contact@mojtabamoradli.ir`;
          axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_mail`, {
            text: emailBody,
            to: jwt_decode(response.credential).email,
            subject: `Successful log in for ${jwt_decode(response.credential).email}`,
          });
        }
        //login
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users`).then((res) => {
          const GoogleUser = res.data.find((user) => user.email === jwt_decode(response.credential).email);

          dispatch(loginSuccess(GoogleUser));
          window.localStorage.setItem("LoginTime", new Date().getTime())
          success.current.textContent = "Login Successful.";
          failed.current.textContent = "";
    
          if (GoogleUser.email) {
            const emailBody = `We're verifying a recent passwordless log in via Google for ${GoogleUser.email} at ${new Date().toLocaleDateString('fa-IR-u-nu-latn', { year:'numeric',month:'2-digit',day:'2-digit'})}, ${new Date().toString().substring(15, 21)}; If you believe that this log in is suspicious, please contact: contact@mojtabamoradli.ir`;
            axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_mail`, {
              text: emailBody,
              to: GoogleUser.email,
              subject: `Successful log in for ${GoogleUser.email} from new device`,
            });
          }
        })

        
      }
      if(GoogleUser) {
        dispatch(loginSuccess(GoogleUser));
        window.localStorage.setItem("LoginTime", new Date().getTime())
        success.current.textContent = "Login Successful.";
        failed.current.textContent = "";
  
        if (GoogleUser.email) {
          const emailBody = `We're verifying a recent passwordless log in via Google for ${GoogleUser.email} at ${new Date().toLocaleDateString('fa-IR-u-nu-latn', { year:'numeric',month:'2-digit',day:'2-digit'})}, ${new Date().toString().substring(15, 21)}; If you believe that this log in is suspicious, please contact: contact@mojtabamoradli.ir`;
          axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_mail`, {
            text: emailBody,
            to: GoogleUser.email,
            subject: `Successful log in for ${GoogleUser.email} from new device`,
          });
        }
      }
    });
    


  }

 
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton( GoogleBTN.current, {theme: "filled_white", size: "medium", shape: "rectangular", type: "standard", text: "continue_with", 
    }
    )
  },[])



  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setErrors(authentication(input, "LOGIN"));
  }, [input, touched]);

  const changeHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  useEffect(() => {
    if (!errors.email && !errors.password && input.email != "" && input.password != "") {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users`).then((response) => {
        setUser(response.data.find((user) => bcrypt.compareSync(input.password, user.password) && user.email === input.email));
      });
    }
  }, [input.email, input.password, errors.email, errors.password])


  const submitHandler = (event) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {


      
      if (window && window.navigator.onLine) {
        

        if (user) {
          if (user.email === input.email) {
            if (user.emailVerified) {
              if (user.status === "allowed") {
                dispatch(loginSuccess(user));
                window.localStorage.setItem("LoginTime", new Date().getTime())
                success.current.textContent = "Login Successful.";
                failed.current.textContent = "";

                if (input.email) {
                  const emailBody = `We're verifying a recent log in for ${input.email} at ${new Date().toLocaleDateString('fa-IR-u-nu-latn', { year:'numeric',month:'2-digit',day:'2-digit'})}, ${new Date().toString().substring(15, 21)}; If you believe that this log in is suspicious, please contact: contact@mojtabamoradli.ir`;
                  axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_mail`, {
                    text: emailBody,
                    to: input.email,
                    subject: `Successful log in for ${input.email} from new device`,
                  });
                }
              } else {
                success.current.textContent = "";
                failed.current.textContent = "Access Denied! Please Contact: contact@mojtabamoradli.ir";
              }
            } else {
              success.current.textContent = "";
              failed.current.textContent = "Please Check Your Email to Verify Your Account.";
              dispatch(loginFailure());

              if (input.email) {
                const emailBody = `<h1>Click to Verify Your Email Address</h1><a href='${process.env.NEXT_PUBLIC_BASE_URL}/auth/email-verification?email=${input.email}'>Verify My Email Address</a>`;
                axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_mail`, {
                  text: emailBody,
                  to: input.email,
                  subject: "Email Verification",
                });
              }
            }
          } else {
            success.current.textContent = "";
            failed.current.textContent = "Wrong Email or Password!";
          }
        }  else{
          success.current.textContent = "";
          failed.current.textContent = "Database Error! Please try to log in again.";
          setUser({})
        }
      } else {
        success.current.textContent = "";
        failed.current.textContent = "Please Check Your Internet Connection.";
      }
    } else {
      setTouched({ email: true, password: true });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.accountsTitle}>Log in to your account</h2>
      <form onSubmit={submitHandler}>
        <div>
          <p className={styles.formControlHead}>Email address:</p>
          <input className={styles.formControl} type="email" name="email" value={input.email} onChange={changeHandler} onFocus={focusHandler} />
          <p className={styles.errors}>{errors.email && touched.email && errors.email}</p>
        </div>
        <div>
          <p className={styles.formControlHead}>Password:</p>
          <input className={styles.formControl} type="password" name="password" value={input.password} onChange={changeHandler} onFocus={focusHandler} />
          <p className={styles.errors}>{errors.password && touched.password && errors.password}</p>
        </div>

        <button className={styles.btn} type="submit">
          Log in
        </button>
      </form>

      <div className={styles.messageError}>
        <span className={styles.failed} ref={failed}></span>
        <span className={styles.success} ref={success}></span>
    </div>

      <div className={styles.forgotPassword}><Link className={styles.a} href="/auth/forgot-password">Forgot Password</Link></div>
      <div className={styles.loginWith}><span>Log in with </span><Link className={styles.a} href="/auth/login-with-otp">OTP</Link>{" / "}<Link className={styles.a} href="/auth/login-with-sms">SMS</Link></div>
          <div className={styles.GoogleBTN} ref={GoogleBTN}></div>
      <div className={styles.dontHaveAnAccount}><span>Don't Have an Account? </span><Link className={styles.a} href="/auth/signup">Sign up</Link></div>
      
    </div>
  );
};

export default Login;
