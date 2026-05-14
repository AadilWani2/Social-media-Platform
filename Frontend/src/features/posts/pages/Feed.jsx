import React from 'react'
import "../styles/feed.scss"
import Post from '../components/Post'
import { usePost } from '../hooks/usePost'
import { useEffect } from 'react'
import Nav from '../../shared/components/Nav'

const PostSkeleton = () => (
    <div className="skeleton-post">
        <div className="skeleton-user">
            <div className="skeleton-avatar shimmer"></div>
            <div className="skeleton-name shimmer"></div>
        </div>
        <div className="skeleton-image shimmer"></div>
        <div className="skeleton-content">
            <div className="skeleton-line medium shimmer"></div>
            <div className="skeleton-line short shimmer"></div>
        </div>
    </div>
)

const Feed = () => {
    const {feed,handleGetFeed,loading} = usePost()

    useEffect(() => {
        handleGetFeed()
    }, [handleGetFeed])

    return (
        <main className='feed-page'>
            <Nav/>
            <div className="feed">
                <div className="posts">
                    {loading ? (
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    ) : (
                        feed?.posts?.map(post => (
                            <Post key={post._id} user={post.user} post={post}/>
                        ))
                    )}
                    
                    {!loading && feed?.posts?.length === 0 && (
                        <div className="no-posts">
                            <h2>No posts to show</h2>
                            <p>Follow some users to see their posts!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default Feed