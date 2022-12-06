import React, {useState, useEffect} from 'react';
import NotificationsService from "../services/NotificationsService";
import NotificationModal from "./NotificationModal";
import "../css/Notifications.css";

const Notifications = ({}) => {
    const [notifications, setNotifications] = useState([]);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        console.log("INSIDE EFFECT")
        const fetchNotifications = async () => {
           let data = await NotificationsService.getNotifications();
           setNotifications(data);
       }
       fetchNotifications()
    }, []);

    const clearNotifications = async (eveOfClearLogs) => {
        eveOfClearLogs.stopPropagation();
        eveOfClearLogs.preventDefault();

        setNotifications([]);
        await NotificationsService.deleteNotifications();
    }

    const openNotificationModal = (notification) => {
        console.log("INSIDE OPEN NOTIFICATION")
        setSelectedNotification(notification);
        setShowNotificationModal(true);
    }

    let notificationModal = <NotificationModal notification={selectedNotification} showNotification={showNotificationModal} closeNotification={() => setShowNotificationModal(false)}/>

    return (
        <div id="event-log-container">
            <div id="event-log-header">
                <button id="event-log-clear-btn" onClick={clearNotifications}>
                    {"Clear"}
                </button>
                <span id="event-log-title"> {"Notifications"} </span>
                <div id="event-log-notifications" style={{backgroundColor: "#afd2c0"}}>
                    {notifications.length}
                </div>
            </div>
            <div id="event-log-content">
                    <pre id="event-log-msg-container">
                        {
                            notifications.map((notificationData, logKey) => {

                                return (
                                    <div key={logKey} id="event-log-msg-text"
                                         onClick={() => openNotificationModal(notificationData)}>
                                        {notificationData["message"]}
                                        <hr className="event-log-msg-separator"/>
                                    </div>)
                            })
                        }
                    </pre>
                {notificationModal}
            </div>
        </div>
    );
}

export default Notifications;