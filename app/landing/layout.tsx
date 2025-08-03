import { ReactNode } from "react";
import Header from "./header";
import { Footer } from "./footer";

export default function LandingLayout({children} : {
  children : ReactNode
}){
  return (
    <div className="min-h-screen  bg-white dark:bg-black text-black dark:text-white transition-all duration-300">
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
}