import React from "react";
import ActionCenter from "./ActionCenter";
import Notifications from "./Notifications";

const Sidebar = ({email}) => {
    return (
        <div style={{width: "100%", height: "80%", position: "sticky", top: "0px"}}>
            <ActionCenter email={email} style={{height: "10%"}}/>
            <Notifications style={{height: "40%"}}/>
        </div>
    );
}

export default Sidebar;