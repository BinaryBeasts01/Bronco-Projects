import React, {useState} from "react";
import NavBar from "../components/NavBar";
import Projects from "../components/Projects";
import {useLocation} from "react-router-dom";

const Home = () => {
    let location = useLocation();

    const [email, setEmail] = useState(null)
    const [loggedIn, setIsLoggedIn] = useState(false);

    const [searchInput, setSearchInput] = useState(null);

    try {
        if(location.state.searchInput) setSearchInput(location.state.searchInput)
    }
    catch (e) {}

    // if it is load user specific data, get profile pic for navbar, get user recommendations for projects
    return (
        <div style={styles.home}>
            <NavBar email={email} setEmail={setEmail} setSearchInput={setSearchInput} setIsLoggedIn={setIsLoggedIn}/>
            <Projects searchInput={searchInput} email={email}/>
        </div>
    );
}

const styles = {
    home: {
        "fontFamily": "sans-serif",
        "backgroundColor": "black",
        "width": "100%",
        "height": "100%",

    },
}

export default Home