import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import Vditor from 'vditor';
import './index.css'
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {useAuth} from "../../hooks/useAuth";
import {useOutline} from "../../context/OutlineContext";

function Post() {

    const [essay, setEssay] = useState(null);
    const param = useParams();
    const isAuth = useAuth();
    const previewRef = useRef(null);
    const { setOutline } = useOutline();

    useEffect(() => {
        axios.get(`/api1/essay/selectOne?id=${param.id}`).then(
            response => setEssay(response.data),
            error => console.log('请求失败', error)
        )
    }, [param.id]);

    useEffect(() => {
        if (!essay?.content || !previewRef.current) return;

        Vditor.preview(previewRef.current, essay.content, {
            anchor: 1,
            hljs: { enable: true, style: 'github', lineNumber: true },
            markdown: { mark: true },
            after() {
                const headings = previewRef.current.querySelectorAll('h1,h2,h3,h4,h5,h6');
                setOutline(Array.from(headings).map(h => ({
                    id: h.id,
                    text: h.textContent.replace(/\s*#\s*$/, '').trim(),
                    level: parseInt(h.tagName[1])
                })));
            }
        });

        return () => setOutline([]);
    }, [essay?.content]);

    return (
        <>
            <table className="table user-select-none" frame="void" rules="none">
                <tbody>
                <tr>
                    <td className="border-danger-subtle display-6 border-bottom border-2 fw-bolder">
                        {essay && essay.title}
                    </td>
                    <td style={{fontSize: "small", textAlign: "end"}} className="border-bottom border-success-subtle border-2">
                        <div><i className="bi bi-calendar-event"/>&nbsp;{moment(essay && essay.createTime).format("YYYY-MM-DD")}</div>
                        <div><i className="bi bi-eye"></i>&nbsp;浏览量:{essay && essay.views}</div>
                        {isAuth === true && (
                            <div style={{marginTop: '0.3em'}}>
                                <Link to={`/backstage/${param.id}`} className="btn btn-sm btn-outline-secondary">编辑</Link>
                            </div>
                        )}
                    </td>
                </tr>
                </tbody>
            </table>

            {essay && essay.tags && essay.tags.length > 0 && (
                <div style={{marginBottom: '0.8em'}}>
                    {essay.tags.map(tag => (
                        <span key={tag.id} className={`badge rounded-pill bg-${tag.color}-subtle me-1`}
                              style={{color: '#2d3436', fontWeight: 'bold'}}>
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}

            <div ref={previewRef} id="essay"/>
        </>
    )
}

export default Post;
