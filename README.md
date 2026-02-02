# HookBoard – Personal Inspiration (Pinterest-inspired)

A personal web application for saving and organizing images linked to associated PDFs. Inspired by Pinterest, it will allow creating "pins" with titles, tags, and links to cloud-hosted documents. It will include search by title or tags. Eventually, a mobile app version will be developed.

## Purpose & Learning Objectives

This project will be used to practice languages and concepts that I've learned on my degree.

## Main Planned Features

- [x] Pinterest-style card grid (responsive)
- [x] Each card displays an image + title
- [x] Clicking a card opens a dedicated page with PDF viewer
- [x] Dedicated details page with PDF viewer, project info, costs, and selling price
- [ ] Real-time search by title or tags
- [x] Dynamic tags with auto-generated pastel colors for categorizing pins
  - Tags are added automatically as users input them in projects
  - Colors are generated consistently per tag with variety across the spectrum
- [x] Data stored in JSON (phase 1) → migration to backend with database
- [ ] Images and PDFs hosted in the cloud (Google Drive / other services)
- [x] Timer widget on details page (start, pause, reset)
- [x] Counter widget on details page (increment, decrement, reset)
- [ ] Production cost calculator
- [ ] Yarn stock management (add/edit via form)
- [ ] Other materials stock management (add/edit via form)

**Future Roadmap:**
- [ ] User authentication
- [x] Direct upload of images and PDFs (local storage implemented)
- [x] Pin creation/editing via form
- [x] Pin deletion
- [ ] Dark/light mode toggle
- [ ] Infinite scrolling / pagination


## Technologies I Plan to Use / Already Using

**Current Implementation**
- HTML5
- CSS3 (with CSS Grid, Flexbox, custom properties for theming)
- Vanilla JavaScript (DOM manipulation)
- Python (Flask for backend) 

**Future Migration**
- React (Vite)
- React Router (navigation)
- Axios / fetch for API calls

**Backend** 
- Python + FastAPI / Flask
- SQLite (or PostgreSQL) (future implementation)
- Cloud storage integration (future implementation)