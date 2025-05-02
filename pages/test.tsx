import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';

// Format PostgreSQL interval to readable string
const formatInterval = (interval: string | null): string => {
  if (!interval) return '0 minutes';
  
  const match = interval.match(/(?:(\d+) years? )?(?:(\d+) mons? )?(?:(\d+) days? )?(?:(\d+):([0-5]\d):([0-5]\d))?/);
  if (!match) return interval;

  const [_, years, months, days, hours, minutes, seconds] = match;
  const parts: string[] = [];

  if (years) parts.push(`${years} year${years === '1' ? '' : 's'}`);
  if (months) parts.push(`${months} month${months === '1' ? '' : 's'}`);
  if (days) parts.push(`${days} day${days === '1' ? '' : 's'}`);
  if (hours) parts.push(`${hours} hour${hours === '1' ? '' : 's'}`);
  if (minutes) parts.push(`${minutes} minute${minutes === '1' ? '' : 's'}`);
  if (seconds) parts.push(`${seconds} second${seconds === '1' ? '' : 's'}`);

  return parts.join(', ') || '0 minutes';
};

const TestPage: NextPage = () => {
  const address = '9qnKguL5uUp8PbrXDcSUWbJ1gbTkGh3URyLtx66Ya7Lx';
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [status, setStatus] = useState('online');
  const [customStatus, setCustomStatus] = useState('');
  const [response, setResponse] = useState('Click a button to test the API');
  const [isError, setIsError] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const updateProfile = async () => {
    try {
      const body: Record<string, string> = {};
      if (displayName) body.display_name = displayName;
      if (avatarUrl) body.avatar_url = avatarUrl;
      if (status) body.status = status;
      if (customStatus) body.custom_status = customStatus;

      const response = await fetch(`/api/profile?address=${address}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
      setIsError(!response.ok);
    } catch (error) {
      setResponse('Error: ' + (error as Error).message);
      setIsError(true);
    }
  };

  const getProfile = async () => {
    try {
      const response = await fetch(`/api/profile?address=${address}`);
      const data = await response.json();
      console.log('Profile response:', data);
      setResponse(JSON.stringify(data, null, 2));
      setIsError(!response.ok);

      if (response.ok && data) {
        setProfile(data);
        setDisplayName(data.display_name || '');
        setAvatarUrl(data.avatar_url || '');
        setStatus(data.status || 'online');
        setCustomStatus(data.custom_status || '');
      }
    } catch (error) {
      setResponse('Error: ' + (error as Error).message);
      setIsError(true);
    }
  };

  const testInvalidInputs = async () => {
    const tests = [
      { display_name: 'a' },  // Too short
      { display_name: 'Test', avatar_url: 'invalid-url' },  // Invalid URL
      { display_name: 'Test', status: 'invalid' }  // Invalid status
    ];

    for (const test of tests) {
      try {
        const response = await fetch(`/api/profile?address=${address}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(test)
        });
        const data = await response.json();
        setResponse(`Test: ${JSON.stringify(test)}\nResponse: ${JSON.stringify(data, null, 2)}`);
        setIsError(!response.ok);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        setResponse('Error: ' + (error as Error).message);
        setIsError(true);
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <>
      <Head>
        <title>Test Profile API</title>
      </Head>
      <div style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
        <h2>Test Profile API</h2>
        
        <div className="form-group">
          <label>Display Name:</label>
          <input 
            type="text" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name" 
          />
        </div>

        <div className="form-group">
          <label>Avatar URL:</label>
          <input 
            type="text" 
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="http://... or /..." 
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="online">Online</option>
            <option value="busy">Busy</option>
            <option value="away">Away</option>
            <option value="offline">Offline</option>
            <option value="invalid">Invalid Status (for testing)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Custom Status Message:</label>
          <input
            type="text"
            value={customStatus}
            onChange={(e) => setCustomStatus(e.target.value)}
            placeholder="What's on your mind? (60 chars max)"
            maxLength={60}
          />
        </div>

        {profile && (
          <div className="stats">
            <h3>Profile Stats:</h3>
            <ul>
              <li>🎭 Status: {profile.status}</li>
              <li>💭 Custom Status: {profile.custom_status || 'No status set'}</li>
              <li>📊 Activity:</li>
              <li className="indent">📨 Messages: {profile.messages_sent || 0}</li>
              <li className="indent">🔁 Shared: {profile.posts_shared || 0}</li>
              <li className="indent">❤️ Liked: {profile.posts_liked || 0}</li>
              <li className="indent">⭐ Reactions: {profile.total_reactions || 0}</li>
              
              <li className="metric-header">Community Stats:</li>
              <li>💬 Chat Time: {formatInterval(profile.time_in_chat)}</li>
              <li>📨 Messages Sent: {profile.messages_sent}</li>
              <li>🔁 Posts Shared: {profile.posts_shared}</li>
              <li>❤️ Posts Liked: {profile.posts_liked}</li>
              <li>⭐ Total Reactions: {profile.total_reactions}</li>
              
              {profile.social_stats?.weekly_activity && (
                <li className="activity-chart">
                  <div>📊 Weekly Activity:</div>
                  <div className="chart">
                    {profile.social_stats.weekly_activity.map((count: number, i: number) => (
                      <div 
                        key={i} 
                        className="bar" 
                        style={{
                          height: `${Math.min(100, (count / Math.max(...profile.social_stats.weekly_activity)) * 100)}%`,
                          opacity: count === 0 ? 0.2 : 1
                        }}
                        title={`${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]}: ${count} actions`}
                      />
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}

        <button onClick={updateProfile}>Update Profile</button>
        <button onClick={getProfile}>Get Profile</button>
        <button onClick={testInvalidInputs}>Test Invalid Inputs</button>

        <h3>Response:</h3>
        <pre className={isError ? 'error' : 'success'}>{response}</pre>

        <style jsx>{`
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; }
          input, select { width: 100%; padding: 8px; margin-bottom: 10px; }
          button { padding: 10px; margin: 5px; cursor: pointer; }
          pre { background: #f5f5f5; padding: 10px; border-radius: 4px; white-space: pre-wrap; }
          .error { color: red; }
          .success { color: green; }
          .stats { margin: 20px 0; padding: 15px; background: #f0f0f0; border-radius: 4px; }
          .stats h3 { margin-top: 0; }
          .stats ul { list-style: none; padding: 0; }
          .stats li { margin: 5px 0; }
          .metric-header { font-weight: bold; margin-top: 15px; }
          .activity-chart { margin-top: 15px; }
          .activity-chart .chart { 
            display: flex; 
            align-items: flex-end; 
            height: 50px; 
            gap: 2px;
            margin-top: 5px;
            background: #e0e0e0;
            padding: 5px;
            border-radius: 4px;
          }
          .activity-chart .bar { 
            flex: 1;
            background: #4CAF50;
            min-height: 1px;
            transition: height 0.3s ease;
          }
        `}</style>
      </div>
    </>
  );
};

export default TestPage;
