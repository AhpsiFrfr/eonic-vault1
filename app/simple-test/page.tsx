export default function SimpleTest() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'monospace'
    }}>
      <h1>🚀 Simple Test - Working!</h1>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>If you see this, Vercel deployment is working.</p>
    </div>
  );
} 