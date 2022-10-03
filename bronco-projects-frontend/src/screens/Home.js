import React, {useState} from "react";
import NavBar from "../components/NavBar";
import LoginForm from "../components/LoginForm";

const Home = () => {
    const [loginFormVisible, setShowLoginForm] = useState(false);

    const showLoginForm = () => setShowLoginForm(true);

    const hideLoginForm = () => setShowLoginForm(false); // pass into login form so that user can exit sign form

    return (
        <div style={styles.home}>
            <NavBar handleLoginClick={showLoginForm} />
            <LoginForm shouldShowLoginForm={loginFormVisible} closeLoginForm={hideLoginForm} />
        </div>
    );
}

const styles = {
    home: {
    "font-family": "sans-serif"
    }
}

export default Home