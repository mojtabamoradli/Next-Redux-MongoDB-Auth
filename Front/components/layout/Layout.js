import Footer from "./Footer";
import dynamic from "next/dynamic"

const Header = dynamic(() => import ("./Header"), {ssr: false}) // This resolve hydration problem

export default function Layout({ children }) {
  return (
    <div>
      <main>
        <Header />
        {children}
        <Footer />
      </main>
    </div>
  );
}
