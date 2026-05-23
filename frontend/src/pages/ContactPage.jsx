export default function ContactPage() {
  return (
    <div className="container page" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#16a34a' }}>Contact Us</h1>
      
      <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#111827' }}>Partnership & Support</h2>
        <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6', marginBottom: '24px' }}>
          If you are interested in business partnerships, sponsoring rewards for our community, or have any questions that require support, please contact us using the information below:
        </p>
        
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
            <span style={{ fontSize: '24px' }}>📍</span>
            <div>
              <strong>Address:</strong>
              <br/>Hanoi University of Science and Technology (HUST)<br/>No. 1 Dai Co Viet, Hai Ba Trung, Hanoi
            </div>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
            <span style={{ fontSize: '24px' }}>📧</span>
            <div>
              <strong>Email:</strong>
              <br/><a href="mailto:contact@ecomarkethub.com" style={{ color: '#2563eb', textDecoration: 'none' }}>contact@ecomarkethub.com</a>
            </div>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
            <span style={{ fontSize: '24px' }}>📞</span>
            <div>
              <strong>Phone:</strong>
              <br/>+84 24 3869 4242
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
