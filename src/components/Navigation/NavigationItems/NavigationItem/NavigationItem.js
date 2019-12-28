import React from 'react';
import { Link } from 'react-router-dom';

import classes from './NavigationItem.module.css';

const navigationItem = (props) => {
        let linkClasses = props.active ? classes.Active : '';
        return (
        <li className={classes.NavigationItem}>
            <Link className={`${linkClasses}`} to={props.path} >{props.linkText}</Link>
        </li>);
};

export default navigationItem;