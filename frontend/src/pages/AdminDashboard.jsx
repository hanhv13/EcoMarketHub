import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('users') // users, categories, products, events
  
  // Data States
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [events, setEvents] = useState([])
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData()
    } else {
      navigate('/')
    }
  }, [user, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const res = await api.get('/api/admin/users')
        setUsers(res.data)
      } else if (activeTab === 'categories') {
        const res = await api.get('/api/categories')
        setCategories(res.data)
      } else if (activeTab === 'products') {
        const res = await api.get('/api/admin/products')
        setProducts(res.data)
      } else if (activeTab === 'events') {
        const res = await api.get('/api/events')
        setEvents(res.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // --- Users Actions ---
  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/api/admin/users/${id}/role`, { role: newRole })
      fetchData()
    } catch (err) { alert('Failed to update role') }
  }

  const handleDeleteUser = async (id) => {
    if(!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      fetchData()
    } catch (err) { alert('Failed to delete user') }
  }

  // --- Categories Actions ---
  const handleCreateCategory = async () => {
    const name = window.prompt('Enter new category name:')
    if (!name) return
    try {
      await api.post('/api/admin/categories', { name })
      fetchData()
    } catch (err) { alert('Failed to create category') }
  }

  const handleEditCategory = async (cat) => {
    const name = window.prompt('Enter new name:', cat.name)
    if (!name) return
    try {
      await api.put(`/api/admin/categories/${cat.id}`, { name })
      fetchData()
    } catch (err) { alert('Failed to edit category') }
  }

  const handleDeleteCategory = async (id) => {
    if(!window.confirm('Are you sure you want to delete this category?')) return
    try {
      await api.delete(`/api/admin/categories/${id}`)
      fetchData()
    } catch (err) { alert('Failed to delete category') }
  }

  // --- Products Actions ---
  const handleDeleteProduct = async (id) => {
    if(!window.confirm('Are you sure you want to completely remove this product?')) return
    try {
      await api.delete(`/api/admin/products/${id}`)
      fetchData()
    } catch (err) { alert('Failed to delete product') }
  }

  // --- Events Actions ---
  const handleCreateEvent = async () => {
    const title = window.prompt('Event Title:')
    if (!title) return
    const description = window.prompt('Description:')
    const location = window.prompt('Location:')
    const event_date = window.prompt('Date (YYYY-MM-DD HH:MM:SS):', new Date().toISOString().slice(0,19).replace('T', ' '))
    const image_url = window.prompt('Image URL:')

    try {
      await api.post('/api/admin/events', { title, description, location, event_date, image_url })
      fetchData()
    } catch (err) { alert('Failed to create event') }
  }

  const handleDeleteEvent = async (id) => {
    if(!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await api.delete(`/api/admin/events/${id}`)
      fetchData()
    } catch (err) { alert('Failed to delete event') }
  }

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="container page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: 'var(--brand-green)' }}>Admin Dashboard</h1>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px' }}>
        {['users', 'categories', 'products', 'events'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab ? 'var(--brand-green)' : 'var(--card-bg)',
              color: activeTab === tab ? '#fff' : 'var(--text-main)',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <select 
                      value={u.role} 
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{ padding: '4px', borderRadius: '4px', background: 'var(--bg-body)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                      disabled={u.id === user.id} // prevent self demotion
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{u.green_points}</td>
                  <td>
                    {u.id !== user.id && (
                      <button style={styles.btnDanger} onClick={() => handleDeleteUser(u.id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <>
            <button style={{...styles.btnPrimary, marginBottom: '16px'}} onClick={handleCreateCategory}>+ Create Category</button>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>
                      <button style={{...styles.btnGray, marginRight: '8px'}} onClick={() => handleEditCategory(c)}>Edit</button>
                      <button style={styles.btnDanger} onClick={() => handleDeleteCategory(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Seller</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td><Link to={`/products/${p.id}`} style={{color: 'var(--brand-green)'}}>{p.title}</Link></td>
                  <td>{p.seller_name}</td>
                  <td>{p.type}</td>
                  <td>{p.status}</td>
                  <td>
                    <button style={styles.btnDanger} onClick={() => handleDeleteProduct(p.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <>
            <button style={{...styles.btnPrimary, marginBottom: '16px'}} onClick={handleCreateEvent}>+ Create Event</button>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.title}</td>
                    <td>{e.location}</td>
                    <td>{new Date(e.event_date).toLocaleString()}</td>
                    <td>
                      <button style={styles.btnDanger} onClick={() => handleDeleteEvent(e.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      </div>
    </div>
  )
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  btnPrimary: {
    padding: '8px 16px',
    background: 'var(--brand-green)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  btnDanger: {
    padding: '6px 12px',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  btnGray: {
    padding: '6px 12px',
    background: '#6b7280',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  }
}
// global css to add to table cells later if needed, but standard table renders fine
