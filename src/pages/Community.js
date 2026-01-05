// src/pages/Community.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Send, Newspaper, Plus, ChevronRight, BadgeCheck, Filter, PlayCircle,
  ExternalLink, Heart, MessageCircle, TrendingUp, X, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import './Community.css';

// ✅ Real YouTube IDs + real thumbnails (fallback data)
import MOCK_VIDEOS from '../data/mockVideos';

// ✅ Mock Live Feed resources (20 items)
import MOCK_LIVE_FEED from '../data/mockLiveFeed';

const Community = () => {
  // --- Content States ---
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  // Initialize directly with Mock Data to avoid unnecessary useEffect logic
  const [nycResources, setNycResources] = useState(MOCK_LIVE_FEED);
  const [userPosts, setUserPosts] = useState([]);

  // ✅ inline video player modal state
  const [activeVideo, setActiveVideo] = useState(null);

  // --- Pagination & Loading ---
  const [newsPage, setNewsPage] = useState(1);
  const [hasMoreNews, setHasMoreNews] = useState(true);

  const [videoPageToken, setVideoPageToken] = useState(null);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [ytQuota, setYtQuota] = useState({ exceeded: false, message: '' });

  const [isLoadingNYC] = useState(false); // Kept for UI logic, but simplified
  const [newMessage, setNewMessage] = useState('');

  // --- UI Control States ---
  const [resourceFilter, setResourceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareForm, setShareForm] = useState({ title: '', category: '', description: '', url: '' });
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});

  const NEWS_PAGE_SIZE = 6;
  const VIDEO_PAGE_SIZE = 6;

  // ✅ modal helpers + background scroll lock
  const openVideo = useCallback((video) => setActiveVideo(video), []);
  const closeVideo = useCallback(() => setActiveVideo(null), []);

  useEffect(() => {
    if (!activeVideo) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [activeVideo]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeVideo();
    };
    if (activeVideo) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeVideo, closeVideo]);

  // --- Data Fetching Logic ---

  // 1. News API
  const fetchNews = useCallback(async (page = 1) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/content/news?page=${page}&limit=${NEWS_PAGE_SIZE}`
      );

      if (!res.ok) throw new Error(`News request failed: ${res.status}`);

      const data = await res.json();
      const incoming = data.articles || [];

      setNews(prev => (page === 1 ? incoming : [...prev, ...incoming]));
      setHasMoreNews(incoming.length === NEWS_PAGE_SIZE);
    } catch (err) {
      console.error('News Error:', err);
    }
  }, []);

  // ✅ YouTube fallback
  const applyVideoFallback = useCallback((message) => {
    setYtQuota({ exceeded: true, message: message || 'Showing helpful video guides.' });
    setVideos(MOCK_VIDEOS);
    setVideoPageToken(null);
  }, []);

  // 2. YouTube (via your Backend) + fallback
  const fetchVideos = useCallback(
    async (reset = false) => {
      setIsLoadingVideos(true);
      try {
        const token = reset ? '' : (videoPageToken || '');
        const res = await fetch(
          `http://localhost:5000/api/content/videos?limit=${VIDEO_PAGE_SIZE}&pageToken=${token}`
        );

        if (res.status === 403) {
          applyVideoFallback('Daily YouTube limit reached. Showing guides.');
          return;
        }

        if (!res.ok) {
          applyVideoFallback('Video service is unavailable right now. Showing guides.');
          return;
        }

        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        
        if (items.length === 0 && reset) {
          applyVideoFallback('No videos returned yet. Showing guides.');
          return;
        }

        setYtQuota({ exceeded: false, message: '' });
        setVideos(prev => (reset ? items : [...prev, ...items]));
        setVideoPageToken(data.nextPageToken || null);
      } catch (err) {
        console.error('Video Error:', err);
        applyVideoFallback('Couldn’t load videos. Showing guides.');
      } finally {
        setIsLoadingVideos(false);
      }
    },
    [videoPageToken, applyVideoFallback]
  );

  // ✅ Guaranteed mock live feed + keep news/videos loading
  useEffect(() => {
    fetchNews(1);
    fetchVideos(true);
  }, [fetchNews, fetchVideos]);

  // --- Handlers ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const post = {
      id: Date.now(),
      type: 'user',
      user: 'You',
      text: newMessage,
      time: 'Just now',
      likes: 0,
      isLiked: false,
      comments: []
    };

    setUserPosts(prev => [post, ...prev]);
    setNewMessage('');
  };

  const toggleLike = (id) => {
    const updater = (list) =>
      list.map(item =>
        item.id === id
          ? {
              ...item,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
              isLiked: !item.isLiked
            }
          : item
      );

    setNycResources(prev => updater(prev));
    setUserPosts(prev => updater(prev));
  };

  const addComment = (id) => {
    if (!commentInputs[id]?.trim()) return;

    const newComment = { id: Date.now(), user: 'You', text: commentInputs[id], time: 'Just now' };
    const updater = (list) =>
      list.map(item => (item.id === id ? { ...item, comments: [...item.comments, newComment] } : item));

    setNycResources(prev => updater(prev));
    setUserPosts(prev => updater(prev));
    setCommentInputs(prev => ({ ...prev, [id]: '' }));
  };

  // Combined and Filtered Feed
  const filteredFeed = useMemo(() => {
    let combined = [...nycResources, ...userPosts];

    if (resourceFilter !== 'all') combined = combined.filter(i => i.type === resourceFilter);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      combined = combined.filter(
        i => i.title?.toLowerCase().includes(q) || i.text?.toLowerCase().includes(q)
      );
    }

    return combined;
  }, [nycResources, userPosts, resourceFilter, searchQuery]);

  return (
    <PageWrapper>
      <div className="community-page">
        {/* ✅ Video Player Modal */}
        <AnimatePresence>
          {activeVideo && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeVideo}
            >
              <motion.div
                className="modal-content video-modal"
                initial={{ y: 18, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 10, opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>{activeVideo.snippet.title}</h2>
                  <button onClick={closeVideo} aria-label="Close video">
                    <X />
                  </button>
                </div>

                <div className="video-embed">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.id.videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={activeVideo.snippet.title}
                    frameBorder="0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <a
                  className="feed-link-btn"
                  href={`https://youtube.com/watch?v=${activeVideo.id.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginTop: 14, display: 'inline-flex' }}
                >
                  <ExternalLink size={14} /> Open on YouTube
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Share a Resource</h2>
                  <button onClick={() => setShowShareModal(false)} aria-label="Close share modal">
                    <X />
                  </button>
                </div>

                <form
                  className="share-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    /* submit logic */
                  }}
                >
                  <input
                    placeholder="Title"
                    required
                    onChange={e => setShareForm({ ...shareForm, title: e.target.value })}
                  />
                  <select
                    required
                    onChange={e => setShareForm({ ...shareForm, category: e.target.value })}
                  >
                    <option value="">Category</option>
                    <option value="housing">Housing</option>
                    <option value="food">Food</option>
                  </select>
                  <textarea
                    placeholder="How can this help others?"
                    required
                    onChange={e => setShareForm({ ...shareForm, description: e.target.value })}
                  />
                  <button type="submit" className="submit-share-btn">
                    Post to Feed
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="community-header">
          <h1>
            Care<span>Link</span> Community
          </h1>
          <p className="header-subtitle">Real-time resources from the NYC Database and Community</p>
          <button className="post-resource-btn" onClick={() => setShowShareModal(true)}>
            <Plus size={18} /> Share a Resource
          </button>
        </header>

        <div className="community-grid">
          {/* Main Feed Section */}
          <section className="chat-section">
            <div className="chat-tabs">
              <button className="active">
                <TrendingUp size={16} /> Live Feed
              </button>

              <div className="feed-controls">
                <div className="feed-filter-inline">
                  <Filter size={14} />
                  <select value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value)}>
                    <option value="all">All Items</option>
                    <option value="nyc">Official Data</option>
                    <option value="user">Community Posts</option>
                  </select>
                </div>

                <input
                  className="feed-search-input"
                  placeholder="Search resources..."
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="chat-container">
              <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
                <input
                  placeholder="Ask the community a question..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn" aria-label="Send message">
                  <Send size={18} />
                </button>
              </form>

              <div className="chat-messages">
                {isLoadingNYC ? (
                  <div className="loading-card">
                    <div className="loading-spinner" />
                  </div>
                ) : (
                  filteredFeed.map(item => (
                    <div key={item.id} className={`chat-bubble enhanced ${item.type}`}>
                      <div className="bubble-header">
                        <span className="user-name">
                          {item.user}{' '}
                          {item.isExpert && <BadgeCheck size={14} className="expert-badge" />}
                        </span>
                        <span className="msg-time">{item.time}</span>
                      </div>

                      {item.title && <h4 className="feed-title">{item.title}</h4>}
                      <p className="feed-text">{item.text}</p>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="feed-link-btn"
                        >
                          <ExternalLink size={14} /> Open Resource
                        </a>
                      )}

                      <div className="bubble-actions">
                        <button
                          className={`action-btn ${item.isLiked ? 'liked' : ''}`}
                          onClick={() => toggleLike(item.id)}
                          type="button"
                        >
                          <Heart size={16} fill={item.isLiked ? 'currentColor' : 'none'} />{' '}
                          {item.likes}
                        </button>

                        <button
                          className="action-btn"
                          type="button"
                          onClick={() => {
                            const newSet = new Set(expandedComments);
                            newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
                            setExpandedComments(newSet);
                          }}
                        >
                          <MessageCircle size={16} /> {item.comments.length}
                        </button>
                      </div>

                      {expandedComments.has(item.id) && (
                        <div className="comments-section">
                          {item.comments.map(c => (
                            <div key={c.id} className="comment-item">
                              <strong>{c.user}:</strong> {c.text}
                            </div>
                          ))}

                          <div className="comment-input-wrapper">
                            <input
                              placeholder="Write a comment..."
                              value={commentInputs[item.id] || ''}
                              onChange={e =>
                                setCommentInputs({ ...commentInputs, [item.id]: e.target.value })
                              }
                            />
                            <button
                              type="button"
                              onClick={() => addComment(item.id)}
                              aria-label="Add comment"
                            >
                              <Send size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Sidebar Section */}
          <aside className="community-sidebar">
            <div className="sidebar-group">
              <div className="sidebar-section-header">
                <Newspaper size={18} /> <h3>Local Aid News</h3>
              </div>

              <div className="news-stack">
                {news.map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="news-card-visual"
                  >
                    <img src={article.urlToImage || 'https://via.placeholder.com/150'} alt="news" />
                    <div className="news-card-body">
                      <h4>{article.title}</h4>
                      <span className="news-link">
                        Read More <ChevronRight size={14} />
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {hasMoreNews && (
                <button
                  className="sidebar-loadmore"
                  onClick={() => {
                    const nextPage = newsPage + 1;
                    setNewsPage(nextPage);
                    fetchNews(nextPage);
                  }}
                  type="button"
                >
                  Load More News
                </button>
              )}
            </div>

            <div className="sidebar-group">
              <div className="sidebar-section-header">
                <PlayCircle size={18} /> <h3>Video Guides</h3>
              </div>

              {ytQuota.exceeded && (
                <div className="quota-banner">
                  <AlertCircle size={14} /> {ytQuota.message}
                </div>
              )}

              <div className="video-grid">
                {videos.map((v, i) => (
                  <button
                    key={`${v?.id?.videoId || 'vid'}-${i}`}
                    type="button"
                    className="video-card"
                    onClick={() => openVideo(v)}
                    aria-label={`Play video: ${v.snippet.title}`}
                  >
                    <div className="video-thumb-wrap">
                      <img src={v.snippet.thumbnails.medium.url} alt={v.snippet.title} />
                      <div className="video-play-overlay">
                        <PlayCircle size={44} />
                      </div>
                    </div>
                    <h5>{v.snippet.title}</h5>
                  </button>
                ))}
              </div>

              {isLoadingVideos && (
                <div className="loading-card" style={{ marginTop: 12 }}>
                  <div className="loading-spinner" />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Community;














