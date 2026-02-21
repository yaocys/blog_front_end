import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import './index.css'

interface Tag {
    id: string;
    name: string;
    description: string;
    color: string;
}

interface TagHandle {
    getSelectedTagIds: () => string[];
}

type ModalView = 'list' | 'new' | 'edit';

const COLORS = ['primary', 'success', 'danger', 'warning', 'info'];

const emptyForm = {id: '', name: '', description: '', color: 'primary'};

/**
 * 文章编辑页的标签区域组件
 * 通过 ref 暴露 getSelectedTagIds() 供父组件获取已选标签 ID 列表
 *
 * 使用单一 Bootstrap Modal + React state 切换视图，避免多 modal 叠加产生的残留遮罩层问题
 */
const Tag = forwardRef<TagHandle, {initialTags?: Tag[]}>(function Tag({initialTags = []}, ref) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [search, setSearch] = useState('');
    const [modalView, setModalView] = useState<ModalView>('list');
    const [tagForm, setTagForm] = useState(emptyForm);

    const modalRef = useRef<HTMLDivElement>(null);
    const bsModalRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        getSelectedTagIds: () => selectedTags.map(t => t.id)
    }));

    const getBsModal = () => {
        if (!bsModalRef.current && modalRef.current) {
            bsModalRef.current = new (window as any).bootstrap.Modal(modalRef.current);
        }
        return bsModalRef.current;
    };

    const showModal = (view: ModalView) => {
        setModalView(view);
        getBsModal()?.show();
    };

    const hideModal = () => {
        getBsModal()?.hide();
    };

    const loadAllTags = () => {
        fetch('/api1/tag/listAll')
            .then(r => r.json())
            .then(data => setAllTags(data))
            .catch(err => console.error('加载标签失败', err));
    };

    useEffect(() => {
        loadAllTags();
    }, []);

    useEffect(() => {
        if (initialTags && initialTags.length > 0) {
            setSelectedTags(initialTags);
        }
    }, [initialTags]);

    const removeTag = (id: string) => {
        setSelectedTags(prev => prev.filter(t => t.id !== id));
    };

    const addTag = (tag: Tag) => {
        if (!selectedTags.find(t => t.id === tag.id)) {
            setSelectedTags(prev => [...prev, tag]);
        }
    };

    const unselectedTags = allTags.filter(t =>
        !selectedTags.find(s => s.id === t.id) &&
        (search === '' || t.name.includes(search))
    );

    const handleSaveNewTag = () => {
        if (!tagForm.name.trim()) { alert('标签名不能为空'); return; }
        fetch('/api1/tag/saveTag', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: tagForm.name, description: tagForm.description, color: tagForm.color})
        }).then(r => {
            if (!r.ok) { alert('创建失败'); return; }
            loadAllTags();
            setTagForm(emptyForm);
            setModalView('list');  // 直接切换视图，modal 保持打开，无遮罩层问题
        }).catch(() => alert('创建失败'));
    };

    const handleUpdateTag = () => {
        if (!tagForm.name.trim()) { alert('标签名不能为空'); return; }
        fetch('/api1/tag/updateTag', {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: tagForm.id, name: tagForm.name, description: tagForm.description, color: tagForm.color})
        }).then(r => {
            if (!r.ok) { alert('更新失败'); return; }
            loadAllTags();
            setSelectedTags(prev => prev.map(t => t.id === tagForm.id
                ? {...t, name: tagForm.name, description: tagForm.description, color: tagForm.color}
                : t));
            setModalView('list');
        }).catch(() => alert('更新失败'));
    };

    const renderListView = () => (
        <>
            <div className="modal-header">
                <h1 className="modal-title fs-5">添加标签</h1>
                <button type="button" className="btn-close" onClick={hideModal} aria-label="Close"/>
            </div>
            <div className="modal-body">
                <form className="d-flex mb-3" role="search" onSubmit={e => e.preventDefault()}>
                    <input className="form-control me-2" type="search" placeholder="搜索标签"
                           value={search} onChange={e => setSearch(e.target.value)}/>
                </form>
                <ul className="list-group">
                    {unselectedTags.map(tag => (
                        <li key={tag.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span className={`badge bg-${tag.color}-subtle`} style={{color: '#2d3436'}}>{tag.name}</span>
                            <div>
                                <button className="btn btn-sm btn-outline-secondary me-2"
                                        onClick={() => {
                                            setTagForm({id: tag.id, name: tag.name, description: tag.description || '', color: tag.color});
                                            setModalView('edit');
                                        }}>编辑</button>
                                <button className="btn btn-sm btn-outline-primary"
                                        onClick={() => addTag(tag)}>添加</button>
                            </div>
                        </li>
                    ))}
                    {unselectedTags.length === 0 && (
                        <li className="list-group-item text-muted">没有可添加的标签</li>
                    )}
                </ul>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={hideModal}>关闭</button>
                <button className="btn btn-outline-success btn-sm"
                        onClick={() => { setTagForm(emptyForm); setModalView('new'); }}>新建标签</button>
            </div>
        </>
    );

    const renderFormView = () => {
        const isEdit = modalView === 'edit';
        return (
            <>
                <div className="modal-header">
                    <h1 className="modal-title fs-5">{isEdit ? '编辑标签' : '新建标签'}</h1>
                    <button type="button" className="btn-close" onClick={hideModal} aria-label="Close"/>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label className="col-form-label">标签名：</label>
                            <input type="text" className="form-control" value={tagForm.name}
                                   onChange={e => setTagForm(f => ({...f, name: e.target.value}))}/>
                        </div>
                        <div className="mb-3">
                            <label className="col-form-label">备注：</label>
                            <textarea className="form-control" value={tagForm.description}
                                      onChange={e => setTagForm(f => ({...f, description: e.target.value}))}/>
                        </div>
                        <div className="mb-3">
                            <label className="col-form-label">颜色：</label>
                            <select className="form-select" value={tagForm.color}
                                    onChange={e => setTagForm(f => ({...f, color: e.target.value}))}>
                                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary btn-sm"
                            onClick={() => setModalView('list')}>取消</button>
                    <button className="btn btn-outline-warning btn-sm"
                            onClick={isEdit ? handleUpdateTag : handleSaveNewTag}>
                        {isEdit ? '保存' : '创建'}
                    </button>
                </div>
            </>
        );
    };

    return (
        <div className="align-content-end w-100" style={{marginBottom: '0.5em'}}>
            {/* 已选标签展示 */}
            {selectedTags.map(tag => (
                <span key={tag.id} className={`badge rounded-pill bg-${tag.color}-subtle tag`}>
                    {tag.name}
                    <button type="button" className="btn btn-primary cross2" onClick={() => removeTag(tag.id)}>×</button>
                </span>
            ))}

            {/* 单一 modal，通过 modalView state 切换内容，避免多 modal 叠加的遮罩层残留问题 */}
            <div className="modal fade" ref={modalRef} tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        {modalView === 'list' ? renderListView() : renderFormView()}
                    </div>
                </div>
            </div>

            {/* 触发按钮 */}
            <button className="btn btn-outline-success btn-sm text-nowrap"
                    onClick={() => showModal('list')}>添加标签</button>
        </div>
    );
});

export default Tag;
