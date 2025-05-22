// cursor: replace using protocol

import React, { useState, useEffect, useRef } from 'react';

interface EONIDProps {
  userId?: string;
  isEditable?: boolean;
}

export default function SelfContainedEONID({ userId = 'user123', isEditable = true }: EONIDProps) {
  // Internal state
  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const orbitAnimationRef = useRef<number>();

  // Mock data
  const mockProfile = {
    id: 'user123',
    displayName: 'Buoyant',
    title: 'Cosmic Explorer',
    bio: 'Exploring the digital cosmos',
    domain: 'buoyant.eonic',
    avatarUrl: '/images/avatars/default.jpg',
    socialLinks: {},
    privacySettings: { 
      isPublic: true, 
      showSocialLinks: true, 
      showTokenHoldings: true, 
      showReputation: true 
    }
  };
  
  const mockModules = [
    {
      id: 'module-1',
      type: 'tokenholdings',
      title: 'Token Holdings',
      shortCode: 'TOK',
      color: '#1C45F4',
      orbitRadius: 180,
      orbitSpeed: 0.0001,
      orbitOffset: 0,
      data: { tokens: [{ symbol: 'EONIC', amount: 1250, value: 3750 }] },
      isExpanded: false
    },
    {
      id: 'module-2',
      type: 'timepiece',
      title: 'Timepiece',
      shortCode: 'TIM',
      color: '#F5D16F',
      orbitRadius: 200,
      orbitSpeed: 0.00008,
      orbitOffset: Math.PI * 0.5,
      data: { level: 3, xp: 2750, nextLevel: 5000 },
      isExpanded: false
    },
    {
      id: 'module-3',
      type: 'sociallinks',
      title: 'Social Links',
      shortCode: 'SOC',
      color: '#7B2682',
      orbitRadius: 190,
      orbitSpeed: 0.00012,
      orbitOffset: Math.PI,
      data: { links: [] },
      isExpanded: false
    },
    {
      id: 'module-4',
      type: 'reputation',
      title: 'Reputation',
      shortCode: 'REP',
      color: '#00A86B',
      orbitRadius: 170,
      orbitSpeed: 0.00015,
      orbitOffset: Math.PI * 1.5,
      data: { score: 87, badges: ['Trusted', 'Contributor'] },
      isExpanded: false
    }
  ];

  // Utility functions
  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDomain = (domain: string) => {
    if (!domain) return '';
    const parts = domain.split('.');
    if (parts.length < 2) return domain;
    
    return (
      <span>
        {parts[0]}
        <span style={{ color: '#1C45F4' }}>.{parts[1]}</span>
      </span>
    );
  };

  const getModulePosition = (module: any) => {
    const angle = orbitAngle * module.orbitSpeed + module.orbitOffset;
    const x = Math.cos(angle) * module.orbitRadius;
    const y = Math.sin(angle) * module.orbitRadius;
    return { x, y };
  };

  const handleModuleClick = (moduleId: string) => {
    if (expandedModuleId === moduleId) {
      setExpandedModuleId(null);
    } else {
      setExpandedModuleId(moduleId);
    }
  };

  // Load mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile(mockProfile);
      setModules(mockModules);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Detect when component enters viewport
  useEffect(() => {
    if (!containerRef.current) return;
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHasEnteredViewport(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(containerRef.current);
      
      return () => {
        observer.disconnect();
      };
    } else {
      setHasEnteredViewport(true);
    }
  }, []);
  
  // Initialize cosmic background
  useEffect(() => {
    if (!canvasRef.current || !hasEnteredViewport) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Create stars
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.03 + 0.01,
      pulse: Math.random() * 0.02,
      pulseSpeed: Math.random() * 0.01
    }));
    
    // Create nebula particles
    const nebulaParticles = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 50 + 20,
      opacity: Math.random() * 0.05 + 0.02,
      color: i % 2 === 0 ? '#1C45F4' : '#7B2682',
      speed: Math.random() * 0.01
    }));
    
    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgb(0, 5, 16)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw nebula particles
      nebulaParticles.forEach(particle => {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        );
        gradient.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'rgba(0, 5, 16, 0)');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Move nebula particles
        particle.y += particle.speed;
        
        // Reset particles that go off screen
        if (particle.y - particle.radius > canvas.height) {
          particle.y = -particle.radius;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      // Draw stars
      stars.forEach(star => {
        // Pulsing effect
        star.opacity += star.pulse;
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.pulse = -star.pulse;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Add glow to brighter stars
        if (star.opacity > 0.7) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.3})`;
          ctx.fill();
        }
        
        // Move stars
        star.y += star.speed;
        
        // Reset stars that go off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hasEnteredViewport]);
  
  // Animate orbital modules
  useEffect(() => {
    if (!hasEnteredViewport || isLoading) return;
    
    const animateOrbits = () => {
      setOrbitAngle(prevAngle => prevAngle + 0.0005);
      orbitAnimationRef.current = requestAnimationFrame(animateOrbits);
    };
    
    animateOrbits();
    
    return () => {
      if (orbitAnimationRef.current) {
        cancelAnimationFrame(orbitAnimationRef.current);
      }
    };
  }, [hasEnteredViewport, isLoading]);

  return (
    <div className="eonid-container" ref={containerRef} style={styles.container}>
      {/* Cosmic Background */}
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      
      {/* Main Content */}
      <div style={styles.content}>
        {/* EON-ID Title */}
        <h1 style={styles.title}>EON-ID</h1>
        
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loadingText}>Loading EON-ID...</div>
          </div>
        ) : (
          <>
            {/* Profile Portal */}
            <div style={styles.profilePortal}>
              {/* Outer Ring Animation */}
              <div style={styles.profileOuterRing}></div>
              <div style={styles.profileRing}></div>
              
              {/* Timepiece Icon Overlay */}
              <div style={styles.timepieceOverlay}>
                <div style={styles.timepieceIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="#F5D16F" strokeWidth="2"/>
                    <path d="M12 7V12L15 15" stroke="#F5D16F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div style={styles.profileBackground}></div>
              <div style={styles.avatarContainer}>
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.displayName} 
                    style={styles.avatar}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const nextSibling = target.nextSibling as HTMLElement;
                      if (nextSibling) nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div style={{
                  ...styles.avatarFallback,
                  display: profile.avatarUrl ? 'none' : 'flex'
                }}>
                  {getInitials(profile.displayName)}
                </div>
              </div>
              <div style={styles.profileInfo}>
                <div style={styles.displayName}>{profile.displayName}</div>
                <div style={styles.domain}>{formatDomain(profile.domain)}</div>
                <div style={styles.bio}>{profile.bio}</div>
              </div>
            </div>
            
            {/* Orbital Modules */}
            {modules.map((module) => {
              const position = getModulePosition(module);
              return (
                <div 
                  key={module.id}
                  style={{
                    ...styles.module,
                    backgroundColor: module.color,
                    boxShadow: expandedModuleId === module.id 
                      ? `0 0 25px ${module.color}, 0 0 10px ${module.color}`
                      : `0 0 15px ${module.color}`,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    zIndex: expandedModuleId === module.id ? 30 : 10
                  }}
                  onClick={() => handleModuleClick(module.id)}
                >
                  <div style={styles.moduleContent}>
                    {module.shortCode}
                  </div>
                  
                  {/* Expanded Module Content */}
                  {expandedModuleId === module.id && (
                    <div style={{
                      ...styles.expandedModule,
                      borderColor: module.color,
                      boxShadow: `0 0 20px ${module.color}`
                    }}>
                      <h3 style={{
                        ...styles.moduleTitle,
                        color: module.color
                      }}>
                        {/* Module Icon */}
                        <span style={styles.moduleTitleIcon}>
                          {module.type === 'tokenholdings' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                              <path d="M12 6V18M8 10L12 6L16 10M8 14L12 18L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {module.type === 'timepiece' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
                              <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {module.type === 'sociallinks' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 12H16M16 12C16 14.2091 17.7909 16 20 16V16C20 11.5817 16.4183 8 12 8V8C7.58172 8 4 11.5817 4 16V16C6.20914 16 8 14.2091 8 12V12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 8C12 5.79086 10.2091 4 8 4V4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 8C12 5.79086 13.7909 4 16 4V4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {module.type === 'reputation' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        {module.title}
                      </h3>
                      
                      {/* Module-specific content */}
                      {module.type === 'tokenholdings' && (
                        <div style={styles.moduleDetails}>
                          {module.data.tokens.map((token: any, i: number) => (
                            <div key={i} style={{
                              ...styles.tokenItem,
                              backgroundColor: `${module.color}30`
                            }}>
                              <span>{token.symbol}</span>
                              <span>{token.amount.toLocaleString()}</span>
                            </div>
                          ))}
                          <button style={{
                            ...styles.moduleButton,
                            backgroundColor: module.color
                          }}>
                            View All Holdings
                          </button>
                        </div>
                      )}
                      
                      {module.type === 'timepiece' && (
                        <div style={styles.moduleDetails}>
                          <div style={styles.levelDisplay}>
                            <span style={{
                              ...styles.levelNumber,
                              color: module.color
                            }}>{module.data.level}</span>
                            <p style={styles.levelLabel}>CURRENT LEVEL</p>
                          </div>
                          
                          <div style={styles.progressContainer}>
                            <div style={styles.progressLabels}>
                              <span>XP Progress</span>
                              <span>{Math.round((module.data.xp / module.data.nextLevel) * 100)}%</span>
                            </div>
                            <div style={styles.progressBar}>
                              <div style={{
                                ...styles.progressFill,
                                width: `${(module.data.xp / module.data.nextLevel) * 100}%`,
                                backgroundColor: module.color
                              }}></div>
                            </div>
                            <div style={styles.progressValues}>
                              <span>{module.data.xp.toLocaleString()} XP</span>
                              <span>{module.data.nextLevel.toLocaleString()} XP</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {module.type === 'sociallinks' && (
                        <div style={styles.moduleDetails}>
                          <p style={styles.socialText}>
                            Connect your social accounts to enhance your EON-ID presence.
                          </p>
                          <div style={styles.socialGrid}>
                            <button style={{
                              ...styles.socialButton,
                              backgroundColor: '#1DA1F2'
                            }}>Twitter</button>
                            <button style={{
                              ...styles.socialButton,
                              backgroundColor: '#5865F2'
                            }}>Discord</button>
                            <button style={{
                              ...styles.socialButton,
                              backgroundColor: '#0088cc'
                            }}>Telegram</button>
                            <button style={{
                              ...styles.socialButton,
                              backgroundColor: '#333'
                            }}>GitHub</button>
                          </div>
                        </div>
                      )}
                      
                      {module.type === 'reputation' && (
                        <div style={styles.moduleDetails}>
                          <div style={styles.levelDisplay}>
                            <span style={{
                              ...styles.levelNumber,
                              color: module.color
                            }}>{module.data.score}</span>
                            <p style={styles.levelLabel}>REPUTATION SCORE</p>
                          </div>
                          
                          <div style={styles.badgesContainer}>
                            <p style={styles.badgesTitle}>Badges:</p>
                            <div style={styles.badgesList}>
                              {module.data.badges.map((badge: string, i: number) => (
                                <span 
                                  key={i} 
                                  style={{
                                    ...styles.badge,
                                    backgroundColor: `${module.color}40`
                                  }}
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Add Module Button - Only visible in edit mode */}
            {isEditable && (
              <div style={styles.addModuleContainer}>
                <button style={styles.addModuleButton}>
                  <span style={styles.plusIcon}>+</span>
                  <span>ADD MODULE</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  // Container styles
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#000',
    fontFamily: 'Arial, sans-serif',
    color: '#fff'
  } as React.CSSProperties,
  
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  } as React.CSSProperties,
  
  content: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  } as React.CSSProperties,
  
  title: {
    color: '#1C45F4',
    fontSize: '3rem',
    fontWeight: 'bold',
    letterSpacing: '0.5rem',
    marginBottom: '2rem',
    position: 'absolute',
    top: '2rem',
    textShadow: '0 0 10px rgba(28, 69, 244, 0.7), 0 0 20px rgba(28, 69, 244, 0.4)',
    margin: 0
  } as React.CSSProperties,
  
  profilePortal: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
  } as React.CSSProperties,
  
  profileBackground: {
    position: 'absolute',
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    zIndex: 1
  } as React.CSSProperties,
  
  profileOuterRing: {
    position: 'absolute',
    width: '240px',
    height: '240px',
    borderRadius: '50%',
    border: '1px solid rgba(28, 69, 244, 0.3)',
    boxShadow: '0 0 30px rgba(28, 69, 244, 0.3)',
    animation: 'pulseOuter 6s infinite'
  } as React.CSSProperties,
  
  profileRing: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: '2px solid rgba(28, 69, 244, 0.5)',
    boxShadow: '0 0 20px rgba(28, 69, 244, 0.5)',
    animation: 'pulse 4s infinite'
  } as React.CSSProperties,
  
  timepieceOverlay: {
    position: 'absolute',
    top: '-15px',
    right: '-15px',
    zIndex: 25
  } as React.CSSProperties,
  
  timepieceIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    border: '2px solid #F5D16F',
    boxShadow: '0 0 10px rgba(245, 209, 111, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as React.CSSProperties,
  
  avatarContainer: {
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#0A0A0A',
    border: '3px solid #1C45F4',
    boxShadow: '0 0 15px rgba(28, 69, 244, 0.7), 0 0 30px rgba(28, 69, 244, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10
  } as React.CSSProperties,
  
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  } as React.CSSProperties,
  
  avatarFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C45F4',
    color: '#fff',
    fontSize: '3rem',
    fontWeight: 'bold'
  } as React.CSSProperties,
  
  profileInfo: {
    marginTop: '1.5rem',
    textAlign: 'center',
    zIndex: 10
  } as React.CSSProperties,
  
  displayName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
  } as React.CSSProperties,
  
  domain: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    cursor: 'pointer'
  } as React.CSSProperties,
  
  bio: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    maxWidth: '300px'
  } as React.CSSProperties,
  
  module: {
    position: 'absolute',
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    left: '50%',
    top: '50%',
    marginLeft: '-27.5px',
    marginTop: '-27.5px'
  } as React.CSSProperties,
  
  moduleContent: {
    fontWeight: 'bold',
    fontSize: '0.9rem',
    color: 'white',
    textShadow: '0 0 5px rgba(0, 0, 0, 0.5)'
  } as React.CSSProperties,
  
  expandedModule: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    width: '300px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    zIndex: 100
  } as React.CSSProperties,
  
  moduleTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center'
  } as React.CSSProperties,
  
  moduleTitleIcon: {
    marginRight: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  } as React.CSSProperties,
  
  moduleDetails: {
    fontSize: '0.9rem'
  } as React.CSSProperties,
  
  tokenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    marginBottom: '0.5rem'
  } as React.CSSProperties,
  
  moduleButton: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem'
  } as React.CSSProperties,
  
  levelDisplay: {
    textAlign: 'center',
    marginBottom: '1rem'
  } as React.CSSProperties,
  
  levelNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold'
  } as React.CSSProperties,
  
  levelLabel: {
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0.25rem 0 0 0'
  } as React.CSSProperties,
  
  progressContainer: {
    width: '100%'
  } as React.CSSProperties,
  
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    marginBottom: '0.5rem'
  } as React.CSSProperties,
  
  progressBar: {
    width: '100%',
    height: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '0.25rem',
    overflow: 'hidden'
  } as React.CSSProperties,
  
  progressFill: {
    height: '100%',
    borderRadius: '0.25rem'
  } as React.CSSProperties,
  
  progressValues: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '0.25rem'
  } as React.CSSProperties,
  
  socialText: {
    marginBottom: '1rem',
    color: 'rgba(255, 255, 255, 0.7)'
  } as React.CSSProperties,
  
  socialGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem'
  } as React.CSSProperties,
  
  socialButton: {
    padding: '0.5rem',
    borderRadius: '0.25rem',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  } as React.CSSProperties,
  
  badgesContainer: {
    marginTop: '1rem'
  } as React.CSSProperties,
  
  badgesTitle: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  } as React.CSSProperties,
  
  badgesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  } as React.CSSProperties,
  
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.8rem',
    fontWeight: 'medium'
  } as React.CSSProperties,
  
  addModuleContainer: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center'
  } as React.CSSProperties,
  
  addModuleButton: {
    padding: '0.5rem 1.5rem',
    borderRadius: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid #1C45F4',
    color: '#1C45F4',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(28, 69, 244, 0.3)'
  } as React.CSSProperties,
  
  plusIcon: {
    marginRight: '0.5rem',
    fontSize: '1.25rem'
  } as React.CSSProperties,
  
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10
  } as React.CSSProperties,
  
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(28, 69, 244, 0.3)',
    borderTop: '4px solid #1C45F4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  } as React.CSSProperties,
  
  loadingText: {
    color: '#1C45F4',
    fontWeight: 'bold'
  } as React.CSSProperties
};

// Add keyframe animations
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.05); opacity: 0.8; }
      100% { transform: scale(1); opacity: 0.5; }
    }
    
    @keyframes pulseOuter {
      0% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.08); opacity: 0.5; }
      100% { transform: scale(1); opacity: 0.3; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleTag);
} 