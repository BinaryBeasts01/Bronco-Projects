import React, {useState} from "react";
import NavBar from "../components/NavBar";
import AuthForm from "../components/AuthForm";
import AuthService from "../services/AuthService";
import {Button, Card} from "react-bootstrap";
import Projects from "../components/Projects";


const Home = () => {
    const [email, setEmail] = useState(null)

    // if it is load user specific data, get profile pic for navbar, get user recommendations for projects
    return (
        <div style={styles.home}>
            <NavBar email={email} setEmail={setEmail}/>
            <Projects />
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