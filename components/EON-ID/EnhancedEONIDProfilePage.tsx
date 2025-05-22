import React, { useState, useEffect, useRef } from 'react';
import '../../styles/eonid-profile.css';

interface EONIDContainerProps {
  userId: string;
  isEditable?: boolean;
  className?: string;
}

interface Profile {
  displayName: string;
  walletAddress: string;
  domain: string;
  title: string;
  profilePicture: string | null;
  bio: string;
  xpLevel: number;
  xpCurrent: number;
  xpMax: number;
  timepiece: string;
  eonicHoldings: number;
  reputationScore: number;
  nfts: Array<{ name: string; image: string }>;
  businessLinks: Array<{ name: string; url: string }>;
  projects: Array<{ name: string; description: string; url: string }>;
  socials: Array<{ platform: string; handle: string; url: string }>;
  logos: Array<{ name: string; image: string }>;
}

interface WidgetVisibility {
  displayName: boolean;
  vaultDomain: boolean;
  timepieceStage: boolean;
  xpLevel: boolean;
  eonicHoldings: boolean;
  reputationScore: boolean;
  nftGallery: boolean;
  businessLinks: boolean;
  socials: boolean;
  projects: boolean;
  logosAndBrands: boolean;
}

export default function EnhancedEONIDProfilePage({ userId, isEditable = true, className = '' }: EONIDContainerProps) {
  // State for profile information
  const [profile, setProfile] = useState<Profile>({
    displayName: 'Buoyant',
    walletAddress: userId || '7X2iJvyYrQfXCUTGjcCJvGUVK3TgVKXgNBTLzNcC9wNM',
    domain: '',
    title: 'Cosmic Explorer',
    profilePicture: null,
    bio: 'Exploring the digital cosmos',
    xpLevel: 3,
    xpCurrent: 275,
    xpMax: 400,
    timepiece: 'Genesis',
    eonicHoldings: 750.25,
    reputationScore: 87,
    nfts: [],
    businessLinks: [],
    projects: [
      { name: 'The Vault', description: 'Secure digital asset storage', url: 'https://thevault.eonic' }
    ],
    socials: [
      { platform: 'Twitter', handle: '@buoyant', url: 'https://twitter.com/buoyant' },
      { platform: 'Discord', handle: 'buoyant#1234', url: 'https://discord.gg/buoyant' }
    ],
    logos: [
      { name: 'EON', image: '/images/logos/eon.png' },
      { name: 'Vault', image: '/images/logos/vault.png' }
    ]
  });

  // State for widget visibility
  const [widgets, setWidgets] = useState<WidgetVisibility>({
    displayName: true,
    vaultDomain: true,
    timepieceStage: true,
    xpLevel: true,
    eonicHoldings: true,
    reputationScore: true,
    nftGallery: true,
    businessLinks: true,
    socials: true,
    projects: true,
    logosAndBrands: true
  });

  // State for domain search and availability
  const [domainSearch, setDomainSearch] = useState('');
  const [domainAvailability, setDomainAvailability] = useState<boolean | null>(null);
  const [isSearchingDomain, setIsSearchingDomain] = useState(false);

  // State for privacy settings
  const [isPublic, setIsPublic] = useState(true);

  // State for save button feedback
  const [saveStatus, setSaveStatus] = useState<'saving' | 'success' | 'error' | null>(null);

  // Refs
  const profileLinkRef = useRef<HTMLInputElement>(null);
  const domainSearchTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle profile information changes
  const handleProfileChange = (field: keyof Profile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle widget visibility toggle
  const handleWidgetToggle = (widget: keyof WidgetVisibility) => {
    setWidgets(prev => ({
      ...prev,
      [widget]: !prev[widget]
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProfileChange('profilePicture', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle domain search
  const handleDomainSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    setDomainSearch(sanitizedValue);
    
    if (domainSearchTimeoutRef.current) {
      clearTimeout(domainSearchTimeoutRef.current);
    }
    
    if (sanitizedValue) {
      setIsSearchingDomain(true);
      domainSearchTimeoutRef.current = setTimeout(() => {
        const isAvailable = Math.random() > 0.3;
        setDomainAvailability(isAvailable);
        setIsSearchingDomain(false);
      }, 800);
    } else {
      setDomainAvailability(null);
      setIsSearchingDomain(false);
    }
  };

  // Handle domain claim
  const handleDomainClaim = () => {
    if (domainSearch && domainAvailability) {
      handleProfileChange('domain', domainSearch);
      setDomainSearch('');
      setDomainAvailability(null);
      alert(`Domain ${domainSearch}.vault.co has been claimed successfully!`);
    }
  };

  // Handle form submission
  const handleSaveInformation = () => {
    setSaveStatus('saving');
    
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    }, 1500);
  };

  // Handle copy profile link
  const handleCopyProfileLink = () => {
    const profileLink = `https://vault.co/${profile.domain || profile.walletAddress}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileLink)
        .then(() => {
          alert('Profile link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          const el = profileLinkRef.current;
          if (el) {
            el.value = profileLink;
            el.select();
            document.execCommand('copy');
          }
        });
    } else {
      const el = profileLinkRef.current;
      if (el) {
        el.value = profileLink;
        el.select();
        document.execCommand('copy');
        alert('Profile link copied to clipboard!');
      }
    }
  };

  // Handle view as public
  const handleViewAsPublic = () => {
    const profileLink = `https://vault.co/${profile.domain || profile.walletAddress}`;
    window.open(profileLink, '_blank');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (domainSearchTimeoutRef.current) {
        clearTimeout(domainSearchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`eonid-profile-page ${className}`}>
      <div className="starry-background"></div>
      
      <div className="page-container">
        {/* Left Panel - Customization Controls */}
        {isEditable && (
          <div className="customization-panel">
            <h2>Customize EON-ID</h2>
            
            {/* Profile Picture Upload */}
            <div className="form-section">
              <div className="profile-upload">
                <div className="profile-picture-container">
                  {profile.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt="Profile" 
                      className="profile-picture"
                    />
                  ) : (
                    <div className="profile-picture-placeholder">
                      {profile.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <label className="upload-button">
                  Upload a profile picture for your EON-ID
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfilePictureUpload} 
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
            
            {/* Display Name */}
            <div className="form-section">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-input"
                value={profile.displayName}
                onChange={(e) => handleProfileChange('displayName', e.target.value)}
                placeholder="Enter your display name"
              />
            </div>
            
            {/* Domain Search */}
            <div className="form-section">
              <label className="form-label">
                Vault Domain
                <span className="info-tooltip" title="Powered by Bonvida's domain system">ℹ️</span>
              </label>
              
              <div className="current-domain">
                Currently using: 
                <span className={profile.domain ? "domain-text" : "wallet-text"}>
                  {profile.domain 
                    ? `${profile.domain}.vault.co` 
                    : `${profile.walletAddress.substring(0, 4)}...${profile.walletAddress.substring(profile.walletAddress.length - 4)}`
                  }
                </span>
              </div>
              
              <div className="domain-search-container">
                <div className="domain-input-container">
                  <input
                    type="text"
                    className="form-input domain-input"
                    value={domainSearch}
                    onChange={handleDomainSearch}
                    placeholder="Search for a domain"
                  />
                  <span className="domain-suffix">.vault.co</span>
                </div>
                
                {domainSearch && (
                  <div className="domain-availability">
                    {isSearchingDomain ? (
                      <span className="searching">Checking availability...</span>
                    ) : domainAvailability === true ? (
                      <span className="available">✓ Available</span>
                    ) : domainAvailability === false ? (
                      <span className="unavailable">✗ Unavailable</span>
                    ) : null}
                  </div>
                )}
                
                {domainAvailability && (
                  <button 
                    className="claim-button"
                    onClick={handleDomainClaim}
                  >
                    Claim Domain
                  </button>
                )}
              </div>
            </div>
            
            {/* Save Button */}
            <button 
              className={`save-button ${saveStatus ? `save-${saveStatus}` : ''}`}
              onClick={handleSaveInformation}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : saveStatus === 'success' ? (
                <>
                  ✓ Saved Successfully
                </>
              ) : saveStatus === 'error' ? (
                <>
                  ✗ Error Saving
                </>
              ) : (
                'Save Information'
              )}
            </button>
            
            {/* Widget Customization */}
            <div className="widget-customization">
              <h2>Customize Widgets</h2>
              <p className="widget-description">
                Select which components to display on your EON-ID
              </p>
              
              <div className="widget-toggles">
                {Object.entries(widgets).map(([key, value]) => (
                  <button 
                    key={key}
                    className={`widget-toggle ${value ? 'active' : ''}`}
                    onClick={() => handleWidgetToggle(key as keyof WidgetVisibility)}
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Right Panel - Preview */}
        <div className="preview-panel">
          <h2>Preview</h2>
          
          {/* Display Name Widget */}
          {widgets.displayName && (
            <div className="preview-widget">
              <div className="widget-header">Display Name</div>
              <div className="widget-content display-name-widget">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="Profile" 
                    className="preview-profile-picture"
                  />
                ) : (
                  <div className="preview-profile-placeholder">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="preview-display-info">
                  <div className="preview-display-name">
                    {profile.displayName}
                  </div>
                  {profile.title && (
                    <div className="preview-title">{profile.title}</div>
                  )}
                  {profile.bio && (
                    <div className="preview-bio">{profile.bio}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Vault Domain Widget */}
          {widgets.vaultDomain && (
            <div className="preview-widget">
              <div className="widget-header">Vault Domain</div>
              <div className="widget-content vault-domain-widget">
                <div className="domain-display">
                  {profile.domain ? (
                    <span className="domain-name">{profile.domain}.vault.co</span>
                  ) : (
                    <span className="wallet-display">
                      <span className="wallet-label">Wallet: </span>
                      <span className="wallet-address">
                        {`${profile.walletAddress.substring(0, 4)}...${profile.walletAddress.substring(profile.walletAddress.length - 4)}`}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timepiece Stage Widget */}
          {widgets.timepieceStage && (
            <div className="preview-widget">
              <div className="widget-header">Timepiece Stage</div>
              <div className="widget-content timepiece-widget">
                <div className="timepiece-icon">⌛</div>
                <div className="timepiece-stage">{profile.timepiece}</div>
              </div>
            </div>
          )}

          {/* XP Level Widget */}
          {widgets.xpLevel && (
            <div className="preview-widget">
              <div className="widget-header">XP Level</div>
              <div className="widget-content xp-level-widget">
                <div className="level-indicator">
                  <div className="level-circle">{profile.xpLevel}</div>
                  <div className="level-info">
                    <div className="level-text">Level {profile.xpLevel}</div>
                    <div className="xp-text">{profile.xpCurrent} / {profile.xpMax} XP</div>
                  </div>
                </div>
                <div className="xp-progress-container">
                  <div 
                    className="xp-progress-bar" 
                    style={{ width: `${(profile.xpCurrent / profile.xpMax) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* EONIC Holdings Widget */}
          {widgets.eonicHoldings && (
            <div className="preview-widget">
              <div className="widget-header">EONIC Holdings</div>
              <div className="widget-content eonic-holdings-widget">
                <div className="eonic-token">💎</div>
                <div>
                  <div className="eonic-amount">{profile.eonicHoldings.toLocaleString()}</div>
                  <div className="eonic-label">EONIC</div>
                </div>
              </div>
            </div>
          )}

          {/* Reputation Score Widget */}
          {widgets.reputationScore && (
            <div className="preview-widget">
              <div className="widget-header">Reputation Score</div>
              <div className="widget-content reputation-widget">
                <div className="reputation-score-container">
                  <div className="reputation-score">{profile.reputationScore}</div>
                  <div className="reputation-label">REPUTATION</div>
                </div>
                <div className="reputation-meter">
                  <div 
                    className="reputation-meter-fill" 
                    style={{ width: `${profile.reputationScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* NFT Gallery Widget */}
          {widgets.nftGallery && (
            <div className="preview-widget">
              <div className="widget-header">NFT Gallery</div>
              <div className="widget-content nft-gallery-widget">
                {profile.nfts.length > 0 ? (
                  <div className="nft-grid">
                    {profile.nfts.map((nft, index) => (
                      <div key={index} className="nft-item">
                        <img src={nft.image} alt={nft.name} className="nft-image" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="nft-placeholder">No NFTs to display</div>
                )}
              </div>
            </div>
          )}

          {/* Business Links Widget */}
          {widgets.businessLinks && (
            <div className="preview-widget">
              <div className="widget-header">Business Links</div>
              <div className="widget-content business-links-widget">
                {profile.businessLinks.length > 0 ? (
                  <div className="business-links-list">
                    {profile.businessLinks.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="business-link"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="no-links-message">No business links added</div>
                )}
              </div>
            </div>
          )}

          {/* Socials Widget */}
          {widgets.socials && (
            <div className="preview-widget">
              <div className="widget-header">Social Media</div>
              <div className="widget-content socials-widget">
                {profile.socials.length > 0 ? (
                  <div className="socials-list">
                    {profile.socials.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        <div className="social-platform">{social.platform}</div>
                        <div className="social-handle">{social.handle}</div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="no-socials-message">No social media accounts linked</div>
                )}
              </div>
            </div>
          )}

          {/* Projects Widget */}
          {widgets.projects && (
            <div className="preview-widget">
              <div className="widget-header">Projects</div>
              <div className="widget-content projects-widget">
                {profile.projects.length > 0 ? (
                  <div className="projects-list">
                    {profile.projects.map((project, index) => (
                      <div key={index} className="project-item">
                        <div className="project-name">{project.name}</div>
                        <div className="project-description">{project.description}</div>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          View Project →
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-projects-message">No projects added</div>
                )}
              </div>
            </div>
          )}

          {/* Logos and Brands Widget */}
          {widgets.logosAndBrands && (
            <div className="preview-widget">
              <div className="widget-header">Logos & Brands</div>
              <div className="widget-content logos-widget">
                {profile.logos.length > 0 ? (
                  <div className="logos-grid">
                    {profile.logos.map((logo, index) => (
                      <div key={index} className="logo-item">
                        <div className="logo-image-container">
                          <img src={logo.image} alt={logo.name} className="logo-image" />
                        </div>
                        <div className="logo-name">{logo.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-logos-message">No logos or brands added</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden input for copy functionality */}
      <input
        ref={profileLinkRef}
        type="text"
        style={{ position: 'absolute', left: '-9999px' }}
      />
    </div>
  );
} 