import React from "react";
import './index.css';
import {NavLink} from "react-router-dom";

function SideBar(props) {
    const {navTags} = props;
    return (
        <div id="side-bar" className="col-2">
            <nav className="nav flex-column align-items-end">
                <NavLink className="nav-link text-black fw-bolder user-select-none fs-4" to="/">ChengYuan</NavLink>
                {
                    navTags.map((navTag) => {
                        return (
                            <NavLink key={navTag.id} className="nav-link user-select-none nav-tag" to={navTag.link}>
                                <i>{navTag.label}</i>
                            </NavLink>
                        )
                    })
                }
            </nav>
        </div>
    )
}

export default SideBar;