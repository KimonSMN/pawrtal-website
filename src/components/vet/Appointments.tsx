import { useState } from "react";
import styles from "./page.module.css";

function Appointments() {
    // Api request to get users data
    //
    const [schedule, setSchedule] = useState([]);

    return (
        <div className={styles.Appointments}>
            <h1> Ta rantevou</h1>
        </div>
    );
}

export default Appointments;
