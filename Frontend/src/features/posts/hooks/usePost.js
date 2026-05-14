import {getFeed,createPost} from "../services/post.api"
import {useContext, useCallback} from "react"
import {PostContext} from "../post.context"
import { useNavigate } from "react-router"

export const usePost = () => {
    const navigate = useNavigate()
    const context = useContext(PostContext)
    const {loading,setLoading,post,setPost,feed,setFeed} = context

    const handleGetFeed = useCallback(async () => {
        setLoading(true)
        try{
            const data = await getFeed()
            setFeed(data)
        }catch(error){
            console.log("Feed Fetch Error:", error)
            if (error?.response?.status === 401) {
                navigate("/login")
            }
        }finally{
            setLoading(false)
        }
    }, [setFeed, setLoading, navigate])

    const handleCreatePost = async (imageFile,caption) => {
        setLoading(true)
        try{
            const data = await createPost(imageFile,caption)
            setFeed(prevFeed => {
                if (!prevFeed) return prevFeed;
                return {
                    ...prevFeed,
                    posts: [data.post, ...prevFeed.posts]
                };
            })
            return true;
        }catch(error){
            console.log("Create Post Error:", error)
            alert("Upload failed: " + (error?.response?.data?.message || "Missing ImageKit Keys or Server down."))
            return false;
        }finally{
            setLoading(false)
        }
    }

    return {
        loading,
        post,
        feed,
        handleGetFeed,
        handleCreatePost
    }
}



