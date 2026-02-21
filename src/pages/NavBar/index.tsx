import React from "react";
import './index.css';
import icon from './icon.png';
import {Link, NavLink} from "react-router-dom";

function NavBar(props: { navTags: Array<any>; }){
    const {navTags} = props;

    const closeNavbar = () => {
        const el = document.getElementById('navbarSupportedContent');
        if (el) {
            const collapse = (window as any).bootstrap?.Collapse?.getInstance(el);
            collapse?.hide();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top" id="navbar">
            <div className="container-md">

                <div className="navbar-brand">
                    <img src={icon} alt="" width="35" height="35"
                         className="d-inline-block align-top user-select-none"/>&nbsp;
                    <Link className="text-black" to="/essay">ChengYuan</Link>
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        {
                            navTags.map((navTag) => {
                                return (
                                    <li className="nav-item" key={navTag.id}>
                                        <NavLink className="nav-link" to={navTag.link} onClick={closeNavbar}>{navTag.label}</NavLink>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search for"
                               aria-label="Search"/>
                        <button className="btn btn-sm btn-outline-dark" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;