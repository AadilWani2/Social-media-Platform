import React, {useState, useRef, useEffect} from 'react'
import {toggleLike, toggleBookmark, addComment} from '../services/post.api'

const Post = ({user,post}) => {

  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(post.likeCount || 0)
  
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false)
  
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [commentCount, setCommentCount] = useState(post.commentCount || 0)
  const [localComments, setLocalComments] = useState(post.comments || [])
  const [showAllComments, setShowAllComments] = useState(false)

  useEffect(() => {
    if (post.mediaType !== 'video') return;

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.7 // Play when 70% of video is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                videoRef.current?.play().catch(() => {});
                setIsPlaying(true)
            } else {
                videoRef.current?.pause();
                setIsPlaying(false)
            }
        });
    }, options);

    if (videoRef.current) {
        observer.observe(videoRef.current);
    }

    return () => {
        if (videoRef.current) {
            observer.unobserve(videoRef.current);
        }
    };
  }, [post.mediaType]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
        videoRef.current.pause();
    } else {
        videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleLike = async () => {
    const previousLiked = isLiked;
    setIsLiked(!previousLiked)
    setLikeCount(prev => previousLiked ? prev - 1 : prev + 1)
    try {
        await toggleLike(post._id)
    } catch(e) {
        setIsLiked(previousLiked)
        setLikeCount(prev => previousLiked ? prev + 1 : prev - 1)
    }
  }

  const handleBookmark = async () => {
    const previousAuth = isBookmarked;
    setIsBookmarked(!previousAuth)
    try {
        await toggleBookmark(post._id)
    } catch(e) {
        setIsBookmarked(previousAuth)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return;
    
    const submittedText = commentText;
    setCommentText("")
    setCommentCount(prev => prev + 1)
    
    const optimisticComment = {
        _id: Date.now().toString(),
        user: { username: "You" },
        text: submittedText
    };
    
    setLocalComments(prev => [...prev, optimisticComment])
    // Only close if they haven't chosen to show all comments yet to see it
    if(!showAllComments && localComments.length === 0) {
        setShowCommentBox(false)
    }
    
    try {
        await addComment(post._id, submittedText)
    } catch(e) {
        setCommentCount(prev => prev - 1)
        setLocalComments(prev => prev.filter(c => c._id !== optimisticComment._id))
        alert("Failed to submit comment.")
    }
  }

  // Determine comments to display in feed (up to the latest 2)
  const displayedComments = localComments.slice(-2);

  return (
    <div className="post">
        <div className="user">
            <div className="img-wrapper">
                <img src={user.profileImage || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="" />
            </div>
            <p>{user.username}</p>
        </div>
        
        <div className="media-container" onClick={post.mediaType === "video" ? togglePlay : undefined}>
            {post.mediaType === "video" ? (
                <>
                    <video 
                        ref={videoRef}
                        src={post.mediaURL} 
                        loop 
                        muted 
                        playsInline
                        className="post-media" 
                    />
                    <button className="mute-btn" onClick={toggleMute}>
                        {isMuted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.88916 16L2.69145 19.1977C2.51131 19.3778 2.51131 19.6698 2.69145 19.8499L4.15033 21.3088C4.33048 21.4889 4.62243 21.4889 4.80258 21.3088L8 18.1114L5.88916 16ZM11.3333 19V21.6667C11.3333 22.0349 11.0349 22.3333 10.6667 22.3333H8C7.63181 22.3333 7.33333 22.0349 7.33333 21.6667V17.3333L11.3333 19ZM20.6667 19.3333C21.0349 19.3333 21.3333 19.6318 21.3333 20V21.3333C21.3333 21.7015 21.0349 22 20.6667 22H13.3333C12.9651 22 12.6667 21.7015 12.6667 21.3333V17.6667L20.6667 19.3333ZM19.232 4.48511L21.5149 6.76801C21.695 6.94816 21.695 7.2401 21.5149 7.42025L7.42025 21.5149C7.2401 21.695 6.94816 21.695 6.76801 21.5149L4.48511 19.232C4.30496 19.0519 4.30496 18.7599 4.48511 18.5798L18.5798 4.48511C18.7599 4.30496 19.0519 4.30496 19.232 4.48511ZM11.3333 2L13.1667 4L11.3333 6V2ZM13.3333 2H20.6667C21.0349 2 21.3333 2.29848 21.3333 2.66667V8.66667L13.3333 10.3333V2Z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.88889 16H2V8H5.88889L10 4.66667V19.3333L5.88889 16ZM12 5V19C14.8284 19 17.1421 17.1716 18.421 14.5789C18.7895 13.8421 19 13.0263 19 12.1579C19 11.2895 18.7895 10.4737 18.421 9.73684C17.1421 7.14214 14.8284 5 12 5ZM12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C11.3562 22 10.726 21.9391 10.1139 21.8219L11.1139 20.8219C11.405 20.9391 11.7001 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C11.7001 3 11.405 3.06086 11.1139 3.17805L10.1139 2.17805C10.726 2.06086 11.3562 2 12 2Z" /></svg>
                        )}
                    </button>
                    {!isPlaying && (
                        <div className="play-overlay">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.376 12.4161L8.77744 18.3042C8.41513 18.5055 7.97192 18.4011 7.7345 18.0658C7.6473 17.9423 7.60114 17.7951 7.60114 17.644V5.86794C7.60114 5.45373 7.93693 5.11794 8.35114 5.11794C8.50222 5.11794 8.64938 5.16411 8.77293 5.25131L19.3715 12.7483C19.7067 12.9857 19.7828 13.4503 19.5454 13.7856C19.4999 13.8497 19.4431 13.9065 19.379 13.952L19.376 12.4161Z" /></svg>
                        </div>
                    )}
                </>
            ) : (
                <img src={post.mediaURL || post.imgURL} alt="" className="post-media" />
            )}
        </div>
        
        <div className="icons">
            <div className="left">
                {/* LIKE */}
                <button onClick={handleLike} className="icon-group">
                    <svg className={isLiked ? "liked" : ""} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z" />
                    </svg>
                    <span className="count-badge">{likeCount}</span>
                </button>
                
                {/* COMMENT */}
                <button onClick={() => setShowAllComments(true)} className="icon-group">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5.76282 17H20V5H4V18.3851L5.76282 17ZM6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455Z" />
                    </svg>
                    <span className="count-badge">{commentCount}</span>
                </button>
                
                {/* SEND (Placeholder) */}
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14ZM11 12H15V15.3078L20.3214 11L15 6.69224V10H13C10.5795 10 8.41011 11.0749 6.94312 12.7735C8.20873 12.2714 9.58041 12 11 12Z" />
                    </svg>
                </button>
            </div>
            
            <div className="right">
                {/* BOOKMARK */}
                <button onClick={handleBookmark}>
                    <svg className={isBookmarked ? "liked" : ""} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z" />
                    </svg>
                </button>
            </div>
        </div>

        <div className="bottom">
            <p className="caption"><strong>{user.username}</strong> {post.caption}</p>
            
            {/* View all comments toggle */}
            {localComments.length > 2 && (
                <button 
                    onClick={() => setShowAllComments(true)}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', padding: '0.5rem 0', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', margin: 0}}
                >
                    View all {localComments.length} comments
                </button>
            )}

            {/* Display single tiny preview comment on feed instead of pushing boundaries */}
            {localComments.length > 0 && !showAllComments && (
                <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.3rem' }}>
                    {displayedComments.map(c => (
                        <p key={c._id} style={{ margin: 0, fontSize: '0.9rem' }}>
                            <strong style={{ opacity: 0.9 }}>{c.user?.username}</strong> <span style={{ opacity: 0.7 }}>{c.text}</span>
                        </p>
                    ))}
                </div>
            )}
        </div>   

        {/* The New Fullscreen Glassmorphic Comments Section */}
        {showAllComments && (
             <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(20px)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Modal Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <h2 style={{margin: 0, fontSize: '1.2rem', color: 'white'}}>Comments</h2>
                    <button 
                        onClick={() => setShowAllComments(false)}
                        style={{background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '35px', height: '35px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable Comments Thread */}
                <div style={{
                    flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem'
                }}>
                    {localComments.length === 0 ? (
                        <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem'}}>No comments yet. Be the first!</div>
                    ) : (
                        localComments.map(c => (
                            <div key={c._id} style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
                                <div style={{width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(135deg, #A88BEB 0%, #F8CEEC 100%)', flexShrink: 0}} />
                                <div>
                                    <span style={{fontWeight: 'bold', color: 'white', marginRight: '0.5rem', fontSize: '0.95rem'}}>{c.user?.username}</span>
                                    <span style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: '1.4'}}>{c.text}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input Area anchored to bottom */}
                <div style={{
                    padding: '1.5rem',
                    background: '#0A0A0F',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                     <form onSubmit={handleCommentSubmit} style={{display: 'flex', gap: '1rem'}}>
                        <input 
                            type="text" 
                            placeholder="Add a comment..." 
                            value={commentText} 
                            onChange={e => setCommentText(e.target.value)} 
                            autoFocus
                            style={{
                                flex: 1, padding: '1rem 1.2rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
                            }}
                        />
                        <button 
                            type="submit" 
                            disabled={!commentText.trim()}
                            style={{
                                background: commentText.trim() ? '#A88BEB' : 'rgba(255,255,255,0.1)',
                                color: commentText.trim() ? '#0A0A0F' : 'rgba(255,255,255,0.3)',
                                border: 'none', borderRadius: '100px', padding: '0 1.5rem', fontWeight: 'bold', cursor: commentText.trim() ? 'pointer' : 'not-allowed', transition: '0.2s'
                            }}
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default Post