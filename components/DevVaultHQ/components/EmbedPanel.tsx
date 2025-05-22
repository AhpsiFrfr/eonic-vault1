import React, { useState } from 'react';

interface EmbedPanelProps {
  title: string;
  type: 'github' | 'notion' | 'figma' | 'other';
  url: string;
  description: string;
}

const EmbedPanel: React.FC<EmbedPanelProps> = ({ title, type, url, description }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const getIcon = () => {
    switch (type) {
      case 'github':
        return '📋';
      case 'notion':
        return '📝';
      case 'figma':
        return '🎨';
      default:
        return '🔗';
    }
  };

  return (
    <div className="embed-panel">
      <div className="embed-header">
        <div className="embed-title-container">
          <span className="embed-icon">{getIcon()}</span>
          <div>
            <h2 className="embed-title">{title}</h2>
            <p className="embed-description">{description}</p>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="open-external-link"
        >
          Open Externally
        </a>
      </div>

      {isLoading && (
        <div className="embed-loading">
          <div className="cosmic-loader"></div>
          <p>Loading {type} content...</p>
        </div>
      )}

      <div className={`embed-container ${isLoading ? '' : 'loaded'}`}>
        <iframe
          src={url}
          width="100%"
          height="800"
          frameBorder="0"
          onLoad={handleLoad}
          className="embed-iframe"
          title={`${title} Embed`}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      <div className="embed-footer">
        <div className="embed-status">
          <span className="status-dot"></span>
          Connected to {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
      </div>
    </div>
  );
};

export default EmbedPanel; 