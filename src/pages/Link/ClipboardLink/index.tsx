import React from "react";
import './index.css';

function ClipboardLink(){
    return (
        <div className="list-group">

            <a href="https://www.cnblogs.com/yaocy/" className="list-group-item list-group-item-action list-group-item-secondary">
                #刷题笔记#
            </a>
            <a href="https://yaos.cc/community" className="list-group-item list-group-item-action list-group-item-warning">
                #Web社区论坛-项目演示#
            </a>
            <a href="https://blog.csdn.net/m0_53610390/article/details/121756838" className="list-group-item list-group-item-action list-group-item-secondary">
                《MFC ODBC 学生成绩管理系统 示例》
            </a>
            <a href="https://www.cnblogs.com/yaocy/p/16193916.html" className="list-group-item list-group-item-action list-group-item-info">
                《力扣-206-反转链表/剑指Offer-24》
            </a>
            <a href="https://github.com/yaocys/notes/blob/main/%E5%85%AB%E8%82%A1%E6%96%87/Java/%E5%A4%9A%E7%BA%BF%E7%A8%8B/ThreadLocal.md" className="list-group-item list-group-item-action list-group-item-secondary">
                《Java多线程并发-ThreadLocal》
            </a>

            <a href="http://162.14.116.127:8080/" className="list-group-item list-group-item-action list-group-item-success">
                Jenkins入口
            </a>
            <a href="http://yaos.cc:8848/nacos" className="list-group-item list-group-item-action list-group-item-secondary">
                Nacos入口
            </a>
        </div>
    )
}

export default ClipboardLink;