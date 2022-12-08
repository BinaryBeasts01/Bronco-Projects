import React, {useState, useRef} from "react";
import {SearchFilterList, SearchFilterListMap} from "../constants/SearchFilterList";
import {useDetectClickOutside} from "react-detect-click-outside";
import {Button, Container, Form} from "react-bootstrap";

const SearchBar = ({setProjectsSearchInput}) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchFilterItems, setSearchFilterItems] = useState([]);
    const [filterResults, setFilterResults] = useState(null);
    //const [currentFilterIndices, setCurrentFilterIndices] = useState([]); // this is just in case if we want to use up/down arrows to cycle

    const inputRef = useRef('');
    const divRef = useDetectClickOutside({ onTriggered: () => {
            setFilterResults([]);
            //setCurrentFilterIndices([]);
        }});

    //const filterItemsRef = useRef(SearchFilterList.map(() => createRef())); // this is just in case if we want to use up/down arrows to cycle
    const searchInputRef = useRef();

    searchInputRef.current = searchInput;

    const createFilterItem = (item, index, isEnd) => {
        // set  ref={filterItemsRef.current[index]} on span to filter
        return (
        <Container flud
            onClick={() => onSearchItemClick(item)}
            style={isEnd ? styles["dropdown-row-last"] : styles["dropdown-row"]}
            key={item}
        >
            <span tabIndex={0}  onKeyPress={(e) => handleSpanKeyEvent(e, item)} style={styles["filter-text"]}>{item}{SearchFilterListMap[item]}</span>
        </Container>
        );
    }

    const handleSpanKeyEvent = (e, item) => {
        if(e.key === 'Enter') {
            onSearchItemClick(item);
            inputRef.current.focus();
        }
    }

    const onSearchItemClick = (item) => { // assuming user types # and then clicks on item. Ex. user types #create and then clicks on #created-by. So replacing #create with #created-by
        let input = searchInputRef.current;
        let lastPos = input.lastIndexOf("#");
        if(lastPos === -1) {
            let newSearch = searchInput + " " + item;
            setSearchInput(newSearch);
        }
        else {
            let pruneSearch = input.slice(0, lastPos);
            let newSearch = pruneSearch + ' ' + item;
            setSearchInput(newSearch);
        }
        let newSearchFilterItems = searchFilterItems.filter(e => e !== item);
        addFilterItems(newSearchFilterItems);
        setSearchFilterItems(newSearchFilterItems);
    }

    const addFilterItems = (filterItems) => {
        let newFilterResults = [];
        let indices = [];
        for(let filter of SearchFilterList) {
            let index = filterItems.indexOf(filter);
            if(index !== -1) {
                newFilterResults.push(createFilterItem(filter, SearchFilterList.indexOf(filter), index === filterItems.length - 1));
                indices.push(index);
            }
        }
        setFilterResults(newFilterResults);
        //setCurrentFilterIndices(indices);
    }

    const filterSearchItems = (input) => {
        let results = [];
        for(let item of SearchFilterList) {
            if(input === '' || input.indexOf(item) === -1)
                results.push(item);
        }
        setSearchFilterItems(results);
    }

    const initItems = () => {
        if(searchInputRef.current === '') {
            setFilterResults(SearchFilterList.map((item, index, arr) => createFilterItem(item, index, index === arr.length - 1)));
            let indices = [];
            for(let elem of SearchFilterList)
                indices.push(SearchFilterList.indexOf(elem));
            //setCurrentFilterIndices(indices);
            setSearchFilterItems([...SearchFilterList]);
        }
    }

    const handleSearchInputChange = (e) => {
        filterSearchItems(e.target.value);

        const results = searchFilterItems
            .filter(searchItem => {
                let searchTerm = e.target.value.toLowerCase();
                let nSearchItem = searchItem.toLowerCase();

                let pos = searchTerm.lastIndexOf("#");
                if(pos === -1) return true;

                let substr = searchTerm.slice(pos, searchTerm.length);
                for(let item in SearchFilterList) {
                    if(substr.indexOf(item) !== -1 && searchFilterItems.indexOf(item) === -1)
                        return false;
                }

                substr = "";
                for(let c of searchTerm.slice(pos+1, searchTerm.length)) {
                    substr = substr+c;
                    if(!(nSearchItem.slice(1, nSearchItem.length).includes(substr)))
                        return false;
                }
                return true;
            });

        addFilterItems(results);
        setSearchInput(e.target.value);
    }

    // const handleKeyDown = (e) => {
    //     if (e.keyCode === 38) {
    //         setCurrentFilterIndex({
    //             ...currentFilterIndex,
    //             currentFilterIndex: currentFilterIndex + 1 >= filterItemsRef.current.length ? 0 : currentFilterIndex + 1,
    //         });
    //         console.log(currentFilterIndex)
    //     }
    //     else if (e.keyCode === 40) {
    //         setCurrentFilterIndex({
    //             ...currentFilterIndex,
    //             currentFilterIndex: currentFilterIndex - 1 < 0 ? filterItemsRef.current.length - 1 : currentFilterIndex - 1,
    //         });
    //     }
    //     filterItemsRef.current[currentFilterIndex].current.focus();
    // };

    return (
        <Container fluid ref={divRef} style={styles["search-container"]}>
                <Form className={"d-flex"} onSubmit={() => setProjectsSearchInput(searchInput)}>
                    <Form.Control className={"me-2"} type="text" placeholder="Type Your Search Here" value={searchInput} onChange={handleSearchInputChange} onClick={initItems}/>
                    <Button variant={"outline-success"} type="submit" tabIndex={-1}> Search </Button>
                </Form>
            {filterResults && filterResults.length > 0 &&
                <Container style={styles["dropdown"]}>
                    {filterResults}
                </Container>
            }
        </Container>
    );
}

const styles = {
    "search-container": {
        "display": "flex",
        "flexDirection": "column",
    },
    "search-inner": {
        "display": "flex"
    },
    "search-text": {
        "width": "95%"
    },
    "search-button": {
        "width": "5%"
    },
    dropdown: {
        "backgroundColor": "white",
        "display": "flex",
        "flexDirection": "column",
        "border": "1px solid gray",
        "position": "absolute",
        "top": "60px",
        "zIndex": 999,
    },
    "dropdown-row": {
        "cursor": "pointer",
        "textAlign": "start",
        "margin": "2px 0",
        "borderBottom": "1px solid black",
        "zIndex": 999,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word'
    },
    "dropdown-row-last": {
        "cursor": "pointer",
        "textAlign": "start",
        "margin": "2px 0",
        "zIndex": 999,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word'
    },
    "filter-text": {
        wordBreak: "break-all",
        '&:focus': {
            "backgroundColor": "red",
        },
    }
}

// const clickOutsideConfig = {
//     handleClickOutside: () => SearchBar.handleClickOutside,
// };

export default SearchBar;
