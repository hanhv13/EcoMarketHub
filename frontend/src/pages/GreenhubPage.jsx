import { useState, useEffect } from 'react'
import { getEventsAPI } from '../api/events'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function GreenhubPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await getEventsAPI()
      setEvents(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }



  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="container page">
      <header style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>🌿 GreenHub Events</h1>
          <p style={styles.pageSubtitle}>Join our community events for a greener future!</p>
        </div>
      </header>

      <div style={styles.eventGrid}>
        {events.map(event => (
          <div key={event.id} style={{...styles.eventCard, cursor: 'pointer'}} onClick={() => setSelectedEvent(event)}>
            <div style={styles.imageWrapper}>
              <img 
                src={event.image_url || 'https://placehold.co/600x400?text=Event'} 
                alt={event.title} 
                style={styles.eventImage}
              />
              <div style={styles.dateBadge}>
                {new Date(event.event_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              </div>
            </div>
            <div style={styles.eventInfo}>
              <h3 style={styles.eventTitle}>{event.title}</h3>
              <p style={styles.eventMeta}>📍 {event.location}</p>
              <p style={styles.eventDesc}>{event.description}</p>
              <div style={styles.eventFooter}>
                <span style={styles.creator}>By {event.creator_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div style={{textAlign: 'center', padding: '60px 0'}}>
          <p style={{color: '#6b7280'}}>No events found. Stay tuned!</p>
        </div>
      )}


      {/* Modal for Event Details */}
      {selectedEvent && (
        <div style={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
          <div style={{...styles.modalContent, maxWidth: '600px'}} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#16a34a' }}>Event Details</h2>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            
            <img 
              src={selectedEvent.image_url || 'https://placehold.co/600x400?text=Event'} 
              alt={selectedEvent.title} 
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }}
            />
            
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>{selectedEvent.title}</h3>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', color: '#6b7280', fontSize: '15px' }}>
              <span>📍 {selectedEvent.location}</span>
              <span>📅 {new Date(selectedEvent.event_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
            
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#4b5563', marginBottom: '24px' }}>
              {selectedEvent.description}
            </p>
            
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af' }}>Organized by {selectedEvent.creator_name}</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div 
                  style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', opacity: 0.8 }} 
                >
                  📸 Scan QR at Event Location
                </div>
                <button 
                  style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }} 
                  onClick={() => alert('Registering for event...')}
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  pageTitle: { fontSize: '32px', color: '#16a34a', margin: 0 },
  pageSubtitle: { color: '#6b7280', marginTop: '4px' },
  btnCreate: { backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  eventGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  eventCard: { backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
  imageWrapper: { position: 'relative', height: '200px' },
  eventImage: { width: '100%', height: '100%', objectFit: 'cover' },
  dateBadge: { position: 'absolute', top: '16px', right: '16px', backgroundColor: '#fff', padding: '8px 12px', borderRadius: '8px', textAlign: 'center', fontWeight: '700', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  eventInfo: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' },
  eventTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1f2937' },
  eventMeta: { fontSize: '14px', color: '#6b7280', marginBottom: '12px' },
  eventDesc: { fontSize: '15px', color: '#4b5563', lineHeight: '1.5', flex: 1, marginBottom: '20px' },
  eventFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '16px' },
  creator: { fontSize: '13px', color: '#9ca3af' },
  btnDelete: { color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#fff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '16px' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '16px', minHeight: '100px', resize: 'vertical' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  btnCancel: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' },
  btnSubmit: { padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: '600', cursor: 'pointer' }
}
