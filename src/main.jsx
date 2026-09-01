import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@styles/index.css'
import '@styles/quiz.css'
import '@styles/features.css'
import '@styles/daily-task.css'
import '@styles/enhancements.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)