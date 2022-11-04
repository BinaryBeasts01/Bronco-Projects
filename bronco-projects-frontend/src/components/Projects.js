import React, {useState} from 'react';
import {Card, Container} from "react-bootstrap";
import useInfiniteScroll from "react-easy-infinite-scroll-hook";
import SampleProjects from "../constants/SampleProjects";

const Projects = () => {
    const [projects, setProjects] = useState(SampleProjects[0]["projects"]); // Note: some bugs, if initial data is too low, scroll bar won't appear

    const [loadPage, setLoadPage] = useState(1);

    const next = (direction) => {
        if(loadPage < 5) {
            console.log("HERE")

            let page = SampleProjects[loadPage]["projects"];
            setProjects((prev) =>
                direction === "up" ? [...page, ...prev] : [...prev, ...page] // direction === "up" ? [...page, ...prev] if in future we want to control what we load above
            );
            console.log(`LOADED: ${direction} ${loadPage}`)
            if (direction == "down") setLoadPage(loadPage + 1);
        }
    };

    const ref = useInfiniteScroll({
        next: next,
        rowCount: projects.length,
        hasMore: { down: true },
        scrollThreshold: .2
    });

    let projectCards = [];
    projects.map((proj, index) => {
        projectCards.push(
                <Card key={index} style={{"width": "40%", "height": "30%", backgroundColor: "green"}}>
                    <Card.Body>
                        <Card.Title>{proj["projectId"]}</Card.Title>
                        <Card.Text>
                            {proj["description"]}
                        </Card.Text>
                    </Card.Body>
                </Card>
        );
    });

    const loader = <div className="loader">Loading ...</div>;

    return (
        <div style={styles["projects-parent"]}>
            <div style={styles["padding"]}/>

            <div style={styles["projects"]}>
                <div style={styles["padding2"]}/>
                <div ref={ref} style={{backgroundColor: "purple", width: "80%", height: "100%", overflowY: "scroll"}}>
                    {projectCards}
                </div>

            </div>

        </div>
    );
}

const styles = {
    "projects-parent": {
        "display": "flex",
        "flexDirection": "row",
        "height": "90%",
        "backgroundColor": "green"
    },
    projects: {
        "display": "flex",
        "flexDirection": "row",
        "width": "75%",
        "height": "100%",
        "backgroundColor": "blue",
    },
    padding: {
        "display": "flex",
        "width": "25%",
        "backgroundColor": "red",
        "height": "100%"
    },
    padding2: {
        "display": "flex",
        "width": "20%",
        "backgroundColor": "yellow",
        "height": "100%"
    }
}
export default Projects;