import React, { useState, useRef, useEffect } from "react";

import { authentication } from "../../functions/authFormValidation";

import styles from "./auth.module.css";
import axios from "axios";

import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { forgotPasswordSuccess, fetchUser } from "../../redux/auth/userAction";
import useTitle from "../../hooks/useTitle";

const ForgotPassword = () => {

useTitle("Forgot Password")


  const success = useRef();
  const failed = useRef();

  const router = useRouter()

  const { isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();



  const [input, setInput] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});


  const [user, setUser] = useState({})




useEffect(() => {
  if (isLoggedIn) {
    router.push("/dashboard")
  }
}, [isLoggedIn]);



  useEffect(() => {
    setErrors(authentication(input, "FORGOT_PASSWORD"));
  }, [input, touched]);


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
  }, [input.email, errors.email])


  const submitHandler = (event) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {

      if (!user) {
        failed.current.textContent = "Wrong Email!";
        success.current.textContent = "";
      } 
      if (user) {
        success.current.textContent = "Please Check Your Email to Recover Your Account.";
        failed.current.textContent = "";
        dispatch(forgotPasswordSuccess());


        if (input.email) {
          const emailBody = `<h1>Click to Reset Your Password</h1><a href='${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?email=${input.email}'>Reset My Password</a>`;
          axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_mail`, {
            text: emailBody,
            to: input.email,
            subject: "Reset Password",
          });
        }
      }
    } else {
      setTouched({ email: true });
    }

  };

  return (
    <>
      <div className={styles.container}>
          <h2 className={styles.accountsTitle}>Forgot Password</h2>
          <p className={styles.accountsHelp}><p>Enter your email and we will send</p>you a link to reset your password.</p>
        <form onSubmit={submitHandler}>

          <div>
            <p className={styles.formControlHead}>Email address:</p>  
            <input className={styles.formControl} type="email" name="email" value={input.email} onChange={changeHandler} onFocus={focusHandler} />
            <p className={styles.errors}>{errors.email && touched.email && errors.email}</p>
          </div>

          <button className={styles.btn} type="submit">
            Send reset link
          </button>
        </form>
          <div className={styles.messageError}>
            <span className={styles.failed} ref={failed}></span>
            <span className={styles.success} ref={success}></span>
          </div>
      </div>
    </>
  );
};

export default ForgotPassword;
