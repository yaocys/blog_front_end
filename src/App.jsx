import React, {useState} from "react";
import SideBar from "./components/SideBar";
import Main from "./components/Main";
import './App.css';
import {GlobalScrollbar} from 'mac-scrollbar';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import NavBar from "./pages/NavBar";

function App() {

    const navTags = [
        {id: 0, label: "随笔", link: "/essay"},
        {id: 1, label: "文章", link: "/article"},
        {id: 2, label: "相册", link: "/album"},
        {id: 3, label: "归档", link: "/archive"},
        {id: 4, label: "标签", link: "/label"},
        {id: 5, label: "关于", link: "/about"},
        {id: 6, label: "链接", link: "/link"},
        {id: 7, label: "后台", link: "/backstage"}
    ]

    return (
        <>
            <NavBar navTags={navTags}/>
            <div id="container" className="container row">
                <SideBar navTags={navTags}/>
                <Main navTags={navTags}/>
                {/*<GlobalScrollbar/>*/}
            </div>
        </>
    )
}

export default App;
