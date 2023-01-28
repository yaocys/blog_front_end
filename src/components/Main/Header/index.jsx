import React from "react";
import './index.css';
import {useLocation} from "react-router-dom";

function Header(props){
    const location = useLocation();
    const {pathname} = location;
    const {navTags}=props;

    let label = null;
    navTags.map((navTag)=>{
        if(pathname===navTag.link) label = navTag.label;
        return navTag;
    })

    if(label===null) return ;

    return (
        <table className="table user-select-none" frame="void" rules="none">
            <tbody>
            <tr>
                <td className="border-bottom border-danger-subtle fs-5 fw-bolder border-2">
                    {label}
                </td>
            </tr>
            </tbody>
        </table>
    )
}

export default Header;