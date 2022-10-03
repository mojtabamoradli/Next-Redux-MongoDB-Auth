import styles from "./auth.module.css";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authentication } from "../../functions/authFormValidation";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "../../redux/auth/userAction";
import axios from "axios";
import useTitle from "../../hooks/useTitle";

const OTPLogin = () => {
  useTitle("Log in with OTP");

  const success = useRef();
  const failed = useRef();

  const router = useRouter();

  const { isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [input, setInput] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [user, setUser] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setErrors(authentication(input, "LOGIN_WITH_OTP"));
  }, [input, touched]);

  useEffect(() => {
    if (router.query.email) {
      if (typeof window !== "undefined") {
        if (router.query.OTPkey === window.localStorage.getItem("OTPkey")) {
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users`).then((response) => {
              dispatch(loginSuccess(response.data.find((user) => user.email === router.query.email)));
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
              
          })
        } else {
          success.current.textContent = "";
          failed.current.textContent = "OTP Expired!";
        }
      }
    }
  }, [dispatch, router.query.email]);


  const changeHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  useEffect(() => {
    if (!errors.email && input.email != "") {

      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users`).then((response) => {
        setUser(response.data.find((user) => user.email === input.email));
      });
    }
  }, [input.email, errors.email]);


  const submitHandler = (event) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {
      if (window && window.navigator.onLine) {
        if (user) {
          if (user.email === input.email) {
            if (user.emailVerified) {
              if (user.status === "allowed") {
                window.localStorage.setItem("OTPkey", Math.floor(Math.random() * 10 ** 21).toString(36));
                window.localStorage.setItem("OTPkeyExpireTime", new Date().getTime());
                const emailBody = `<h1>Click to Login to Your Account</h1><a href='${process.env.NEXT_PUBLIC_BASE_URL}/auth/login-with-otp?email=${input.email}&OTPkey=${window.localStorage.getItem("OTPkey")}'>Login</a>`;
                axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_mail`, {
                  text: emailBody,
                  to: input.email,
                  subject: "OTP Login",
                });
                success.current.textContent = `Please Check Your Email to Login to Your Account.`;
                failed.current.textContent = "";
              } else {
                success.current.textContent = "";
                failed.current.textContent = "Access Denied! Please Contact: contact@mojtabamoradli.ir";
              }
            } else {
              dispatch(loginFailure());
              success.current.textContent = "";
              failed.current.textContent = "Please Check Your Email to Verify Your Account.";

              if (input.email) {
                const emailBody = `<h1>Click to Verify Your Email Address</h1><a href='${process.env.NEXT_PUBLIC_BASE_URL}/auth/email-verification?email=${input.email}'>Verify My Email Address</a> `;
                axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_mail`, {
                  text: emailBody,
                  to: input.email,
                  subject: "Email Verification",
                });
              }
            }
          } else {
            success.current.textContent = "";
            failed.current.textContent = "Wrong Email!";
          }
        } else {
          success.current.textContent = "";
          failed.current.textContent = "Database Error! Please try logging in again.";
          setUser({});
        }
      } else {
        success.current.textContent = "";
        failed.current.textContent = "Please Check Your Internet Connection.";
      }
    } else {
      setTouched({ email: true });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.accountsTitle}>Log with OTP</h2>
      <div className={styles.accountsHelp}>
        <p>We'll email you a magic link</p>
        <p>for a password-free sign in.</p>
      </div>
      <form onSubmit={submitHandler}>
        <div>
          <p className={styles.formControlHead}>Email address:</p>
          <input className={styles.formControl} type="email" name="email" value={input.email} onChange={changeHandler} onFocus={focusHandler} />
          <p className={styles.errors}>{errors.email && touched.email && errors.email}</p>
        </div>

        <button className={styles.btn} type="submit">
          Send link
        </button>

      </form>
      <div className={styles.messageError}>
        <span className={styles.success} ref={success}></span>
        <span className={styles.failed} ref={failed}></span>
      </div>
      <div className={styles.loginWith}><span>Log in with </span><Link className={styles.a} href="/auth/login">Password</Link>{" / "}<Link className={styles.a} href="/auth/login-with-sms">SMS</Link></div>
      <div className={styles.dontHaveAnAccount}><span>Don't Have an Account? </span><Link className={styles.a} href="/auth/signup">Sign up</Link></div>


    </div>
  );
};

export default OTPLogin;
