import React, {useState} from "react";
import NavBar from "../components/NavBar";
import AuthForm from "../components/AuthForm";
import AuthService from "../services/AuthService";

const Home = () => {
    const [email, setEmail] = useState(null)

    // if it is load user specific data, get profile pic for navbar, get user recommendations for projects
    return (
        <div style={styles.home}>
            <NavBar email={email} setEmail={setEmail}/>
            <div style={styles["test"]}>
                <h2 color={"white"}>PROJECTS</h2>
            </div>
        </div>
    );
}

const styles = {
    home: {
        "fontFamily": "sans-serif",
        "backgroundColor": "black",
        "width": "100%",
        "height": "100%"
    },
    test: {
        "display": "flex",
        "flexDirection": "column",
        "height": "90%",
        "backgroundColor": "green"
    },
    text: {
        "backgroundColor": "white"
    }
}

export default Home