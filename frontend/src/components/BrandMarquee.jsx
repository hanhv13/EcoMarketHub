import React from 'react';

const sponsors = [
  { 
    id: 1, 
    name: 'EcoLife Co.', 
    color: '#10b981',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a7.5 7.5 0 0 1-9 10z"/><path d="M9.8 6.1C11 8.5 13 10 16 10"/></svg>
  },
  { 
    id: 2, 
    name: 'ReNew Apparel', 
    color: '#34d399',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 6a2 2 0 0 1-2 0l-4-2.5a2 2 0 0 0-2 0L3.62 6.54A2 2 0 0 0 2.5 8.25V18a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2V8.25a2 2 0 0 0-1.12-1.79z"/><path d="M12 20V10"/></svg>
  },
  { 
    id: 3, 
    name: 'GreenTech Innovations', 
    color: '#059669',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
  },
  { 
    id: 4, 
    name: 'EarthFirst Organics', 
    color: '#10b981',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  },
  { 
    id: 5, 
    name: 'Nature\'s Best', 
    color: '#34d399',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  },
  { 
    id: 6, 
    name: 'Sustainable Futures', 
    color: '#059669',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  },
];

export default function BrandMarquee() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.marqueeWrapper}>
        <div style={styles.marqueeContent}>
          {sponsors.map(sponsor => (
            <div key={`a-${sponsor.id}`} style={{...styles.brand, color: sponsor.color}}>
              {sponsor.icon}
              <span style={{marginLeft: '12px'}}>{sponsor.name}</span>
            </div>
          ))}
          {/* Duplicate for infinite scroll effect */}
          {sponsors.map(sponsor => (
            <div key={`b-${sponsor.id}`} style={{...styles.brand, color: sponsor.color}}>
              {sponsor.icon}
              <span style={{marginLeft: '12px'}}>{sponsor.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes headerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '80px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1920")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 21, 21, 0.90)', // Darker overlay to match body
    backdropFilter: 'blur(8px)', // Blur effect on background image
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 1
  },
  marqueeWrapper: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center'
  },
  marqueeContent: {
    display: 'flex',
    whiteSpace: 'nowrap',
    animation: 'headerScroll 40s linear infinite',
    gap: '60px',
    paddingLeft: '60px',
    alignItems: 'center'
  },
  brand: {
    fontSize: '20px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    opacity: 0.95,
    display: 'flex',
    alignItems: 'center',
    textShadow: '0 0 10px rgba(110, 231, 183, 0.2)'
  }
};
