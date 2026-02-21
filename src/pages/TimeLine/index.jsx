import React, {useEffect, useRef, useState} from "react";
import './index.css'
import {Link, useSearchParams} from "react-router-dom";
import moment from "moment";
import {useAuth} from "../../hooks/useAuth";

const PAGE_SIZE = 10;

function Item({essay, isAuth, onDelete}) {
    const [mouseHover, setMouseHover] = useState(false);

    const handleDelete = () => {
        if (!window.confirm(`确认删除「${essay.title}」？`)) return;
        fetch(`/api1/essay/deleteEssay?id=${essay.id}`, {
            method: 'DELETE',
            credentials: 'include'
        }).then(r => {
            if (r.ok) onDelete(essay.id);
            else alert('删除失败');
        }).catch(() => alert('删除失败'));
    };

    return (
        <tr onMouseEnter={() => setMouseHover(true)} onMouseLeave={() => setMouseHover(false)}>
            <td style={{textAlign: "center", whiteSpace: 'nowrap'}}>
                {essay.showDate && moment(essay.createTime).format("YYYY-MM-DD")}
            </td>
            <td>
                <Link to={`${moment(essay.createTime).format("YYYY/MM")}/${essay.id}`}>{essay.title}</Link>
            </td>
            {isAuth === true && (
                <td style={{textAlign: "right", width: "120px"}}>
                    <div style={{display: mouseHover ? '' : 'none'}}>
                        <Link to={`/backstage/${essay.id}`} className="text-info" style={{margin: "0 1em"}}>编辑</Link>
                        <button
                            onClick={handleDelete}
                            className="text-danger"
                            style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit'}}
                        >删除</button>
                    </div>
                </td>
            )}
        </tr>
    );
}

function TimeLine() {
    const [essayList, setEssayList] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const isAuth = useAuth();
    const [searchParams] = useSearchParams();

    const tagId = searchParams.get('tag');

    // tagId 切换时重置列表
    useEffect(() => {
        setEssayList([]);
        setPage(0);
        setHasMore(true);
    }, [tagId]);

    // page 变化或 tagId 重置后加载数据
    useEffect(() => {
        if (!hasMore && page > 0) return;

        setLoading(true);

        if (tagId) {
            // 标签筛选模式：一次性返回全部，无需分页
            fetch(`/api1/tag/getEssaysByTag?tagId=${tagId}`)
                .then(r => r.json())
                .then(data => {
                    setEssayList(data);
                    setHasMore(false);
                })
                .catch(err => console.error('加载标签文章失败', err))
                .finally(() => setLoading(false));
        } else {
            // 普通分页模式
            fetch(`/api1/essay/listAll?page=${page}&size=${PAGE_SIZE}`)
                .then(r => r.json())
                .then(data => {
                    setEssayList(prev => page === 0 ? data : [...prev, ...data]);
                    setHasMore(data.length === PAGE_SIZE);
                })
                .catch(err => console.error('加载文章失败', err))
                .finally(() => setLoading(false));
        }
    }, [page, tagId]);

    const handleLoadMore = () => {
        if (!loading && hasMore) setPage(p => p + 1);
    };

    const handleDelete = (id) => {
        setEssayList(prev => prev.filter(e => e.id !== id));
    };

    // 按天聚合：同一天的文章只有第一条显示日期
    let date = '';
    const displayList = essayList.map((essay) => {
        const d = moment(essay.createTime).format("YYYY-MM-DD");
        if (date !== d) { date = d; return {...essay, showDate: true}; }
        return {...essay, showDate: false};
    });

    return (
        <>
            <table className="table" frame="void" rules="none">
                <tbody className={loading && essayList.length === 0 ? 'placeholder-glow' : ''}>
                {loading && essayList.length === 0
                    ? Array.from({length: 7}).map((_, i) => (
                        <tr key={`skel-${i}`}>
                            <td style={{textAlign: 'center', whiteSpace: 'nowrap', width: '90px'}}>
                                <span className="placeholder rounded" style={{display: 'inline-block', width: '70%'}}></span>
                            </td>
                            <td>
                                <span className="placeholder rounded" style={{display: 'inline-block', width: `${45 + (i % 5) * 9}%`}}></span>
                            </td>
                        </tr>
                    ))
                    : displayList.map((essay) => (
                        <Item key={essay.id} essay={essay} isAuth={isAuth} onDelete={handleDelete}/>
                    ))
                }
                </tbody>
            </table>

            {/* 加载更多 */}
            {!tagId && (
                <div style={{textAlign: 'center', padding: '0.5em 0 1em'}}>
                    {loading && (
                        <span className="text-muted" style={{fontSize: 'small'}}>加载中…</span>
                    )}
                    {!loading && hasMore && (
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={handleLoadMore}
                        >加载更多</button>
                    )}
                    {!loading && !hasMore && essayList.length > 0 && (
                        <span className="text-muted" style={{fontSize: 'small'}}>— 已加载全部 —</span>
                    )}
                </div>
            )}
        </>
    );
}

export default TimeLine;
