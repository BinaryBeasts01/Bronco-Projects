import React, {useEffect, useState} from 'react';
import {Card, Col, Container, Row} from "react-bootstrap";
import useInfiniteScroll from "react-easy-infinite-scroll-hook";
import ProjectsService from "../services/ProjectsService";
import {SearchFilterList} from "../constants/SearchFilterList";
import getDominantColor from "../services/Colors";
import rgbHex from 'rgb-hex';
import hexRGB from 'hex-rgb';
import {contrastColor} from 'contrast-color';
import "../css/ProjectCard.css";

import Sidebar from "./Sidebar";
import {useNavigate} from "react-router-dom"; // this is just for testing


const Projects = ({searchInput, isLoggedIn}) => {

    const [projects, setProjects] = useState({"projects": [], "textColors": []}); // Note: some bugs, if initial data is too low, scroll bar won't appear
    const [loadPage, setLoadPage] = useState(null);
    const [totalPages, setTotalPages] = useState(null);
    const [currentSize, setCurrentSize] = useState(0);

    let navigate = useNavigate();

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

    const fetchPage = async (pageNum) => {
        let data = createSearchInputData();
        console.log(data)
        let page;
        if (!data) page = await ProjectsService.getProjectsPage(pageNum);
        else page = await ProjectsService.getSearchProjects(data, pageNum);

        return page;
    }

    const calculateColors = async (projects) => {
        return await Promise.all(projects.map(async (proj, index) => {
            let value = await getDominantColor(proj["image"], proj["extension"]);

            let hex = rgbHex(value[0], value[1], value[2]);

            let color = contrastColor({bgColor:`#${hex}`});
            return hexRGB(color, {format: 'array'});
        }));
    }

    useEffect(() => {
        const fetchInitial = async () => {
            let page = await fetchPage(0);
            console.log(`FIRST LOAD`);
            console.log(page)
            let colors = await calculateColors(page["projects"]);
            console.log(colors);

            setTotalPages(page["totalPages"]);
            setCurrentSize(page["projects"].length);
            setProjects({"projects": page["projects"], "textColors": colors});
            setLoadPage(1);
        }
        console.log(`SEARCH INPUT ${searchInput}`)
        fetchInitial();
    }, [searchInput]); // depends on searchInput so called everytime searchInput changes

    const next = async (direction) => {
        if(loadPage <= totalPages) {
            console.log("HERE")

            let data = await fetchPage(loadPage);
            let colors = await calculateColors(data["projects"])

            console.log(`Data ${data} ${colors}`);
            let page = data["projects"];

            setCurrentSize(prev => prev + page.length);
            console.log(`LOADED: ${direction} ${loadPage}`)
            if (direction === "down") setLoadPage(loadPage + 1);
            setProjects(prev =>
                direction === "up" ? {"projects": [...page, ...prev["projects"]], "textColors": [...colors, ...prev["textColors"]]} :
                                        {"projects": [...prev["projects"], ...page], "textColors": [...prev["textColors"], ...colors]} // direction === "up" ? [...page, ...prev] if in future we want to control what we load above
            );
        }
    };

    const ref = useInfiniteScroll({
        next: next,
        rowCount: currentSize,
        hasMore: { down: true },
        scrollThreshold: .2
    });

    const openProjectPage = (projectId) => {
        navigate(`/projects/${projectId}`);
    }

    let projectCards;
    let projectsLen = projects["projects"].length
    projectCards = projects["projects"].map((proj, index) => {
        let color = projects["textColors"][index];
        let textColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

        let sliceMax = proj["tags"].length < 3 ? proj["tags"].length : 3;
        let tags = "";
        proj["tags"].slice(0, sliceMax).forEach((value, index) => {
            if(index < sliceMax - 1) tags += `${value},`;
            else tags += value;
    });

        let middot = `\u00B7`;

        return (
            <Row style={styles["project-card-parent"]}>
                <Card key={index} style={{width: "100%", height: "100%"}} className={"project-card"} onClick={() => openProjectPage(proj["uuid"])}>
                    <Card.Img style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px)"}} src={`data:image/${proj["extension"]};base64, ${proj["image"]}`} alt="Card image" />
                    <Card.ImgOverlay style={{opacity: 1}}>
                        <Card.Title style={{color: textColor, fontSize: "1em"}}>{proj["name"]}</Card.Title>
                        <Card.Subtitle style={{color: textColor, fontSize: ".75em"}}>{`${proj["createdBy"]} ${middot} ${proj["department"]} ${middot} ${tags}`} </Card.Subtitle>
                        <br/>
                        <Card.Text className={"project-card-text"} style={{color: textColor, fontSize: "1em"}}>
                            {proj["description"]}
                        </Card.Text>
                    </Card.ImgOverlay>
                </Card>
            </Row>
        );
    });

    //const loader = <div className="loader">Loading ...</div>;
    // react bootstrap 12 col per row
    return (
        <Container fluid style={styles["projects-parent"]}>
                <Row ref={ref} md={12} className="justify-content-md-center" style={{overflowY: "scroll", width: "100%", height: "100%"}}>
                    <Col style={{height: "100%"}} md={4}>
                        {projectCards}
                    </Col>
                    <Col md={{ span: 2, offset: 1 }}>
                        {isLoggedIn ? <Sidebar style={{height: "80%"}}/> : null}
                    </Col>
                </Row>
        </Container>
    );
}

const styles = {
    "projects-parent": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        height: "100%",
        position: "relative",
        zIndex: 1,
        "backgroundColor": "rgb(3,3,3)",
    },

    padding: {
        "display": "flex",
        "width": "40%",
        "backgroundColor": "rgb(3,3,3)",
        "height": "100%"
    },
    "project-card-parent": {
        height: "50%",
        paddingBottom: "10%"
    },
    "project-card-padding": {
        height: "5%",
    },
}
export default Projects;
