import { useEffect, useState } from 'react'
import { useAuth } from '../context/login'
import { ENDPOINTS } from '../App'

export default function Friends() {
  const { apiFetch } = useAuth()
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState([])
  const [sent, setSent] = useState({})
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [requestsError, setRequestsError] = useState('')
  const [error, setError] = useState('')
  const [acceptingId, setAcceptingId] = useState(null)

  useEffect(() => {
    apiFetch(ENDPOINTS.users)
      .then((data) => setUsers(Array.isArray(data) ? data : data.users || []))
      .catch((err) => setError(err.message))

    // Load requests sent to the logged-in user
    apiFetch(ENDPOINTS.friendRequests)
      .then((data) => setRequests(Array.isArray(data) ? data : data.requests || []))
      .catch((err) => setRequestsError(err.message))
      .finally(() => setRequestsLoading(false))
  }, [])

  async function sendRequest(userId) {
    setError('')
    try {
      await apiFetch(ENDPOINTS.friends, {
        method: 'POST',
        body: JSON.stringify({ friendId: userId }),
      })
      setSent((current) => ({ ...current, [userId]: true }))
    } catch (err) {
      setError(err.message)
    }
  }

  async function acceptRequest(requestId) {
    setError('')
    setAcceptingId(requestId)
    try {
      await apiFetch(ENDPOINTS.acceptFriend(requestId), {
        method: 'PATCH',
      })
      setRequests((current) => current.filter((request) => request.id !== requestId))
    } catch (err) {
      setError(err.message)
    } finally {
      setAcceptingId(null)
    }
  }

  return (
    <div>
      <h1>Friends</h1>
      {error && <p>{error}</p>}

      <h2>Pending requests</h2>
      {requestsLoading ? (
        <p>Loading requests...</p>
      ) : requestsError ? (
        <p>Could not load requests: {requestsError}</p>
      ) : requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              {request.requester}{' '}
              <button
                onClick={() => acceptRequest(request.id)}
                disabled={acceptingId === request.id}
              >
                {acceptingId === request.id ? 'Accepting...' : 'Accept'}
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>People</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username || user.email}{' '}
            <button
              onClick={() => sendRequest(user.id)}
              disabled={Boolean(sent[user.id])}
            >
              {sent[user.id] ? 'Request sent' : 'Send request'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}