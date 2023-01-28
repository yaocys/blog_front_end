import Post from "../pages/Post";
import TimeLine from "../pages/TimeLine";
import About from "../pages/About";
import Link from "../pages/Link";
import {Navigate} from "react-router-dom";
import React from "react";
import Editor from "../components/Editor";
import Article from "../pages/Article";
import Album from "../pages/Album";
import Archive from "../pages/Archive";
import ClipboardLink from "../pages/Link/ClipboardLink";
import ResourceLink from "../pages/Link/ResourceLink";

const routingTable = [
    {
        path: '/essay',
        element: <TimeLine/>
    },
    {
        path: '/essay/:year/:month/:id',
        element: <Post/>
    },
    {
        path: '/about',
        element: <About/>
    },
    {
        path: '/link',
        element: <Link/> ,
        children: [
            {
                index:true,
                element: <ClipboardLink/>
            },
            {
                path: 'clipboard',
                element: <ClipboardLink/>
            },
            {
                path: 'resource',
                element: <ResourceLink/>
            }
        ]
    },
    {
        path: '/backstage',
        element: <Editor/>
    },
    {
        path: '/article',
        element: <Article/>
    },
    {
        path: '/album',
        element: <Album/>
    },
    {
        path: '/archive',
        element: <Archive/>
    },
    {
        path: '*',
        element: <Navigate to="/essay"/>
    }
]
export default routingTable;