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
                actions: []
            },
            upload: {
                fieldName:'image',
                accept: 'image/*,.mp3,.wav,.rar',
                token: '',
                url: 'https://essay-pic-1311669082.cos.ap-chengdu.myqcloud.com',
                linkToImgUrl: '',
                filename(name: string): string {
                    return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').replace('/\\s/g', '')
                },
                success(editor: HTMLPreElement, msg: string) {
                    vditor.insertValue(`![${JSON.parse(msg).data.name}](${JSON.parse(msg).data.url})`)
                }
        }
        });
    }, []);

    const titleRef = useRef(null);
    const useNavigate1 = useNavigate();

    const Release = (title: any, vditor: Vditor) => {
        // 参数校验
        if (title === null) {
            alert('标题不能为空！');
            throw new Error('文章标题为空');
        }
        const md = vditor.getValue();
        if (md === null || md.length === 0) {
            alert("文本内容为空！")
            throw new Error('请求MD文本为空');
        }

        // 准备发送给后端的对象
        const essay = {
            title: title.value,
            content: md,
        }

        // 像后端发送保存文章的请求
        fetch('http://localhost:3000/api1/essay/saveEssay', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(essay)
        }).then(
            response => {
                console.log(response);
                vditor.clearCache();
                vditor.setValue('');
            },
            error => {
                console.log('提交文章失败', error)
            }
        )

        // TODO 这里改成更优雅的通知组件
        alert('发布文章成功');
        useNavigate1('/essay', {
            replace: true,
        });
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