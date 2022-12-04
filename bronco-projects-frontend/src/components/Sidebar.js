import React from "react";
import ActionCenter from "./ActionCenter";
import Notifications from "./Notifications";

const Sidebar = ({email}) => {
    return (
        <div style={{width: "100%", height: "80%", position: "sticky", top: "0px"}}>
            <Notifications style={{height: "60%"}}/>
            <ActionCenter email={email} style={{height: "40%"}}/>
        </div>
    );
}

export default Sidebar;