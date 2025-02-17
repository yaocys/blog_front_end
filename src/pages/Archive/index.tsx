import React from "react";
import './index.css';

interface ClassificationDescription{
    /**
     * 分类的名称
     */
    title:string;
    /**
     * 分类的描述
     */
    description:string;
}

/**
 * 单个分类卡片模块
 * @constructor
 */
function Classification(props:ClassificationDescription){
    return (
        <div className="col-sm-4 mb-3 mb-sm-0">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{props.title}</h5>
                    <p className="card-text text-muted">{props.description}</p>
                    <a href="#" className="btn btn-outline-primary btn-sm">查看</a>
                </div>
            </div>
        </div>
    )
}

function Archive(){

    const parts:ClassificationDescription[] = [
        {
            title:'刷题笔记',
            description:'来源于 力扣、牛客、ACWind、赛码网 等诸多平台代码编程题目的记录'

        },
        {
            title:'阅读笔记',
            description:'来自阅读书籍的摘抄、总结与读后感'
        },
        {
            title:'八股文',
            description:'面试理论知识点'
        }
    ];

    const a = parts[0];

    return (
        <div className="row">
            <Classification {...parts[0]}/>
            <Classification {...parts[1]}/>
            <Classification {...parts[2]}/>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                    Dropdown button
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Archive;