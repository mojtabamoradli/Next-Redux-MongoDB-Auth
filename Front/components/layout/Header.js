import Link from 'next/link'
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { logoutSuccess } from "../../redux/auth/userAction";



const Div = styled.div`
width: 100%;

li {
  .active{
    opacity: 50%; 
    cursor: not-allowed; 
    pointer-events: none;
  }
}
`
const NavBigScreen = styled.div`
  margin-top: 30px;
  display: flex;
  background: none;
  justify-content: center;
  /* text-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */

  

h1 {
  line-height: 30px;
}
h2 {
  line-height: 20px;
  font-size: 20px;
  margin-top: 19px;
  margin-left: 15px;
}
`
const NavLeft = styled.div`


@media (max-width: 768px) {
    display: none;
}

ul {
  display: flex;
  gap: 20px;
  margin-right: 50px;
  margin-top: 20px;

  align-items: center;
  justify-items: center;
  justify-content: center;
  text-align: center;
  list-style: none;
}
`
const NavRight = styled.div`


@media (max-width: 768px) {
    display: none;
}

ul {
  display: flex;
  gap: 20px;
  margin-left: 50px;
  margin-top: 20px;
  align-items: center;
  justify-items: center;
  justify-content: center;
  text-align: center;
  list-style: none;
}
`
const NavSmallScreen = styled.div`
ul {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  align-items: center;
  justify-items: center;
  justify-content: center;
  text-align: center;
  list-style: none;
}

@media (min-width: 768px) {
    display: none;
}
`

const LiBut = styled.li`

a {

  background-color: #4e0e2e;
color: #fff;
border: #4e0e2e;
padding: 5px;
font-weight: bold;
font-size: 1rem;
border-radius: 0.375rem;
white-space: nowrap;
}

`

const Button = styled.p`
  
  background-color: #4e0e2e;
  color: #fff;
  border: #4e0e2e;
  padding: 5px;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 0.375rem;

  :hover {
    cursor: pointer;
    opacity: 50%;
  transition: all 1s ease;
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  -o-transition: all 1s ease;
  -ms-transition: all 1s ease;
  }
  `


const Header = () => {
  const router = useRouter();




  
  const { isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  


  
  return (
    <Div >
      <NavBigScreen>
        <NavLeft>
          <ul>
            <li className={router.pathname == "/services" && "active"}><Link href="/services">Services</Link></li>
          </ul>
        </NavLeft>


        <h1><Link href="/"><a>Mojtaba<br/>Moradli</a></Link></h1>
        <h2>Web<br/>Developer</h2>


        <NavRight >
          <ul >
            <li className={router.pathname == "/contact" && "active"}><Link href="/contact">Contact</Link></li>
            {isLoggedIn ? <LiBut><Link  href="/dashboard"><a>{isLoggedIn.fullName}</a></Link></LiBut> : (router.pathname != "/auth/login" && router.pathname != "/auth/login-with-otp" && router.pathname != "/auth/login-with-sms" && router.pathname != "/auth/signup" && <LiBut><Link href="/auth/login"><a>Account</a></Link></LiBut>)}
            {isLoggedIn && <li onClick={() => {dispatch(logoutSuccess())}}><Button>Logout</Button></li> }
          </ul>
        </NavRight>
      </NavBigScreen>

      <NavSmallScreen>
        <ul>
          <li className={router.pathname == "/services" && "active"}><Link href="/services">Services</Link></li>
          <li className={router.pathname == "/contact" && "active"}><Link href="/contact">Contact</Link></li>   
          {isLoggedIn ? <LiBut><Link  href="/dashboard"><a>{isLoggedIn.fullName}</a></Link></LiBut> : (router.pathname != "/auth/login" && router.pathname != "/auth/signup" && <LiBut><Link href="/auth/login"><a>Account</a></Link></LiBut>)}
          {isLoggedIn && <li onClick={() => {dispatch(logoutSuccess())}}><Button>Logout</Button></li> }         
        </ul>
      </NavSmallScreen>
    </Div>
  );
};

export default Header;
