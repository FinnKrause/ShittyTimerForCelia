import ReactDOM from 'react-dom/client'
import './style/App.css'
import React from 'react'
import AppLoginWrapper from './components/AppLoginWrapper.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppLoginWrapper/>
  </React.StrictMode>
)
