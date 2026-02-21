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

    useEffect(() => {
        fetch('/api1/tag/listAll')
            .then(r => r.json())
            .then(data => setTags(data))
            .catch(err => console.error('加载标签失败', err));
    }, []);

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
