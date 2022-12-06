import React, {useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import Project from "../components/Project";
import {useNavigate, useParams} from "react-router-dom";

const ProjectScreen = () => {
    const [email, setEmail] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [searchInput, setSearchInput] = useState('');

    const { id } = useParams()

    let navigate = useNavigate();

    useEffect(() => {
        if(searchInput !== '') {
            console.log("HERE")
            navigate("/", {state: {searchInput: searchInput}});
        }
    }, [searchInput]);

    return (
        <div style={styles.home}>
            <NavBar isLoggedIn={isLoggedIn} email={email} setEmail={setEmail} setIsLoggedIn={setIsLoggedIn} setSearchInput={setSearchInput}/>
            <Project projectID={id} isLoggedIn={isLoggedIn}/>
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
}

export default ProjectScreen