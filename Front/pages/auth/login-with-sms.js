import styles from "./auth.module.css";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authentication } from "../../functions/authFormValidation";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/auth/userAction";
import axios from "axios";
import useTitle from "../../hooks/useTitle";



const SMSLogin = () => {



useTitle("Log in with SMS")


  const success = useRef();
  const failed = useRef();


  const router = useRouter();

  const { isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [input, setInput] = useState({ phone: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [SMS, setSMS] = useState(false);
  const [code, setCode] = useState((Math.floor((Math.random() * 10000) + 10000).toString().substring(1)));
  const [user, setUser] = useState({});


  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setErrors(authentication(input, "LOGIN_WITH_SMS"));
  }, [input, touched]);



  const changeHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };





  const submitHandler = (event) => {
    event.preventDefault();
    if (!errors.phone) {

      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_sms`, {
        to: input.phone,
        from: process.env.NEXT_PUBLIC_MELIPAYAMAK_PHONE_NUMBER,
        text: `Your Login Code is: ${code}`,
      });
      setSMS(true)
      success.current.textContent = `Code Sent.`;
      failed.current.textContent = "";
      window.localStorage.setItem("SMSkey", Math.floor(Math.random() * 10 ** 21).toString(36));
      window.localStorage.setItem("SMSkeyExpireTime", new Date().getTime());

    } else {
      setTouched({ phone: true });
    }
  };


  useEffect(() => {
    if (SMS) {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users`).then((response) => {
        setUser(response.data.find((user) => user.phone === input.phone));
      });
    }
  }, [SMS]);


  const codeHandler = () => {
    if(code===input.code) {
      if (window && window.navigator.onLine) {
        if (user) {
              if (user.status === "allowed") {

                const emailBody = `We're verifying a recent log in for ${input.phone} at ${new Date().toLocaleDateString('fa-IR-u-nu-latn', { year:'numeric',month:'2-digit',day:'2-digit'})}, ${new Date().toString().substring(15, 21)}; If you believe that this log in is suspicious, please contact: contact@mojtabamoradli.ir`;
                axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_mail`, {
                  text: emailBody,
                  to: user.email,
                  subject: `Successful log in for ${input.phone}`,
                });
                dispatch(loginSuccess(user));
                window.localStorage.setItem("LoginTime", new Date().getTime())
                success.current.textContent = `Login Successful.`;
                failed.current.textContent = "";
              } else {
                success.current.textContent = "";
                failed.current.textContent = "Access Denied! Please Contact: contact@mojtabamoradli.ir";
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
      success.current.textContent = "";
      failed.current.textContent = "Wrong Code!";
    }
  }



  return (
    <div className={styles.container}>
      <h2 className={styles.accountsTitle}>Log in with SMS</h2>
      <div className={styles.accountsHelp}>
        <p>We'll Message you a magic code</p>
        <p>for a password-free sign in.</p>
      </div>
      <form onSubmit={submitHandler}>
        <div>
          <p className={styles.formControlHead}>Phone Number:</p>
          <input className={styles.formControl} type="tel" name="phone" placeholder="09" value={input.phone} onChange={changeHandler} onFocus={focusHandler} />
          <p className={styles.errors}>{errors.phone && touched.phone && errors.phone}</p>

          {SMS && <>
          <p className={styles.formControlHead}>Code:</p>
          <input className={styles.formControl} type="text" placeholder="XXXX" name="code"  value={input.code} onChange={changeHandler} onFocus={focusHandler} />
          </>}
        </div>
        
        {!SMS && <button className={styles.btn} type="submit">Send SMS</button>}





      </form>
        {SMS && <button className={styles.btn} onClick={codeHandler} >Log in</button>}
      <div className={styles.messageError}>
        <span className={styles.success} ref={success}></span>
        <span className={styles.failed} ref={failed}></span>
      </div>


      <div className={styles.loginWith}><span>Log in with </span><Link className={styles.a} href="/auth/login">Password</Link>{" / "}<Link className={styles.a} href="/auth/login-with-otp">OTP</Link></div>
      <div className={styles.dontHaveAnAccount}><span>Don't Have an Account? </span><Link className={styles.a} href="/auth/signup">Sign up</Link></div>

    </div>
  );
};




export default SMSLogin;
