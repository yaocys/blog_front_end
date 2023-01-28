import React from "react";
import './index.css';

function ResourceLink(){
    return (
        <div className="list-group">

            <a href="https://www.dandanzan10.top/" className="list-group-item list-group-item-action list-group-item-secondary">
                电影、电视剧、动漫
            </a>
            <a href="https://www.hifini.com/" className="list-group-item list-group-item-action list-group-item-warning">
                歌曲
            </a>
            <a href="https://learn.lianglianglee.com/" className="list-group-item list-group-item-action list-group-item-secondary">
                极客专栏
            </a>
        </div>
    )
}

export default ResourceLink;