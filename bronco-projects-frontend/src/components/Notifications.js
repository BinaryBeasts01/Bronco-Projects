import React, {useState, useEffect} from 'react';
import {EventLogList} from "./EventLogList";

const Notifications = ({}) => {
    const [notifications, setNotifications] = useState([]);
    const notificationTestTemplate = "This is a long notification. Lorem ipsum random text. random text. random text. Really long notification. random text. random text. random text. random text.";

    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log("here");
            setNotifications(prev => [...prev, notificationTestTemplate + ` ${prev.length+1}`]);
        }, 2000)

        return () => clearInterval(intervalId);
    });

    let notificationsList = notifications;

    return (
        <EventLogList
            title={"Notifications"}
            logs={notificationsList}
            clearBtnText={"Clear"}
        />
    );
}

export default Notifications;
