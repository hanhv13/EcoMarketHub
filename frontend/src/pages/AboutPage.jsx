export default function AboutPage() {
  return (
    <div className="container page" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#16a34a' }}>About Us</h1>
      <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '40px', color: '#4b5563' }}>
        EcoMarket Hub is a platform built with the goal of reducing waste and encouraging everyone to recycle and exchange old goods. We believe that every item has a second life, and sharing them will create a greener, more sustainable community.
      </p>
      
      <h2 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>Our Team</h2>
      <ul style={{ listStyleType: 'none', padding: 0, fontSize: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <li style={styles.memberItem}>👨‍💻 Nguyen Hung</li>
        <li style={styles.memberItem}>👩‍💻 Vu Ha Anh</li>
        <li style={styles.memberItem}>👨‍💻 Ly Nguyen Bao</li>
        <li style={styles.memberItem}>👨‍💻 Bui Huu Duc</li>
      </ul>
    </div>
  )
}

const styles = {
  memberItem: {
    backgroundColor: '#fff',
    padding: '16px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid #f3f4f6',
    fontWeight: '500',
    color: '#1f2937'
  }
}
