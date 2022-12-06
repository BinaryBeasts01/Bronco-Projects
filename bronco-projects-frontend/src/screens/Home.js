import React, {useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import Projects from "../components/Projects";
import {useLocation} from "react-router-dom";

const Home = () => {
    let location = useLocation();

    const [email, setEmail] = useState(null)
    const [loggedIn, setIsLoggedIn] = useState(false);

    const [searchInput, setSearchInput] = useState(null);

    useEffect(() => {
        if(location.state && "searchInput" in location.state) {
            let value = location.state.searchInput;
            setSearchInput(value);
            window.history.replaceState({}, document.title)
        } // this useEffect is only called once at the beginning equivalent to componentDidMount
    }, []);


    // if it is load user specific data, get profile pic for navbar, get user recommendations for projects
    return (
        <div style={styles.home}>
            <NavBar isLoggedIn={loggedIn} email={email} setEmail={setEmail} setSearchInput={setSearchInput} setIsLoggedIn={setIsLoggedIn} />
            <Projects searchInput={searchInput} isLoggedIn={loggedIn} />
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