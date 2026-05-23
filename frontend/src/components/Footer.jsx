import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        
        {/* Cột trái: Logo & Text */}
        <div style={styles.brandCol}>
          <h2 style={styles.logo}>EcoMarket Hub</h2>
          <p style={styles.copyright}>
            Our mission is to reduce waste<br />
            and encourage the recycling of old goods.
          </p>
          <p style={{...styles.copyright, marginTop: '8px', fontSize: '13px'}}>
            © 2026 EcoMarket Hub.
          </p>
        </div>

        {/* Các cột link */}
        <div style={styles.linksWrapper}>
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Marketplace</h4>
            <Link to="#" style={styles.link}>Clothing</Link>
            <Link to="#" style={styles.link}>Electronics</Link>
            <Link to="#" style={styles.link}>Marketplace</Link>
          </div>
          
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Resources</h4>
            <Link to="#" style={styles.link}>Environmental Tips</Link>
            <Link to="/greenhub" style={styles.link}>Green Hub</Link>
            <Link to="/rewards" style={styles.link}>Rewards</Link>
          </div>
          
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Company</h4>
            <Link to="/about" style={styles.link}>About Us</Link>
            <Link to="/contact" style={styles.link}>Contact</Link>
            <Link to="/privacy" style={styles.link}>Privacy Policy</Link>
            
            {/* Icons ở dưới cùng cột Company */}
            <div style={styles.socialIcons}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 12 12"></path></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: 'var(--card-bg)',
    borderTop: '1px solid var(--border-color)',
    borderRadius: '24px 24px 0 0',
    padding: '32px 0',
    marginTop: '60px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '40px'
  },
  brandCol: {
    flex: '1',
    minWidth: '250px'
  },
  logo: {
    color: 'var(--brand-green)',
    fontSize: '20px',
    fontWeight: '500',
    marginBottom: '12px'
  },
  copyright: {
    color: 'var(--text-muted)',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  linksWrapper: {
    display: 'flex',
    gap: '60px',
    flexWrap: 'wrap'
  },
  linkCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  colTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '8px'
  },
  link: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s'
  },
  socialIcons: {
    display: 'flex',
    gap: '16px',
    marginTop: '16px',
    color: '#64748b'
  }
}
