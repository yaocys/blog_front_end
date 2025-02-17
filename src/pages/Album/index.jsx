import React, {useState} from "react";
import COS from 'cos-js-sdk-v5';
import './index.css'

function Album() {

    const cos = new COS({
        SecretId: process.env.REACT_APP_TENCENT_SECRET_ID,
        SecretKey: process.env.REACT_APP_TENCENT_SECRET_KEY
    });

    const [selectedFile, setSelectedFile] = useState(null);

    const upload = () => {
        if (selectedFile === null) {
            alert("未选中任何文件！");
            return;
        }
        console.log("被选中文件：", selectedFile);
        cos.uploadFile({
            Bucket: 'essay-pic-1311669082',
            Region: 'ap-chengdu',
            Key: selectedFile.name,
            Body: selectedFile,
            SliceSize: 1024 * 1024 * 5
        }).then(data => {
            console.log('上传成功', data);
        }).catch(err => {
            console.log('上传出错', err);
        });

        const url = cos.getObjectUrl({
            Bucket: 'essay-pic-1311669082',
            Region: 'ap-chengdu',
            Key: selectedFile.name
        });
        alert(url);
    }

    const selectFile = (event) => {
        console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0]);
    }

    return (
        <div>
            <input type="file" onChange={selectFile}/>
            <button className="btn btn-sm btn-success" onClick={upload}>上传到COS</button>
        </div>
    )
}

export default Album;