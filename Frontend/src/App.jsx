import { RouterProvider } from 'react-router'
import {router} from './app.routes.jsx'
import "./features/shared/global.scss"
import { AuthProvider, AuthContext } from './features/auth/auth.context.jsx'
import { PostContextProvider } from './features/posts/post.context.jsx'
import { useContext } from 'react'

const AppContent = () => {
  const { loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="initial-loader" style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A0F',
        color: '#A88BEB'
      }}>
        <div className="shimmer" style={{ width: '100px', height: '4px', borderRadius: '2px' }}></div>
      </div>
    )
  }

  return <RouterProvider router={router} />
}

function App() {
  return (
    <AuthProvider>
      <PostContextProvider>
        <AppContent />
      </PostContextProvider>
    </AuthProvider>
  )
}

export default App

