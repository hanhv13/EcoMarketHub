export default function RewardsPage() {
  return (
    <div className="container page">
      <div className="empty-state">
        <span className="icon" style={{fontSize: '80px'}}>🏆</span>
        <h1 style={{color: 'var(--brand-green)', marginBottom: '16px'}}>Your Rewards</h1>
        <p style={{color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '16px'}}>
          Track your Green Points and badges here. Participate in events to earn more rewards and level up your Eco-Profile!
        </p>
      </div>
    </div>
  )
}
