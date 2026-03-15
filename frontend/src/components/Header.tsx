import { Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import React from "react";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";

const Header = () => { 
    const auth=useAuth();
    return ( <AppBar sx={{bgcolor:"transparent",position:"static",boxShadow:"none"}}>
        <Toolbar sx={{display:"flex"}}>
            <Logo/>
            <div>{auth?.isLoggedIn ? (
            <>
            <NavigationLink bg="#00fffc" to="/chat" text="Go To Chat" textColor="black" />
            <NavigationLink bg="#51528f" to="/" text="Logout" textColor="#fff" onClick={auth.logout} /> 
             </>) 
             : (<>
              <NavigationLink bg="#00fffc" to="/login" text="Login" textColor="black" />
            <NavigationLink bg="#51528f" to="/signup" text="Sign Up" textColor="#fff"  /> 
             </> )}</div>
        </Toolbar>
         </AppBar>
         );
        }

export default Header;