import {createBrowserRouter} from 'react-router'
import Login from './features/auth/pages/Login.jsx'
import Register from './features/auth/pages/Register.jsx'
import Feed from './features/posts/pages/Feed.jsx'
import CreatePost from './features/posts/pages/CreatePost.jsx'

import SearchUsers from './features/users/pages/SearchUsers.jsx'
import Profile from './features/users/pages/Profile.jsx'

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<Feed/>
    },
    {
        path:"/create-post",
        element:<CreatePost/>
    },
    {
        path:"/search",
        element:<SearchUsers/>
    },
    {
        path:"/profile",
        element:<Profile/>
    }
])

