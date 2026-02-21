import React, {useState, useEffect, useRef} from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import COS from 'cos-js-sdk-v5';
import './index.css'
import {useNavigate} from "react-router-dom";
import Tag from "./Tag";


const cos = new COS({
    SecretId: process.env.REACT_APP_TENCENT_SECRET_ID,
    SecretKey: process.env.REACT_APP_TENCENT_SECRET_KEY
});


const Editor = () => {
    const [vditor, setVditor] = useState<Vditor>();
    const navigate = useNavigate();

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
        const vditor = new Vditor("vditor", {
            height: 'calc(55vh)',
            placeholder: '记录此刻所思所想！',
            typewriterMode: true,
            mode: 'ir',
            after: () => {
                setVditor(vditor);
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
                    vditor.insertValue(`![${JSON.parse(msg).data.name}](${JSON.parse(msg).data.url})`)
                }
        }
        });
    }, []);

    const titleRef = useRef(null);

    const Release = async (title: any, vditor: Vditor) => {
        // 参数校验
        if (title === null) {
            alert('标题不能为空！');
            return;
        }
        const md = vditor.getValue();
        if (md === null || md.length === 0) {
            alert("文本内容为空！");
            return;
        }

        // 准备发送给后端的对象
        const essay = {
            title: title.value,
            content: md,
        }

        // 向后端发送保存文章的请求，携带认证 Cookie
        const response = await fetch('/api1/essay/saveEssay', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(essay)
        });

        if (response.status === 401) {
            alert('登录已过期，请重新验证');
            navigate('/auth', {replace: true});
            return;
        }

        if (!response.ok) {
            alert('发布失败，请稍后重试');
            return;
        }

        vditor.clearCache();
        vditor.setValue('');
        alert('发布文章成功');
        navigate('/essay', {replace: true});
    }

    return (
        <>
            <div style={{marginBottom: "1em"}}>
                <form className="d-flex">
                    <input className="form-control me-2" type="text" placeholder="文章标题" aria-label="Title"
                           ref={titleRef}/>
                    <button className="btn btn-outline-info btn-sm me-1 text-nowrap" type="submit"
                            onClick={() => Release(titleRef.current as any, vditor as Vditor)}>发布
                    </button>
                    <button className="btn btn-outline-secondary btn-sm me-1 text-nowrap" type="button">保存草稿
                    </button>
                </form>
            </div>

            <Tag/>

            <div id="vditor" className="vditor"/>
        </>
    )
};

export default Editor;