import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Layout from './Layout.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Upload from './upload.jsx';
import { History, LikedVideos, Subscriptions, Playlists, PlaylistDetail, Notifications, Channel } from './FeaturePages.jsx';
import './index.css';
import './App.css';
import './yt.css';

createRoot(document.getElementById('root')).render(<StrictMode><BrowserRouter><Routes><Route element={<Layout/>}><Route path="/" element={<App/>}/><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/><Route path="/watch/:id" element={<VideoPlayer/>}/><Route path="/upload" element={<Upload/>}/><Route path="/history" element={<History/>}/><Route path="/liked-videos" element={<LikedVideos/>}/><Route path="/watch-later" element={<Playlists/>}/><Route path="/subscriptions" element={<Subscriptions/>}/><Route path="/playlists" element={<Playlists/>}/><Route path="/playlists/:id" element={<PlaylistDetail/>}/><Route path="/notifications" element={<Notifications/>}/><Route path="/channel/:username" element={<Channel/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes></BrowserRouter></StrictMode>);
