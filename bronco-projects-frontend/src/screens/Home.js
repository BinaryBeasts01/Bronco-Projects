import React, {useState} from "react";
import NavBar from "../components/NavBar";

const Home = () => {
    const [email, setEmail] = useState(null)

    // if it is load user specific data, get profile pic for navbar, get user recommendations for projects
    return (
        <div style={styles.home}>
            <NavBar email={email} setEmail={setEmail}/>
        </div>
    );
}

const styles = {
    home: {
    "font-family": "sans-serif"
    }
}

export default Home
