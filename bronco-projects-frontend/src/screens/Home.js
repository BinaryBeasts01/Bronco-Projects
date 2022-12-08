import React, {useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import Projects from "../components/Projects";
import {useLocation} from "react-router-dom";
import {Container, Row} from "react-bootstrap";

const Home = () => {
    let location = useLocation();

    const [email, setEmail] = useState(null)
    const [loggedIn, setIsLoggedIn] = useState(false);

    const [searchInput, setSearchInput] = useState(location.state && "searchInput" in location.state ? location.state.searchInput : null);

    useEffect(() => {
        if(location.state && "searchInput" in location.state) {
            console.log("INSIDE HOME FOR SEARCH")
            let value = location.state.searchInput;
            setSearchInput(value);
            window.history.replaceState(null, document.title)
        } // this useEffect is only called once at the beginning equivalent to componentDidMount
    }, []);


    // if it is load user specific data, get profile pic for navbar, get user recommendations for projects
    return (
        <Container fluid style={styles.home}>
            <Row sm={12} md={12} lg={12} xxl={12} style={{height: "10%"}}>
                <NavBar isLoggedIn={loggedIn} email={email} setEmail={setEmail} setSearchInput={setSearchInput}
                        setIsLoggedIn={setIsLoggedIn}/>
            </Row>

            <Row sm={12} md={12} lg={12} xxl={12} style={{height: "90%"}}>
                <Projects searchInput={searchInput} isLoggedIn={loggedIn}/>
            </Row>
        </Container>
    );
}

const styles = {
    home: {
        "fontFamily": "sans-serif",
        "backgroundColor": "black",
        height: "100%"
    },
}

export default Home