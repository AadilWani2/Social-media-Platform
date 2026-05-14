import axios from "axios";

const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials : true
})

export const getFeed = async () => {
    const response = await api.get("/api/post/feed")
    return response.data
}

export async function createPost(mediaFile, caption){
    const formData = new FormData()
    formData.append("media", mediaFile)
    formData.append("caption", caption)

    const response = await api.post("/api/post/",formData)
    return response.data
}

export const toggleLike = async (postId) => {
    const response = await api.post(`/api/post/like/${postId}`)
    return response.data
}

export const toggleBookmark = async (postId) => {
    const response = await api.post(`/api/post/bookmark/${postId}`)
    return response.data
}

export const addComment = async (postId, text) => {
    const response = await api.post(`/api/post/comment/${postId}`, { text })
    return response.data
}

export const deletePost = async (postId) => {
    const response = await api.delete(`/api/post/delete/${postId}`)
    return response.data
}