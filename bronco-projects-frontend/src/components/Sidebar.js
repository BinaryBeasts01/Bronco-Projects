import React from "react";
import ActionCenter from "./ActionCenter";
import Notifications from "./Notifications";

const Sidebar = () => {
    return (
        <div style={{width: "50%", height: "80%", position: "sticky", top: "0px"}}>
            <Notifications style={{height: "60%"}}/>
            <ActionCenter style={{height: "40%"}}/>
        </div>
    );
}

export default Sidebar;