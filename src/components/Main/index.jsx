import React from "react";
import './index.css'
import Header from "./Header";
import Footer from "./Footer";
import {useRoutes} from "react-router-dom";
import routes from "../../routes";

function Main(props) {
    const routingTable = useRoutes(routes);
    const {navTags} = props;
    return (
        <div id="main" className="col-10">
            <Header navTags={navTags}/>
            <div id="content">
                {routingTable}
            </div>
            <Footer/>
        </div>
    )
}

export default Main;