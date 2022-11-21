import React, {useState} from "react";
import NavBar from "../components/NavBar";
import Projects from "../components/Projects";
import API_URL from "../constants/API_URL";

const Home = () => {
    const [email, setEmail] = useState(null)
    const [loggedIn, setIsLoggedIn] = useState(false);

    const [searchInput, setSearchInput] = useState(null);

    // if it is load user specific data, get profile pic for navbar, get user recommendations for projects
    return (
        <div style={styles.home}>
            <NavBar email={email} setEmail={setEmail} setSearchInput={setSearchInput}/>
            <Projects searchInput={searchInput}/>
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