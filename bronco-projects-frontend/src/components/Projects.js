import React, {useState, useEffect} from 'react';
import {Card} from "react-bootstrap";
import useInfiniteScroll from "react-easy-infinite-scroll-hook";
import ProjectsService from "../services/ProjectsService";
import {SearchFilterList} from "../constants/SearchFilterList";

const Projects = ({searchInput}) => {

    const [projects, setProjects] = useState([]); // Note: some bugs, if initial data is too low, scroll bar won't appear
    const [loadPage, setLoadPage] = useState(null);
    const [totalPages, setTotalPages] = useState(null);
    const [currentSize, setCurrentSize] = useState(0);

    const createSearchInputData = () => {
        if (!searchInput) return null;

        let searchData = {};
        let inputs = searchInput.split("#");

        for(let filter of SearchFilterList) {
            for(let input of inputs) {
                input = "#" + input;
                if(input.includes(filter)) {
                    let difference = input.replace(filter, "");
                    let dataKey = filter.replace("#", "").replace(":", "");
                    difference = difference.trim();
                    let result = difference;
                    if(filter === "#tags:") {
                        result = [];
                        difference.split(',').forEach((elem) => result.push(elem.trim()));
                    }
                    searchData[dataKey] = result;
                    break;
                }
            }
        }

        return searchData;
    }

    useEffect(() => {
        console.log(JSON.stringify(createSearchInputData()));

        const fetchInitial = async () => {
            let page = await ProjectsService.getProjectsPage(1);

            console.log(`FIRST LOAD ${page}`);

            setTotalPages(page["totalPages"]);
            setCurrentSize(page["projects"].length);
            setProjects(page["projects"]);
            setLoadPage(2);
        }

        fetchInitial();
    }, [searchInput]); // depends on nothing so this is called after the first render

    const next = async (direction) => {
        if(loadPage <= totalPages) {
            console.log("HERE")

            let data = await ProjectsService.getProjectsPage(loadPage);
            console.log(`Data ${data}`);
            let page = data["projects"];

            setProjects((prev) =>
                direction === "up" ? [...page, ...prev] : [...prev, ...page] // direction === "up" ? [...page, ...prev] if in future we want to control what we load above
            );
            setCurrentSize(prev => prev + page.length);
            console.log(`LOADED: ${direction} ${loadPage}`)
            if (direction === "down") setLoadPage(loadPage + 1);
        }
    };

    const ref = useInfiniteScroll({
        next: next,
        rowCount: currentSize,
        hasMore: { down: true },
        scrollThreshold: .2
    });

    let projectCards = [];
    projectCards = projects.map((proj, index) => {
        return (
                <Card key={index} style={{"width": "40%", "height": "30%", backgroundColor: "green"}}>

                    <Card.Body>
                        <Card.Title>{proj["name"]}</Card.Title>
                        <Card.Text>
                            {proj["description"]}
                        </Card.Text>
                    </Card.Body>
                </Card>
        );
    });

    //const loader = <div className="loader">Loading ...</div>;

    return (
        <div style={styles["projects-parent"]}>
            <div style={styles["padding"]}/>

            <div style={styles["projects"]}>
                <div ref={ref} style={{backgroundColor: "purple", width: "100%", height: "100%", overflowY: "scroll"}}>
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
        "width": "55%",
        "height": "100%",
        "backgroundColor": "blue",
    },
    padding: {
        "display": "flex",
        "width": "45%",
        "backgroundColor": "red",
        "height": "100%"
    },
}
export default Projects;