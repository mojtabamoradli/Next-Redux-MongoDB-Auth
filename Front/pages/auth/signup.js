import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authentication } from "../../functions/authFormValidation";
import styles from "./auth.module.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { signupSuccess, logoutSuccess } from "../../redux/auth/userAction";
import { useRouter } from "next/router";
import bcrypt from "bcryptjs"
import useTitle from "../../hooks/useTitle";

const SignUp = () => {



useTitle("Sign up")


  const success = useRef();
  const failed = useRef();

  const router = useRouter()

  const { userExist, isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  const [input, setInput] = useState({fullName: "", email: "", password: "", password: "" });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [user, setUser] = useState({})


  useEffect(() => {
    if (userExist && isLoggedIn) {
      router.push("/dashboard")
    }
  }, [userExist, isLoggedIn]);

  useEffect(() => {
    setErrors(authentication(input, "SIGNUP"));
  }, [input, touched]);


  const changeHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
    };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };



  useEffect(() => {
    if (!errors.email && input.email != "" && user=={}) {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users`).then((response) => {
        setUser(response.data.find((user) => user.email === input.email));
      });
    }
  }, [input.email])



  const submitHandler = async (event) => {
    event.preventDefault();

    if (!Object.keys(errors).length) {

      
      if (window && window.navigator.onLine)  {

        if (Object.keys(user).length) {
          failed.current.textContent = "User with This Email already exist.";
          success.current.textContent = "";
          setUser({})
          
        } else {
          if(user.email === input.email) {
            failed.current.textContent = "User with This Email already exist.";
            success.current.textContent = "";
            setUser({})
          } else {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users/signup`, {
              method: "POST",
              body: JSON.stringify({fullName: input.fullName, email: input.email, password: bcrypt.hashSync(input.password, bcrypt.genSaltSync(10))}),
              headers: {"Content-Type": "application/json"}
            })
            dispatch(signupSuccess());
            failed.current.textContent = "";
            success.current.textContent = "Registration Successful. Please Check Your Email to Verify Your Email Address.";
  
            if (input.email) {
              const emailBody = `<h1>Click to Verify Your Email Address</h1><a href='${process.env.NEXT_PUBLIC_BASE_URL}/auth/email-verification?email=${input.email}'>Verify My Email Address</a>`;
              axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/send_mail`, {
              text: emailBody,
              to: input.email,
              subject: "Email Verification",
            });
          }
          dispatch(logoutSuccess());
          }



      }}  else {
        success.current.textContent = "";
        failed.current.textContent = "Please Check Your Internet Connection.";
      }


    } else {
      setTouched({ fullName: true, email: true, password: true });
    }
  






  };

  return (
    <>
      <div className={styles.container}>
          <h2 className={styles.accountsTitle}>Create your account</h2>

        <form onSubmit={submitHandler}>

          <div>
            <p className={styles.formControlHead}>Full Name:</p>
            <input className={styles.formControl} type="text" name="fullName" value={input.fullName} onChange={changeHandler} onFocus={focusHandler} />
            <p className={styles.errors}>{errors.fullName && touched.fullName && errors.fullName}</p>
          </div>
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
          Sign up
          </button>


        </form>
          <div className={styles.messageError}>
            <span className={styles.failed} ref={failed}></span>
            <span className={styles.success} ref={success}></span>
          </div>
          <div className={styles.agreeRules}>
            <span >By Creating an Account You Agree to Our </span><Link  href="/rules/terms-of-use">Terms of Use</Link>.
            </div>

          <div className={styles.accounts}>
            <span >Already Have an Account? </span>
            <Link className={styles.a} href="/auth/login">
              Log in
            </Link>
          </div>
      </div>
    </>
  );
};

export default SignUp;
