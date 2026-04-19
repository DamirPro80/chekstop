// Simple line icons — kept minimal, geometric
const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.75 }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'shield-check':
      return (<svg {...props}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>);
    case 'shield':
      return (<svg {...props}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></svg>);
    case 'shield-alert':
      return (<svg {...props}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M12 8v4M12 15.5v.5"/></svg>);
    case 'link':
      return (<svg {...props}><path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></svg>);
    case 'paste':
      return (<svg {...props}><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2"/></svg>);
    case 'arrow-right':
      return (<svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>);
    case 'arrow-left':
      return (<svg {...props}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>);
    case 'check':
      return (<svg {...props}><path d="M5 12l5 5L20 7"/></svg>);
    case 'x':
      return (<svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>);
    case 'clock':
      return (<svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>);
    case 'history':
      return (<svg {...props}><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.5"/><path d="M3 4v4h4"/><path d="M12 8v4l3 2"/></svg>);
    case 'home':
      return (<svg {...props}><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-3v-7H8v7H5a2 2 0 01-2-2v-9z"/></svg>);
    case 'settings':
      return (<svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h0a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v0a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>);
    case 'users':
      return (<svg {...props}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.9"/><path d="M16 3.1a4 4 0 010 7.8"/></svg>);
    case 'plus':
      return (<svg {...props}><path d="M12 5v14M5 12h14"/></svg>);
    case 'send':
      return (<svg {...props}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>);
    case 'wallet':
      return (<svg {...props}><path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/><path d="M16 13a1 1 0 100-2 1 1 0 000 2z"/></svg>);
    case 'sparkle':
      return (<svg {...props}><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"/></svg>);
    case 'qr':
      return (<svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v3M14 21h3M21 17v4"/></svg>);
    case 'bolt':
      return (<svg {...props}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>);
    case 'globe':
      return (<svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>);
    case 'chart':
      return (<svg {...props}><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>);
    case 'card':
      return (<svg {...props}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>);
    case 'more':
      return (<svg {...props}><circle cx="12" cy="6" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="18" r="1"/></svg>);
    case 'search':
      return (<svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg>);
    case 'filter':
      return (<svg {...props}><path d="M3 5h18M6 12h12M10 19h4"/></svg>);
    case 'download':
      return (<svg {...props}><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>);
    case 'bell':
      return (<svg {...props}><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></svg>);
    case 'crown':
      return (<svg {...props}><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z"/></svg>);
    case 'upload':
      return (<svg {...props}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg>);
    case 'file-pdf':
      return (<svg {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>);
    case 'external':
      return (<svg {...props}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6M10 14L21 3"/></svg>);
    case 'eye':
      return (<svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>);
    case 'key':
      return (<svg {...props}><circle cx="8" cy="15" r="4"/><path d="M10.8 12.2L21 2M16 7l3 3M18 5l3 3"/></svg>);
    case 'copy':
      return (<svg {...props}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>);
    case 'lock':
      return (<svg {...props}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>);
    default: return null;
  }
};
window.Icon = Icon;
