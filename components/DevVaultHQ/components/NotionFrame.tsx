import React, { useState } from 'react';

interface NotionFrameProps {
  title: string;
  url: string;
  description: string;
}

const NotionFrame: React.FC<NotionFrameProps> = ({ title, url, description }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="notion-frame">
      <div className="embed-header">
        <div>
          <h2 className="embed-title">{title}</h2>
          <p className="embed-description">{description}</p>
        </div>
      </div>

      {isLoading && (
        <div className="notion-loading">
          <div className="cosmic-loader"></div>
          <p>Loading documentation...</p>
        </div>
      )}

      <div className={`notion-container ${isLoading ? '' : 'loaded'}`}>
        <iframe
          src={url}
          width="100%"
          height="800"
          frameBorder="0"
          onLoad={handleLoad}
          className="notion-iframe"
          title="Notion Documentation"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      <div className="notion-footer">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="open-notion-link"
        >
          Open in Notion →
        </a>
      </div>
    </div>
  );
};

export default NotionFrame; 