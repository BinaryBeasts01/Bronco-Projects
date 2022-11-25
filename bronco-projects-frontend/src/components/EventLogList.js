// The majority of this code was provided by Ibraheem Z. Abu-Kaff. https://github.com/ibraAbuKaff/react-event-list

import React from "react";
import "../css/EventLogList.css";

class EventLogList extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.logs)
        this.state = {
            logs: props.logs || [], // logs will be list of notification objects dictionaries. [{notificationId: 1, from: Bob, date: date, title: "title", message: "message"}, {}, {}, {}]
            title: props.title || "Event Log",
            clearBtnText: props.clearBtnText || "Clear",

        };
        this.clearLogs = this.clearLogs.bind(this);
    }

    componentWillReceiveProps(nextProps, _) { // added by Viswadeep: when the state of the notifications list changes, the child component i.e EventLogList is not updated
                                                            // because the log list is only set from the initial props or an empty list.
        this.setState({ logs: nextProps.logs });
    }

    clearLogs = (eveOfClearLogs) => {

        eveOfClearLogs.stopPropagation();
        eveOfClearLogs.preventDefault();

        // delete notifications from backend
        this.setState({
            logs: [],
        });

    };
    // open popup and pass it notification dictionary on line 57
    // can modify what's inside div on line 57 to make it a card that displays a title, from, and truncated message.
    render = () => {
        return (
            <div id="event-log-container">
                <div id="event-log-header">
                    <button id="event-log-clear-btn" onClick={this.clearLogs}>
                        {this.state.clearBtnText}
                    </button>
                    <span id="event-log-title"> {this.state.title} </span>
                    <div id="event-log-notifications" style={{backgroundColor: "#afd2c0"}}>
                        {this.state.logs.length }
                    </div>
                </div>
                <div id="event-log-content">
                    <pre id="event-log-msg-container">
                        {
                            this.state.logs.map((logText, logKey) => {

                                return (
                                    <div key={logKey} id="event-log-msg-text" onClick={() => console.log("clicked")}>
                                        {logText}
                                        <hr className="event-log-msg-separator"/>
                                    </div>)

                            })
                        }
                    </pre>
                </div>
            </div>

        );


    }

}

export {EventLogList};