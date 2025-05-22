declare module './DebugConsole' {
  interface Log {
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
  }

  interface DebugConsoleProps {
    logs: Log[];
    onClose: () => void;
    user: any;
  }

  const DebugConsole: React.FC<DebugConsoleProps>;
  export default DebugConsole;
}

declare module './SummonCaelinModal' {
  interface SummonCaelinModalProps {
    onClose: () => void;
    user: any;
  }

  const SummonCaelinModal: React.FC<SummonCaelinModalProps>;
  export default SummonCaelinModal;
}

declare module './NotionFrame' {
  interface NotionFrameProps {
    title: string;
    url: string;
    description: string;
  }

  const NotionFrame: React.FC<NotionFrameProps>;
  export default NotionFrame;
}

declare module './EmbedPanel' {
  interface EmbedPanelProps {
    title: string;
    type: 'github' | 'notion' | 'figma' | 'other';
    url: string;
    description: string;
  }

  const EmbedPanel: React.FC<EmbedPanelProps>;
  export default EmbedPanel;
} 