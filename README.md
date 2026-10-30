# VideoTube front end (React + Vite)

YouTube-style interface: top bar with centered search, collapsible sidebar, category chips,
responsive video grid, two-column watch page, mobile bottom navigation.
Theme lives in `src/yt.css`; shared formatters in `src/format.js`.

Pages: Login, Sign up, Home feed + search, Watch page (like, subscribe, share, comments),
Upload, History, Liked videos, Playlists (+ detail), Watch later, Subscriptions,
Notifications, Channel profile.

## Run
1. `npm install`
2. Start your backend on port 8000.
3. `npm run dev`  (Vite proxies `/api` to `http://127.0.0.1:8000`, see `vite.config.js`)

## Production
Copy `.env.example` to `.env`, set `VITE_API_URL` to your backend origin, run `npm run build`.
Your backend must allow your front-end origin in CORS with `credentials: true`.

## Backend routes used (all under /api/v1)
users: register, login, logout, current-user, history, history/:id, c/:username
videos: GET /videos?search=&sortBy=&sortType=, GET /videos/:id, POST /videos (videoFile, thumbnail)
comments: GET/POST /comments/:videoId, DELETE /comments/c/:id
likes: POST /likes/videos/:id, GET /likes/videos
subscriptions: POST toggle/:channelId, GET my-channels
playlists: GET/POST /playlists, GET/DELETE /playlists/:id, GET /playlists/user/:userId
notifications: GET, PATCH read-all, PATCH :id/read

If a route differs in your backend, change it in the matching file (`src/*.jsx`); shared
request logic and token handling live in `src/api.js`.
