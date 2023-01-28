import React from "react";
import './index.css';
import {NavLink, Outlet, useLocation} from "react-router-dom";

function Link() {
    const location = useLocation();
    const {pathname} = location;
    return (
        <div className="card text-center">
            <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <NavLink className={`nav-link ${pathname === '/link' ? 'active' : ''}`}
                                 to="clipboard">剪贴板</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="resource">资源站</NavLink>
                    </li>
                </ul>
            </div>
            <div className="card-body">
                <Outlet/>
            </div>
        </div>
    )
}

export default Link;