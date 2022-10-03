import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Head from "next/head";







const dashboard = () => {

    const router = useRouter();

    const {isLoggedIn} = useSelector((state) => state.user);

    
    useEffect(() => {
        if (!isLoggedIn) {
          router.push("/auth/login")
        }
      }, [isLoggedIn]);

    



    const [phone, setPhone] = useState("")

   
  








      const phoneHandler = async (event) => {
        event.preventDefault();

        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/users/${isLoggedIn._id}`, {
          method: "PATCH",
          body: JSON.stringify({phone: phone}),
          headers: {
            "Content-Type": "application/json"
          }
        })
        alert("Phone Number Submitted.")
        
      }






    return (
        <>

        <Head>
          <title>Dashboard</title>
        </Head>

        <h1>Dashboard</h1>




        <p>Phone Number:</p>
          <input type="text" name="phone" placeholder="09" value={phone} onChange={(event) => setPhone(event.target.value)}/>
          <button onClick={phoneHandler}> Submit Phone Number </button>



            
        </>
    );
};

export default dashboard;