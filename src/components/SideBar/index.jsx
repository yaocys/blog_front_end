import React from "react";
import './index.css';
import {NavLink} from "react-router-dom";

function SideBar({ navTags, outline }) {
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

            {outline.length > 0 && (
                <nav id="side-outline" className="nav flex-column align-items-end mt-3">
                    {outline.map((item, i) => (
                        <a key={i} href={`#${item.id}`} className="nav-link py-0"
                           style={{ paddingRight: `${(item.level - 1) * 0.6}rem` }}>
                            {item.text}
                        </a>
                    ))}
                </nav>
            )}
        </div>
    )
}

export default SideBar;