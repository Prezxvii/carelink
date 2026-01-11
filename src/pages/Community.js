// src/pages/Community.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Send, Newspaper, Plus, BadgeCheck, PlayCircle,
  ExternalLink, Heart, MessageCircle, TrendingUp, X, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import './Community.css';

import MOCK_VIDEOS from '../data/mockVideos';
import MOCK_LIVE_FEED from '../data/mockLiveFeed';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Community = () => {
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [nycResources, setNycResources] = useState(MOCK_LIVE_FEED);
  const [userPosts, setUserPosts] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  const [newsPage, setNewsPage] = useState(1);
  const [hasMoreNews, setHasMoreNews] = useState(true);
  const [videoPageToken, setVideoPageToken] = useState(null);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [ytQuota, setYtQuota] = useState({ exceeded: false, message: '' });
  const [newMessage, setNewMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareForm, setShareForm] = useState({
    title: '',
    description: '',
    link: '',
    type: 'resource'
  });

  const NEWS_PAGE_SIZE = 6;
  const VIDEO_PAGE_SIZE = 6;

  const openVideo = useCallback((video) => setActiveVideo(video), []);
  const closeVideo = useCallback(() => setActiveVideo(null), []);

  // ✅ Grab a URL from either "link" OR "url" (supports MOCK_LIVE_FEED)
  const getItemUrl = useCallback((item) => item?.link || item?.url || '', []);

  // ✅ Normalize & validate URLs (adds https:// when missing)
  const normalizeUrl = useCallback((raw) => {
    if (!raw) return null;

    const trimmed = String(raw).trim();
    if (!trimmed) return null;

    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    try {
      return new URL(withProtocol).toString();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeVideo();
    };
    if (activeVideo) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeVideo, closeVideo]);

  const fetchNews = useCallback(async (page = 1) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/content/news?page=${page}&limit=${NEWS_PAGE_SIZE}`
      );
      if (!res.ok) throw new Error('News failed');
      const data = await res.json();
      const incoming = data.articles || [];

      setNews((prev) => (page === 1 ? incoming : [...prev, ...incoming]));
      setHasMoreNews(incoming.length === NEWS_PAGE_SIZE);
    } catch (err) {
      console.error('News Error:', err);
    }
  }, []);

  const applyVideoFallback = useCallback((message) => {
    setYtQuota({ exceeded: true, message: message || 'Showing guides.' });
    setVideos(MOCK_VIDEOS);
    setVideoPageToken(null);
  }, []);

  const fetchVideos = useCallback(
    async (reset = false) => {
      setIsLoadingVideos(true);
      try {
        const token = reset ? '' : videoPageToken || '';
        const res = await fetch(
          `${API_BASE_URL}/api/content/videos?limit=${VIDEO_PAGE_SIZE}&pageToken=${token}`
        );

        if (!res.ok) {
          applyVideoFallback('Video service unavailable.');
          return;
        }

        const data = await res.json();
        const items = data.items || [];
        setVideos((prev) => (reset ? items : [...prev, ...items]));
        setVideoPageToken(data.nextPageToken || null);
      } catch (err) {
        applyVideoFallback('Error loading videos.');
      } finally {
        setIsLoadingVideos(false);
      }
    },
    [videoPageToken, applyVideoFallback]
  );

  useEffect(() => {
    fetchNews(1);
    fetchVideos(true);
  }, [fetchNews, fetchVideos]);

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

    setUserPosts((prev) => [post, ...prev]);
    setNewMessage('');
  };

  const toggleLike = (id) => {
    const updater = (list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
              isLiked: !item.isLiked
            }
          : item
      );

    setNycResources((prev) => updater(prev));
    setUserPosts((prev) => updater(prev));
  };

  const addComment = (id) => {
    if (!commentInputs[id]?.trim()) return;

    const newComment = {
      id: Date.now(),
      user: 'You',
      text: commentInputs[id],
      time: 'Just now'
    };

    const updater = (list) =>
      list.map((item) =>
        item.id === id ? { ...item, comments: [...item.comments, newComment] } : item
      );

    setNycResources((prev) => updater(prev));
    setUserPosts((prev) => updater(prev));
    setCommentInputs((prev) => ({ ...prev, [id]: '' }));
  };

  const handleShareResource = (e) => {
    e.preventDefault();

    if (!shareForm.title.trim()) return;

    const newResource = {
      id: Date.now(),
      type: 'resource',
      user: 'You',
      title: shareForm.title,
      text: shareForm.description,
      // ✅ store as link (your feed supports link/url either way)
      link: shareForm.link,
      time: 'Just now',
      likes: 0,
      isLiked: false,
      comments: []
    };

    setNycResources((prev) => [newResource, ...prev]);
    setShowShareModal(false);
    setShareForm({ title: '', description: '', link: '', type: 'resource' });
  };

  const filteredFeed = useMemo(() => {
    let combined = [...nycResources, ...userPosts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      combined = combined.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.text?.toLowerCase().includes(q)
      );
    }

    return combined;
  }, [nycResources, userPosts, searchQuery]);

  return (
    <PageWrapper>
      <div className="community-page">
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
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>{activeVideo.snippet.title}</h2>
                  <button onClick={closeVideo} aria-label="Close video modal">
                    <X />
                  </button>
                </div>

                <div className="video-embed">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.id.videoId}?autoplay=1`}
                    title="video"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {showShareModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
            >
              <motion.div
                className="modal-content share-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Share a Resource</h2>
                  <button onClick={() => setShowShareModal(false)} aria-label="Close share modal">
                    <X />
                  </button>
                </div>

                <form onSubmit={handleShareResource} className="share-form">
                  <div className="form-group">
                    <label htmlFor="resource-title">Title *</label>
                    <input
                      id="resource-title"
                      type="text"
                      placeholder="e.g., Free Medical Clinic in Brooklyn"
                      value={shareForm.title}
                      onChange={(e) => setShareForm({ ...shareForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="resource-description">Description</label>
                    <textarea
                      id="resource-description"
                      placeholder="Tell the community about this resource..."
                      value={shareForm.description}
                      onChange={(e) => setShareForm({ ...shareForm, description: e.target.value })}
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="resource-link">Link (Optional)</label>
                    <input
                      id="resource-link"
                      type="url"
                      placeholder="https://example.com"
                      value={shareForm.link}
                      onChange={(e) => setShareForm({ ...shareForm, link: e.target.value })}
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowShareModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      <Plus size={18} /> Share Resource
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="community-header">
          <h1>
            Care<span>Link</span> Community
          </h1>

          <button
            className="post-resource-btn"
            onClick={() => setShowShareModal(true)}
          >
            <Plus size={18} /> Share a Resource
          </button>
        </header>

        <div className="community-grid">
          <section className="chat-section">
            <div className="chat-tabs">
              <button className="active">
                <TrendingUp size={16} /> Live Feed
              </button>

              <input
                className="feed-search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="chat-container">
              <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
                <input
                  placeholder="Ask a question..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn">
                  <Send size={18} />
                </button>
              </form>

              <div className="chat-messages">
                {filteredFeed.map((item) => {
                  const resourceUrl = normalizeUrl(getItemUrl(item));
                  const isVisitable = Boolean(getItemUrl(item)); // if they provided *something*
                  const hasValidUrl = Boolean(resourceUrl);

                  return (
                    <div key={item.id} className={`chat-bubble enhanced ${item.type}`}>
                      <div className="bubble-header">
                        <span className="user-name">
                          {item.user}{' '}
                          {item.isExpert && (
                            <BadgeCheck size={14} className="expert-badge" />
                          )}
                        </span>
                      </div>

                      {item.title && (
                        hasValidUrl ? (
                          <a
                            className="feed-title-link"
                            href={resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open resource"
                          >
                            <h4 className="feed-title">{item.title}</h4>
                          </a>
                        ) : (
                          <h4 className="feed-title">{item.title}</h4>
                        )
                      )}

                      <p className="feed-text">{item.text}</p>

                      <div className="bubble-actions">
                        <button
                          className={`action-btn ${item.isLiked ? 'liked' : ''}`}
                          onClick={() => toggleLike(item.id)}
                        >
                          <Heart
                            size={16}
                            fill={item.isLiked ? 'currentColor' : 'none'}
                          />{' '}
                          {item.likes}
                        </button>

                        <button
                          className="action-btn"
                          onClick={() => {
                            const newSet = new Set(expandedComments);
                            newSet.has(item.id)
                              ? newSet.delete(item.id)
                              : newSet.add(item.id);
                            setExpandedComments(newSet);
                          }}
                        >
                          <MessageCircle size={16} /> {item.comments?.length || 0}
                        </button>

                        {/* ✅ Show for ANY item that includes link/url (NYC + user + resource) */}
                        {isVisitable && (
                          <a
                            href={resourceUrl || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn resource-link-btn"
                            aria-disabled={!hasValidUrl}
                            onClick={(e) => {
                              if (!hasValidUrl) e.preventDefault();
                            }}
                            title={hasValidUrl ? 'Visit resource' : 'Invalid or missing URL'}
                          >
                            <ExternalLink size={16} /> Visit
                          </a>
                        )}
                      </div>

                      {expandedComments.has(item.id) && (
                        <div className="comments-section">
                          {item.comments?.map((c) => (
                            <div key={c.id} className="comment-item">
                              <strong>{c.user}:</strong> {c.text}
                            </div>
                          ))}

                          <div className="comment-input-wrapper">
                            <input
                              placeholder="Comment..."
                              value={commentInputs[item.id] || ''}
                              onChange={(e) =>
                                setCommentInputs({
                                  ...commentInputs,
                                  [item.id]: e.target.value
                                })
                              }
                            />
                            <button type="button" onClick={() => addComment(item.id)}>
                              <Send size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="community-sidebar">
            <div className="sidebar-group">
              <div className="sidebar-section-header">
                <Newspaper size={18} /> <h3>News</h3>
              </div>

              {news.map((article, i) => (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="news-card-visual"
                >
                  <div className="news-card-body">
                    <h4>{article.title}</h4>
                    <span className="news-link">
                      Read <ExternalLink size={12} />
                    </span>
                  </div>
                </a>
              ))}

              {hasMoreNews && (
                <button
                  className="sidebar-loadmore"
                  onClick={() => {
                    const p = newsPage + 1;
                    setNewsPage(p);
                    fetchNews(p);
                  }}
                >
                  Load More
                </button>
              )}
            </div>

            <div className="sidebar-group">
              <div className="sidebar-section-header">
                <PlayCircle size={18} /> <h3>Guides</h3>
              </div>

              {ytQuota.exceeded && (
                <div className="quota-banner">
                  <AlertCircle size={14} /> {ytQuota.message}
                </div>
              )}

              <div className="video-grid">
                {videos.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    className="video-card"
                    onClick={() => openVideo(v)}
                    aria-label={`Open video: ${v?.snippet?.title || 'Video'}`}
                  >
                    <img src={v.snippet.thumbnails.medium.url} alt="thumb" />
                    <h5>{v.snippet.title}</h5>
                  </button>
                ))}
              </div>

              {isLoadingVideos && <div className="loading-spinner" />}
            </div>
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Community;
