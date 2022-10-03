import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
// import crypto from "crypto"
import path from "path"
import styles from "../styles/Home.module.css"

export default function Home() {



  const Container = styled.div`
  text-align: center;

  
  `

  const Intro = styled.div`
  margin-top: 50px;
  `

  const Heading = styled.h1`
  font-size: 36px;
  color: #4e0e2e;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;

   span {
  color: #000;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

   }
  
  `

  const Leading = styled.div`
  font-size: 19px;
  color: #000000;
  text-align: center;
  font-weight: 500;
  margin-bottom: 20px;
  `




  return (
    <>
      <Head>
        <title>Home</title>
      </Head>


<Container>


<Intro>
<Heading>Nextjs, Redux, MongoDB Authentication</Heading>
<Leading>
<div className={styles.featuresContainer1}>
          <div>
            <p>+ Nextjs Frontend</p>
            <p>+ Nodejs Backend</p>
            <p>+ Email with Nodemailer</p>
            <p>+ Hashed Passwords with bcryptjs</p>
            <p>+ OTP Login</p>
            <p>+ Login with Password</p>
          </div>

          <div className={styles.featuresContainer2}>
            <div>
              <p>+ Login with SMS</p>
              <p>+ MeliPayamak SMS Service</p>
              <p>+ Create Account/Log in with Google</p>
              <p>+ Redux State Manager</p>
              <p>+ Forgot Password/Reset Password</p>
              <p>+ Protected Routes</p>
            </div>
          </div>
        </div>
</Leading>


</Intro>







      </Container>

    </>
  );
}
