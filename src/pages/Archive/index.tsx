import React, {useEffect, useState} from "react";
import './index.css';
import {Link} from "react-router-dom";

interface Tag {
    id: string;
    name: string;
    description: string;
    color: string;
}

function TagCard(props: {tag: Tag}) {
    const {tag} = props;
    return (
        <div className="col-sm-4 mb-3 mb-sm-0">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">
                        <span className={`badge bg-${tag.color}-subtle`} style={{color: '#2d3436'}}>
                            {tag.name}
                        </span>
                    </h5>
                    <p className="card-text text-muted">{tag.description}</p>
                    <Link to={`/essay?tag=${tag.id}&tagName=${encodeURIComponent(tag.name)}&tagColor=${tag.color}`}
                          className="btn btn-outline-primary btn-sm">查看</Link>
                </div>
            </div>
        </div>
    );
}

function Archive() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api1/tag/listAll')
            .then(r => r.json())
            .then(data => setTags(data))
            .catch(err => console.error('加载标签失败', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="row placeholder-glow">
                {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="col-sm-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    <span className="placeholder rounded" style={{display: 'inline-block', width: '40%'}}></span>
                                </h5>
                                <p className="card-text">
                                    <span className="placeholder" style={{display: 'inline-block', width: `${55 + (i % 3) * 10}%`}}></span>
                                    <br/>
                                    <span className="placeholder" style={{display: 'inline-block', width: `${35 + (i % 4) * 8}%`}}></span>
                                </p>
                                <span className="placeholder rounded" style={{display: 'inline-block', width: '28%', height: '30px'}}></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="row">
            {tags.map(tag => (
                <TagCard key={tag.id} tag={tag}/>
            ))}
            {tags.length === 0 && (
                <p className="text-muted">暂无标签</p>
            )}
        </div>
    );
}

export default Archive;
