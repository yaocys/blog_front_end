import React, {useState} from "react";
import SideBar from "./components/SideBar";
import Main from "./components/Main";
import './App.css';
import {GlobalScrollbar} from 'mac-scrollbar';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import NavBar from "./pages/NavBar";
import {OutlineContext} from "./context/OutlineContext";
import {useAuth} from "./hooks/useAuth";

function App() {

    const isAuth = useAuth();

    const baseNavTags = [
        {id: 0, label: "随笔", link: "/essay"},
        {id: 1, label: "归档", link: "/archive"},
        {id: 2, label: "关于", link: "/about"},
        {id: 3, label: "链接", link: "/link"},
    ];
    const navTags = isAuth === true
        ? [...baseNavTags, {id: 4, label: "后台", link: "/backstage"}]
        : baseNavTags;

    const [outline, setOutline] = useState([]);

    return (
        <OutlineContext.Provider value={{ outline, setOutline }}>
            <NavBar navTags={navTags}/>
            <div id="container" className="container row">
                <SideBar navTags={navTags} outline={outline}/>
                <Main navTags={navTags}/>
                {/*<GlobalScrollbar/>*/}
            </div>
        </OutlineContext.Provider>
    )
}

export default App;
