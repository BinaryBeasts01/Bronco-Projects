import React, {useState} from 'react';
import {Card, Container} from "react-bootstrap";
import useInfiniteScroll from "react-easy-infinite-scroll-hook";
import SampleProjects from "../constants/SampleProjects";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [prevLoadPage, setPrevLoadPage] = useState(0);

    const next = async (direction) => {
        let loadPage;
        if(direction === "down") loadPage = prevLoadPage + 1;
        //else loadPage = prevLoadPage - 1;

        if(loadPage >= 1 && loadPage <= 4) {
            let page;
            for (let pg of SampleProjects) {
                if (pg["page"] === loadPage) {
                    page = pg["projects"];
                    break;
                }
            }

            setProjects((prev) =>
                [...prev, ...page] // direction === "up" ? [...page, ...prev] if in future we want to control what we load above
            );
            console.log(`LOADED: ${direction} ${loadPage}`)
            setPrevLoadPage(loadPage);
        }
    };

    const ref = useInfiniteScroll({
        next,
        rowCount: projects.length,
        hasMore: { down: prevLoadPage !== 4 }, // up: prevLoadPage !== 0
    });

    let projectCards = [];
    projects.map((proj, index) => {
        projectCards.push(
            <div key={index} style={{"height": "20%"}}>
                <Card>
                    <Card.Body>
                        <Card.Title>{proj["projectId"]}</Card.Title>
                        <Card.Text>
                            {proj["description"]}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        );
    });

    const loader = <div className="loader">Loading ...</div>;

    return (
        <div style={styles["projects-parent"]}>
            <Container style={styles["padding"]}/>

            <Container style={styles["projects"]}>
                <div ref={ref} style={{overflowY: "auto"}}>
                    {projectCards}
                </div>
            </Container>

            <Container style={styles["padding"]} />
        </div>
    );
}

const styles = {
    "projects-parent": {
        "display": "flex",
        "flexDirection": "column",
        "height": "90%",
        "backgroundColor": "green"
    },
    projects: {
        "display": "flex",
        "width": "20%",

    },
    padding: {
        "display": "flex",
        "width": "20%"
    }
}
export default Projects;