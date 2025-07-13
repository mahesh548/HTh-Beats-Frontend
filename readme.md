<p align="center">
  <img src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748345555/logo_s03jy9.png" alt="HTh Beats Logo" width="200"/>
</p>

<h1 align="center">HTh Beats — Frontend</h1>
<p align="center"><i>A sleek, responsive Spotify clone frontend built with React + Custom CSS + Bootstrap</i></p>

<p align="center">
  <a href="https://hthbeats.online"><img src="https://img.shields.io/badge/Live Demo-Click Here-blue?style=for-the-badge&logo=cloudflare" /></a>
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Custom_CSS-%23f7f7f7?style=for-the-badge&logo=css3&logoColor=blue" />
  <img src="https://img.shields.io/badge/Partial-Bootstrap-7952B3?style=for-the-badge&logo=bootstrap" />
  <img src="https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

> A professional, responsive frontend for HTh Beats – a full-featured Spotify clone. Built using **React**, styled with **custom CSS** and selected **Bootstrap components**, this UI delivers a complete streaming experience across devices.

---

## 📱 Preview

<table>
  <tr>
    <td><img src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1749318396/screenshot1_qnop7b.png" alt="Screen 1" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1749318394/screenshot2_xussnc.png" alt="Screen 2" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1749318418/screenshot3_b8uora.png" alt="Screen 3" width="200"/></td>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1749318428/screenshot4_gggycg.png" alt="Screen 4" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1749318398/screenshot5_z72cyt.png" alt="Screen 5" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1749318409/screenshot6_bduje6.png" alt="Screen 6" width="200"/></td>
  </tr>
</table>

---

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-Click%20Here-blue?style=for-the-badge)](https://hthbeats.online)

## 🚀 Features

- 🔐 JWT-based user authentication
- 🎵 Stream songs, albums, artists, and playlists
- 👥 Enjoy with your friends in music room and listen track together in sync
- 💾 Playlist creation & management
- 🔍 Real-time search across the platform
- 🖼 Profile image uploads with Cloudinary
- 🎧 Functional and interactive music player
- 📱 Responsive layout
- ⬇️ Fast and high quality audio download

---

## 🧠 Tech Stack

| Layer       | Tech Used                                             |
| ----------- | ----------------------------------------------------- |
| Framework   | React.js                                              |
| Styling     | Custom CSS, Bootstrap (partial)                       |
| Media       | Cloudinary (for profile images)                       |
| Requests    | Axios                                                 |
| WebSocket   | Ably (for real-time interactions)                     |
| Routing     | React Router DOM                                      |
| State Mgmt  | React Hooks, LocalStorage, App-level Context API      |
| UI Behavior | URL-based UI state (modals, drawers, etc. via params) |

---

## 🛠️ Installation

```bash
# Clone this repo
git clone https://github.com/mahesh548/HTh-Beats-Frontend

cd HTh-Beats-Frontend

# Install dependencies
npm install --force

# Start the dev server
npm run dev
```

<h2>🔐 Environment Variables</h2>

<p>Create a <code>.env</code> file at the root of the project and add the following:</p>

<pre>
VITE_API=&lt;url_to_hthbeats_api&gt;
VITE_BACKEND=&lt;url_to_hthbeats_backend&gt;
META_SECRET=&lt;your_meta_secret_here&gt;
</pre>

<p><b>Note:</b> These values are required for API communication and secure metadata fetching from the Vercel Edge Function.</p>

## 💡 What I Learned

- Mastered React fundamentals including **state management**, **context API**, and **component-based architecture**.
- Built complex **custom components** with efficient **conditional rendering** and reusable logic.
- Implemented secure **authentication workflows** and managed user sessions effectively.
- Developed responsive layouts combining **custom CSS** and **Bootstrap** for a polished UI across devices.
- Integrated and handled API requests smoothly using **Axios**, including error handling and async flows.
- Leveraged **Ably** for real-time communication, enabling live updates and synchronized user experiences.
- Gained hands-on experience deploying React apps on **Vercel**, including environment variable management and production optimizations.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork this repository and submit a pull request.

If you find a bug or want to suggest an improvement, please open an issue.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).  
You're free to use, modify, and distribute this project with proper attribution.

---

> ⚠️ **Disclaimer:**  
> This project, **HTh Beats**, is a personal portfolio project built solely for learning and showcasing frontend and full-stack development skills.  
> It is **not affiliated with JioSaavn**, Spotify, or any other music streaming service.  
> All audio content and media used within the app are **sourced from publicly accessible JioSaavn URLs** and are **not hosted or stored by the developer**.  
> This project is **not intended for commercial use**, distribution, or monetization.
