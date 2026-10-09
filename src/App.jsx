import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  NavLink,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './context/login'
import Signup from './pages/signup'
import Login from './pages/login'
import Feed from './pages/feed'
import Friends from './pages/friends'

const API_URL = 'https://hibro-backend-production.up.railway.app'

export const ENDPOINTS = {
  signup: `${API_URL}/auth/signup`,
  login: `${API_URL}/auth/login`,
  posts: `${API_URL}/posts`,
  createPost: `${API_URL}/posts`,
  users: `${API_URL}/users`,
  friends: `${API_URL}/friend`,
  friendRequests: `${API_URL}/friend/requests`,
  acceptFriend: (id) => `${API_URL}/friend/${id}/accept`,
}

function RequireAuth({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function GuestOnly({ children }) {
  const { token } = useAuth()
  return token ? <Navigate to="/feed" replace /> : children
}

function Nav() {
  const { token, logout } = useAuth()

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" to={token ? '/feed' : '/login'}>
          <img src="/hibro.png" alt="" width="52" height="52" />
          <span>HiBro</span>
        </Link>

        <div className="nav-actions">
          {token ? (
            <>
              <NavLink className="nav-link" to="/feed">Feed</NavLink>
              <NavLink className="nav-link" to="/friends">Friends</NavLink>
              <button className="nav-logout" type="button" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink className="nav-link" to="/login">Log in</NavLink>
              <NavLink className="nav-link nav-link-primary" to="/signup">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />

        <main className="app-main">
          <Routes>
            <Route
              path="/signup"
              element={<GuestOnly><Signup /></GuestOnly>}
            />
            <Route
              path="/login"
              element={<GuestOnly><Login /></GuestOnly>}
            />
            <Route
              path="/feed"
              element={<RequireAuth><Feed /></RequireAuth>}
            />
            <Route
              path="/friends"
              element={<RequireAuth><Friends /></RequireAuth>}
            />
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}