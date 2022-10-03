import "../styles/globals.css";
import Layout from "../components/layout/Layout";

import { Provider } from "react-redux";
import store from "../redux/store";



function App({ Component, pageProps }) {



  if (typeof window !== "undefined" && new Date().getTime() > Number(Number(window.localStorage.getItem("OTPkeyExpireTime")) + Number(120000))) {  // 2 minutes
    window.localStorage.removeItem("OTPkeyExpireTime");
     window.localStorage.removeItem("OTPkey")
  }

  if (typeof window !== "undefined" && new Date().getTime() > Number(Number(window.localStorage.getItem("SMSkeyExpireTime")) + Number(120000))) {  // 2 minutes
    window.localStorage.removeItem("SMSkeyExpireTime");
     window.localStorage.removeItem("SMSkey")
  }

  if (typeof window !== "undefined" && new Date().getTime() > Number(Number(window.localStorage.getItem("LoginTime")) + Number(18000000))) {  // 5 hours
    window.localStorage.removeItem("persist:root");
    window.localStorage.removeItem("LoginTime");

  }





  return (
    <Provider store={store}>

    <Layout>
      <Component {...pageProps} />
       </Layout>
    
    </Provider>

  );
}

export default App;

 