import Image from "next/image";
import Page from './(Pages)/page'
// import { AuthProvider  } from "./contexts/AuthContext";
import NavBar from "./Components/NavBar/NavBar";
export default function Home() {
  return (
    
   <div>
    <div className="fixed top-0 left-0 right-0 z-50">
         <NavBar />
        </div>
    <Page/>
   </div>
  );
}
