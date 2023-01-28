import React from "react";
import './index.css';
import cnblogs from './icon/cnblogs.svg';
import leetcode from './icon/leetcode.svg';
import github from './icon/github.svg';

function Footer() {
    return (
        <footer className="user-select-none" id="footer">
            <div id="ref-links" className="align-items-center">
                <a className="icon-link" href="https://www.cnblogs.com/yaocy/">
                    <img src={cnblogs} width="22px" alt="博客园主页"/>
                </a>
                <a className="icon-link" href="https://leetcode-cn.com/u/yaocy/">
                    <img src={leetcode} width="22px" alt="力扣主页"/>
                </a>
                <a className="icon-link" href="https://github.com/yaocys/">
                    <img src={github} width="22px" alt="GitHub主页"/>
                </a>
            </div>
            <div>©&nbsp;<a href="https://yaos.cc">yaos.cc</a>&nbsp;|&nbsp;2020-2023</div>
            <a href="https://beian.miit.gov.cn/">蜀 ICP备2020032347号</a>
        </footer>
    )
}

export default Footer;