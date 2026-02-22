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
        if(pathname === navTag.link || pathname.startsWith(navTag.link + '/')) label = navTag.label;
        return navTag;
    })

    if(label===null) return null;

    return (
        <div className="user-select-none fs-5 fw-bolder mb-2"
             style={{borderBottom: '2px solid #f1aeb5', paddingBottom: '0.3em'}}>
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
        </div>
    )
}

export default Header;