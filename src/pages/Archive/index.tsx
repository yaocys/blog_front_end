import React, {useEffect, useState} from "react";
import './index.css';
import {Link} from "react-router-dom";

interface Tag {
    id: string;
    name: string;
    description: string;
    color: string;
}

const COLOR_MAP: Record<string, string> = {
    primary:   '#0d6efd',
    secondary: '#6c757d',
    success:   '#198754',
    danger:    '#dc3545',
    warning:   '#e6a817',
    info:      '#0aa2c0',
    dark:      '#343a40',
    light:     '#adb5bd',
};

function TagCard({tag}: {tag: Tag}) {
    const accent = COLOR_MAP[tag.color] ?? '#6c757d';
    return (
        <Link
            to={`/essay?tag=${tag.id}&tagName=${encodeURIComponent(tag.name)}&tagColor=${tag.color}`}
            className="archive-card"
            style={{'--accent': accent} as React.CSSProperties}
        >
            <span className="archive-card-name">{tag.name}</span>
            {tag.description && <p className="archive-card-desc">{tag.description}</p>}
        </Link>
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
            <div className="archive-grid placeholder-glow" style={{color: '#d0d5db'}}>
                {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="archive-card archive-card-skeleton">
                        <span className="placeholder rounded" style={{display: 'block', width: '45%', height: '1rem', marginBottom: '0.6rem'}}></span>
                        <span className="placeholder rounded" style={{display: 'block', width: `${55 + (i % 3) * 10}%`, height: '0.8rem'}}></span>
                        <span className="placeholder rounded" style={{display: 'block', width: `${30 + (i % 4) * 8}%`, height: '0.8rem', marginTop: '0.3rem'}}></span>
                    </div>
                ))}
            </div>
        );
    }

    if (tags.length === 0) {
        return <p className="text-muted">暂无标签</p>;
    }

    return (
        <div className="archive-grid">
            {tags.map(tag => <TagCard key={tag.id} tag={tag}/>)}
        </div>
    );
}

export default Archive;
