import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./main.css"
import App from './App.jsx'
import UserProvider from './Context/AuthContext.jsx'
import GroupProvider from './Context/GroupContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <GroupProvider>
        <App />
      </GroupProvider>
    </UserProvider>
  </StrictMode>,
)
