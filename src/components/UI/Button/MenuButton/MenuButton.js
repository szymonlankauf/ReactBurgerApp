import React from 'react';

import classes from './MenuButton.module.css';

const menuButton = (props) => {
    return (
        <div onClick={props.clicked} className={classes.MenuButton}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default menuButton