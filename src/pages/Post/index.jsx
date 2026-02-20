import React, {useEffect, useState} from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkFlexibleMarkers from 'remark-flexible-markers'
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import pangu from 'pangu';
// import rehypeReact from 'rehype-react'
// 设置高亮样式
import {tomorrow} from "react-syntax-highlighter/dist/esm/styles/prism"
import './index.css'
import {useParams} from "react-router-dom";
import axios from "axios";

// 加了空格能让排版好看，但是会破坏markdown标记的渲染
// string = pangu.spacing(string);

function Post() {

    const [essay,setEssay] = useState(null);
    const param = useParams();

    useEffect(()=>{
        axios.get(`http://localhost:3000/api1/essay/selectOne?id=${param.id}`).then(
            response=>{
                setEssay(response.data);
            },
            error=>{
                console.log('请求失败', error);
            }
        )
    },[param.id]);

    return (
        <>
            <table className="table user-select-none" frame="void" rules="none">
                <tbody>
                <tr>
                    <td className="border-danger-subtle display-6 border-bottom border-2 fw-bolder">{essay && essay.title}</td>
                    <td style={{fontSize: "small", textAlign: "end"}} className="border-bottom border-success-subtle border-2">
                        <div><i className="bi bi-calendar-event"/>&nbsp;{moment(essay && essay.createTime).format("YYYY-MM-DD")}</div>
                        <div><i className="bi bi-eye"></i>&nbsp;浏览量:{essay && essay.views}</div>
                    </td>
                </tr>
                </tbody>
            </table>

            <div className="markdown-body" id="essay">
                <ReactMarkdown
                    children={essay && essay.content}
                    remarkPlugins={[remarkGfm, remarkFlexibleMarkers]}
                    components={{
                        code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={tomorrow}
                                    language={match[1]}
                                    PreTag="div"
                                    showLineNumbers="true"
                                    showInlineLineNumbers="true"
                                    {...props}
                                />
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}/>
            </div>
        </>
    )
}

export default Post;