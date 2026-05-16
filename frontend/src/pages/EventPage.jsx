export default function EventPage() {
  return (
    <div className="container page">
      <div className="empty-state">
        <span className="icon" style={{fontSize: '80px'}}>📅</span>
        <h1 style={{color: 'var(--brand-green)', marginBottom: '16px'}}>Eco Events</h1>
        <p style={{color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '16px'}}>
          Donate your old items here to earn Green Points! 
          Join our weekly events to recycle and upcycle with the community.
        </p>
        <button className="btn btn-primary" style={{marginTop: '24px'}}>
          View Upcoming Events
        </button>
      </div>
    </div>
  )
}
