import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import './index.css'
import {Link, Outlet} from "react-router-dom";
import moment from "moment";

function Item(props) {
    const [mouseHover, setMouseHover] = useState(false);
    let {essay} = props;

    return (
        <tr key={essay.id} onMouseEnter={() => setMouseHover(true)} onMouseLeave={() => setMouseHover(false)}>
            <td style={{textAlign: "center"}}>
                {
                    essay.showDate && moment(essay.createTime).format("YYYY-MM-DD")
                }
            </td>
            <td>
                <Link to={`${moment(essay.createTime).format("YYYY/MM")}/${essay.id}`}>{essay.title}</Link>
            </td>
            <td style={{textAlign: "right", width: "120px"}}>
                <div style={{display: mouseHover ? '' : 'none'}}>
                    <Link to="/backstage" className="text-info" style={{margin: "0 1em"}}>编辑</Link>
                    <Link to="/backstage" className="text-danger">删除</Link>
                </div>
            </td>
        </tr>
    )
}

function TimeLine() {
    const [essayList, setEssayList] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/api1/essay/listAll').then(
            response => {
                setEssayList(response.data);
            },
            error => {
                console.log('请求失败', error);
            }
        )
    }, []);

    // moment("20130101", "YYYYMMDD").fromNow();  //5 years ago

    /**
     * 实现对文章列表的按天聚合（同一天的就不显示日期了）
     */
    let date = '';
    const newEssayList = essayList && essayList.map((essay) => {
        const createTime = moment(essay.createTime).format("YYYY-MM-DD");
        if (date !== createTime) {
            date = createTime;
            return {...essay, showDate: true};
        }
        return {...essay, showDate: false};
    })

    return (
        <table className="table" frame="void" rules="none">
            <tbody>
            {
                newEssayList && newEssayList.map((essay) => {
                    return (
                        <Item key={essay.id} essay={essay}/>
                    )
                })
            }
            </tbody>
        </table>
    )
}

export default TimeLine;