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
        <div className="col">
            <Link
                to={`/essay?tag=${tag.id}&tagName=${encodeURIComponent(tag.name)}&tagColor=${tag.color}`}
                className="card h-100 border-0 shadow-sm text-decoration-none archive-card"
                style={{'--accent': accent} as React.CSSProperties}
            >
                <div className="card-body py-3 px-3">
                    <h6 className="card-title fw-semibold mb-1" style={{color: '#2d3436'}}>{tag.name}</h6>
                    {tag.description && (
                        <p className="card-text text-muted small mb-0 archive-card-desc">{tag.description}</p>
                    )}
                </div>
            </Link>
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
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3 placeholder-glow">
                {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="col">
                        <div className="card h-100 border-0 shadow-sm archive-card" style={{minHeight: '78px', pointerEvents: 'none'}}>
                            <div className="card-body py-3 px-3">
                                <span className="placeholder rounded d-block mb-2" style={{width: '45%', height: '1rem'}}></span>
                                <span className="placeholder rounded d-block" style={{width: `${55 + (i % 3) * 10}%`, height: '0.75rem'}}></span>
                                <span className="placeholder rounded d-block mt-1" style={{width: `${30 + (i % 4) * 8}%`, height: '0.75rem'}}></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (tags.length === 0) {
        return <p className="text-muted">暂无标签</p>;
    }

    return (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3">
            {tags.map(tag => <TagCard key={tag.id} tag={tag}/>)}
        </div>
    );
}

export default Archive;
