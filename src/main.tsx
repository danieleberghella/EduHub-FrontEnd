import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./index.css"
import { BrowserRouter } from 'react-router-dom'
import { AlertProvider } from './contexts/AlertContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { CourseProvider } from './contexts/CourseContext.tsx'
import { TestProvider } from './contexts/TestContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AlertProvider>
      <AuthProvider>
        <CourseProvider>
          <TestProvider>
            <App />
          </TestProvider>
        </CourseProvider>
      </AuthProvider>
    </AlertProvider>
  </BrowserRouter >
)
