import React, {useState} from "react";
import NavBar from "../components/NavBar";
import AuthForm from "../components/AuthForm";
import AuthService from "../services/AuthService";

const Home = () => {
    console.log("HERE");
    const [loginFormVisible, setShowLoginForm] = useState(false);
    const [email, setEmail] = useState(null)

    let authService = new AuthService();
    let profile = null //
    if(!authService.checkJWTValid()) {
        profile = <AuthForm email={email} setEmail={setEmail} shouldShowLoginForm={loginFormVisible}
                            closeLoginForm={() => {setShowLoginForm(false)}}/>
    }
    else {
        // init profile with user icon
    }
    // if it is load user specific data, get profile pic for navbar, get user recommendations for projects
    return (
        <div style={styles.home}>
            <NavBar handleLoginClick={() => {setShowLoginForm(true)}} />
            {profile}
        </div>
    );
}

const styles = {
    home: {
    "font-family": "sans-serif"
    }
}

export default Home