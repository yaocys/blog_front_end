import React from "react";
import './index.css'

/**
 * 文章编辑页的标签区域组件
 */
function Tag() {
    return (
        // 文章编辑页的标签选择栏
        <div className="align-content-end w-100">
            <SelectedTags/>
            {/*这是一级菜单：为文章添加标签*/}
            <Modal/>
        </div>
    )
}

function SelectedTags() {
    return (
        <>
            <span className="badge rounded-pill bg-danger-subtle tag">阅读笔记
       <button type="button" className="btn btn-primary cross2">×</button>
            </span>
            <span className="badge rounded-pill bg-info-subtle tag">Leetcode
                <button type="button" className="btn btn-primary cross2">×</button>
            </span>
            <span className="badge rounded-pill bg-success-subtle tag">建站日志
                <button type="button" className="btn btn-primary cross2">×</button>
            </span>
        </>
    )
}

/**
 * 嵌套的双层模态对话框，添加和新建标签
 */
function Modal() {
    return (
        <>
            <div className="modal fade" id="exampleModalToggle" aria-hidden="true"
                 aria-labelledby="exampleModalToggleLabel" tabIndex={parseInt("-1")}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        {/*弹出框头*/}
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">添加标签</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        {/*弹出框中部内容*/}
                        <div className="modal-body">
                            <div className="container-fluid">
                                <form className="d-flex" role="search">
                                    <input className="form-control me-2" type="search" placeholder="搜索标签"
                                           aria-label="Search"/>
                                    <button className="btn btn-outline-success text-nowrap" type="submit">搜索</button>
                                </form>
                            </div>
                        </div>
                        {/*弹出框尾部按钮*/}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary btn-sm"
                                    data-bs-dismiss="modal">取消
                            </button>
                            <button type="button" className="btn btn-outline-primary btn-sm">添加</button>
                            <button className="btn btn-outline-success btn-sm" data-bs-target="#exampleModalToggle2"
                                    data-bs-toggle="modal">新建标签
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*这是二级菜单：新建新新标签*/}
            <div className="modal fade" id="exampleModalToggle2" aria-hidden="true"
                 aria-labelledby="exampleModalToggleLabel2" tabIndex={parseInt("-1")}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        {/*弹出框头部标题*/}
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">新建标签</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        {/*弹出框中间内容*/}
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="recipient-name" className="col-form-label">标签名：</label>
                                    <input type="text" className="form-control" id="recipient-name"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message-text" className="col-form-label">备注：</label>
                                    <textarea className="form-control" id="message-text"></textarea>
                                </div>
                            </form>
                        </div>
                        {/*弹出框尾部按钮*/}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary btn-sm"
                                    data-bs-target="#exampleModalToggle"
                                    data-bs-toggle="modal">取消
                            </button>
                            <button className="btn btn-outline-warning btn-sm" data-bs-target="#exampleModalToggle"
                                    data-bs-toggle="modal">添加
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*一级弹出框的页面启动按钮*/}
            <button className="btn btn-outline-success btn-sm text-nowrap"
                    data-bs-target="#exampleModalToggle" data-bs-toggle="modal">添加标签
            </button>
        </>
    )
}

export default Tag;