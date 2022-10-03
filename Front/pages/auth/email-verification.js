import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../redux/auth/userAction";
import styles from "./auth.module.css";
import useTitle from "../../hooks/useTitle";


const EmailVerification = () => {

useTitle("Email Verification")


  const success = useRef();
  const failed = useRef();

  const router = useRouter()



  const dispatch = useDispatch();

  const [user, setUser] = useState()


  useEffect(() => {
    if(router.isReady) {
      if (!router.query.email) {
        router.push("/auth/login")
    }
    }
  }, [router.query.email]);


  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users`).then((response) => {
      setUser(response.data.find((user) => user.email === router.query.email))
    })
  }, [router.query.email])

  useEffect(() => {
      if (user && user.emailVerified) {      
        success.current.textContent = "Your Email Address is Verified.";
        failed.current.textContent = "";
      } else {
        if(user && !user.emailVerified) {
          const response = fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users/${user._id}`, {
          method: "PATCH",
          body: JSON.stringify({emailVerified: true}),
          headers: {"Content-Type": "application/json"}
        })
          success.current.textContent = "Your Email Address Has Been Verified. You Can Now Login To Your Account.";
          failed.current.textContent = "";
          dispatch(logoutSuccess());
        }
      }
  }, [user && user.emailVerified])

console.log(user)




  return (
    <>
          <div className={styles.Msgcontainer}>

      <div className={styles.emailVerification}>
        <h2 className={styles.failed} ref={failed}></h2>
        <h2 className={styles.success} ref={success}>{!user && "Verifying..."}</h2>
      </div>
      </div>

    </>
  );
};

export default EmailVerification;
