# YourNext - React + Vite

A modern, scalable frontend architecture for the YourNext adaptive quiz and roadmap system.

## 🏗️ Architecture

This project has been migrated from plain HTML/JS to **React + Vite** for better scalability and maintainability.

### Project Structure

```
src/
├── components/          # Reusable UI components
│   └── FeedbackModal.jsx
├── pages/              # Page-level components
│   ├── LandingPage.jsx    # Hero/landing screen
│   ├── OnboardingPage.jsx # Quiz interface
│   └── RoadmapPage.jsx    # Results/roadmap view
├── data/               # Static data and content
│   ├── questions.jsx      # Dynamic quiz questions with branching logic
│   └── roadmaps.js        # Roadmap data for each career path
├── hooks/              # Custom React hooks
│   ├── useQuiz.js         # Quiz state management
│   └── useRoadmap.js      # Roadmap state and step completion
├── styles/             # Global styles
│   └── index.css
├── App.jsx             # Main application component
└── main.jsx            # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Features

### Dynamic Branching Quiz
- 6-step adaptive questionnaire
- Questions branch based on previous answers
- 8 different career paths supported

### Personalized Roadmaps
- AI & Machine Learning
- Web Development
- Mobile App Development
- Cyber Security
- Data Science
- Freelancing & Online Earning
- Product Design (UI/UX)
- University CS Support

### Modern UX
- Smooth animations and transitions
- Mobile-first responsive design
- Tactile feedback for touch devices
- Glassmorphism navigation

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite 6** - Build tool and dev server
- **CSS3** - Styling (no CSS-in-JS for performance)

## 📱 Mobile Optimization

The app is optimized for mobile devices with:
- Touch-friendly tap targets
- Coarse pointer detection
- Responsive breakpoints
- Mobile-first CSS

## 🔄 Future Enhancements

This architecture supports:
- Easy addition of new career paths
- A/B testing capabilities
- Analytics integration
- Progressive Web App (PWA) conversion
- React Native mobile app migration

## 📄 License

MIT

Testing hackathon branch deployment.