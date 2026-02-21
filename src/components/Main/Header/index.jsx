import React from "react";
import './index.css';
import {Link, useLocation, useSearchParams} from "react-router-dom";

function Header(props){
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const {pathname} = location;
    const {navTags}=props;

    const tagId = searchParams.get('tag');
    const tagName = searchParams.get('tagName');
    const tagColor = searchParams.get('tagColor') || 'primary';

    let label = null;
    navTags.map((navTag)=>{
        if(pathname===navTag.link) label = navTag.label;
        return navTag;
    })

    if(label===null) return null;

    return (
        <table className="table user-select-none" frame="void" rules="none">
            <tbody>
            <tr>
                <td className="border-bottom border-danger-subtle fs-5 fw-bolder border-2">
                    {tagId && pathname === '/essay'
                        ? <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link to="/essay" style={{textDecoration: 'none', color: 'inherit'}}>随笔</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                <span className={`badge bg-${tagColor}-subtle`} style={{color: '#2d3436', fontWeight: 'normal'}}>
                                    {tagName || '标签筛选'}
                                </span>
                            </li>
                        </ol>
                        : label
                    }
                </td>
            </tr>
            </tbody>
        </table>
    )
}

export default Header;