# HookBoard – Personal Inspiration (Pinterest-inspired)

A personal web application for saving and organizing images linked to associated PDFs. Inspired by Pinterest, it will allow creating "pins" with titles, tags, and links to cloud-hosted documents. It will include search by title or tags. Eventually, a mobile app version will be developed.

## Purpose & Learning Objectives

This project will be used to practice languages and concepts that I've learned on my degree.

## Main Planned Features

- [x] Pinterest-style card grid (responsive)
- [x] Each card displays an image + title
- [x] Clicking a card opens a dedicated page with PDF viewer
- [ ] Real-time search by title or tags
- [x] Customizable tags for categorizing pins
- [ ] Data stored in JSON (phase 1) → migration to backend with database
- [ ] Images and PDFs hosted in the cloud (Google Drive / other services)

**Future Roadmap:**
- [ ] User authentication
- [ ] Direct upload of images and PDFs
- [ ] Pin creation/editing via form
- [x] Dark/light mode
- [ ] Infinite scrolling / pagination

## Technologies I Plan to Use / Already Using

**Frontend**
- React (Vite)
- React Router (navigation)
- CSS
- Axios / fetch for API calls

**Backend** 
- Python + FastAPI / Flask
- SQLite (or PostgreSQL)
- Cloud storage integration