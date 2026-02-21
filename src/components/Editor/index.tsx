import React, {useState, useEffect, useRef} from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import COS from 'cos-js-sdk-v5';
import './index.css'
import {useNavigate, useParams} from "react-router-dom";
import Tag from "./Tag";


const cos = new COS({
    SecretId: process.env.REACT_APP_TENCENT_SECRET_ID,
    SecretKey: process.env.REACT_APP_TENCENT_SECRET_KEY
});


const Editor = () => {
    const [vditor, setVditor] = useState<Vditor>();
    const [initialTags, setInitialTags] = useState<any[]>([]);
    const navigate = useNavigate();
    const {id} = useParams<{id?: string}>();
    const tagRef = useRef<any>(null);

    // 挂载时检查是否已通过 TOTP 认证，未认证则跳转到验证页
    useEffect(() => {
        fetch('/api1/auth/check', {credentials: 'include'})
            .then(r => {
                if (!r.ok) navigate('/auth', {replace: true});
            })
            .catch(() => navigate('/auth', {replace: true}));
    }, [navigate]);

    useEffect(() => {
        // 配置Vditor编辑器
        const vditorInstance = new Vditor("vditor", {
            height: 'calc(55vh)',
            placeholder: '记录此刻所思所想！',
            typewriterMode: true,
            mode: 'ir',
            cache: { enable: false },
            after: () => {
                setVditor(vditorInstance);
                // 编辑模式：加载已有文章内容
                if (id) {
                    fetch(`/api1/essay/selectOne?id=${id}`, {credentials: 'include'})
                        .then(r => r.json())
                        .then(essay => {
                            vditorInstance.setValue(essay.content || '');
                            if (titleRef.current) {
                                (titleRef.current as HTMLInputElement).value = essay.title || '';
                            }
                            if (essay.tags && essay.tags.length > 0) {
                                setInitialTags(essay.tags);
                            }
                        })
                        .catch(err => console.error('加载文章失败', err));
                }
            },
            toolbar: [
                'emoji', '|', 'check', '|', 'table', '|', 'upload', '|', 'edit-mode', '|',
                'code-theme', '|', 'content-theme', '|', 'outline', 'both', '|', 'preview', '|'
                , 'fullscreen', '|', 'export'
            ],
            preview: {
                delay: 0,
                maxWidth: 800,
                mode: 'both',
                hljs: {
                    enable: true,
                    style: 'github',
                    lineNumber: true
                },
                markdown: {
                    mark: true
                },
                actions: []
            },
            upload: {
                fieldName:'image',
                accept: 'image/*,.mp3,.wav,.rar',
                token: '',
                url: 'https://essay-pic-1311669082.cos.ap-chengdu.myqcloud.com',
                linkToImgUrl: '',
                filename(name: string): string {
                    return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5.)]/g, '').replace(/[?\\/:|<>*\[\]()$%{}@~]/g, '').replace('/\\s/g', '')
                },
                success(editor: HTMLPreElement, msg: string) {
                    vditorInstance.insertValue(`![${JSON.parse(msg).data.name}](${JSON.parse(msg).data.url})`)
                }
            }
        });
    }, []);

    const titleRef = useRef(null);

    const showToast = (message: string) => {
        const toastEl = document.getElementById('editor-success-toast');
        if (toastEl) {
            const msgEl = document.getElementById('editor-toast-body');
            if (msgEl) msgEl.textContent = message;
            const toast = new (window as any).bootstrap.Toast(toastEl, {delay: 2000});
            toast.show();
        }
    };

    const Release = async (title: any, vditor: Vditor) => {
        if (!title || !title.value || !title.value.trim()) {
            alert('标题不能为空！');
            return;
        }
        const md = vditor.getValue();
        if (!md || !md.trim()) {
            alert("文本内容为空！");
            return;
        }

        let essayId: string;

        if (id) {
            // 编辑模式：更新已有文章
            const response = await fetch('/api1/essay/updateEssay', {
                method: 'PUT',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id, title: title.value, content: md})
            });
            if (response.status === 401) {
                alert('登录已过期，请重新验证');
                navigate('/auth', {replace: true});
                return;
            }
            if (!response.ok) {
                const msg = await response.text();
                alert(msg || '更新失败，请稍后重试');
                return;
            }
            essayId = id;
        } else {
            // 新增模式：发布新文章
            const response = await fetch('/api1/essay/saveEssay', {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title: title.value, content: md})
            });
            if (response.status === 401) {
                alert('登录已过期，请重新验证');
                navigate('/auth', {replace: true});
                return;
            }
            if (!response.ok) {
                const msg = await response.text();
                alert(msg || '发布失败，请稍后重试');
                return;
            }
            essayId = await response.text();
        }

        // 保存文章标签
        const tagIds = tagRef.current ? tagRef.current.getSelectedTagIds() : [];
        await fetch('/api1/tag/setEssayTags', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({essayId, tagIds})
        });

        vditor.clearCache();
        vditor.setValue('');
        showToast(id ? '更新文章成功' : '发布文章成功');
        setTimeout(() => navigate('/essay', {replace: true}), 1200);
    }

    return (
        <>
            <div style={{marginBottom: "1em"}}>
                <form className="d-flex">
                    <input className="form-control me-2" type="text" placeholder="文章标题" aria-label="Title"
                           ref={titleRef}/>
                    <button className="btn btn-outline-info btn-sm me-1 text-nowrap" type="button"
                            onClick={() => Release(titleRef.current as any, vditor as Vditor)}>
                        {id ? '更新' : '发布'}
                    </button>
                    <button className="btn btn-outline-secondary btn-sm me-1 text-nowrap" type="button">保存草稿
                    </button>
                </form>
            </div>

            <Tag ref={tagRef} initialTags={initialTags}/>

            <div id="vditor" className="vditor"/>

            <div className="toast-container position-fixed top-0 start-50 translate-middle-x pt-3" style={{zIndex: 1100}}>
                <div id="editor-success-toast" className="toast align-items-center text-bg-success border-0"
                     role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body" id="editor-toast-body"></div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto"
                                data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Editor;
