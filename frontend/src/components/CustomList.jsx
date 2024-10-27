import React from 'react';
import { Link } from 'react-router-dom';
import './css/CustomList.css';

const CustomList = ({ items, isLink = false, baseLink = ""}) => {
    return (
        <ul className="custom-list">
            {items.map((item, index) => (
                <li key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                    {isLink ? (
                        <Link to={`${baseLink}/${item}`} className="custom-link">{item}</Link>
                    ) : (
                        item
                    )}
                </li>
            ))}
        </ul>
    );
}

export default CustomList;
