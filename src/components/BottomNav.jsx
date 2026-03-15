import React from 'react';

const NAV_ITEMS = [
  { id: 'cocktails', icon: '\u{1F378}', label: 'Cocktails' },
  { id: 'mybar', icon: '\u{1F943}', label: 'My Bar' },
  { id: 'techniques', icon: '\u{1F9CA}', label: 'Technique' },
  { id: 'history', icon: '\u{1F4DC}', label: 'History' },
  { id: 'favorites', icon: '\u2764\uFE0F', label: 'Favorites' },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(n => (
        <button
          key={n.id}
          className={"nav-item" + (activeTab === n.id ? " active" : "")}
          onClick={() => onTabChange(n.id)}
        >
          <span className="nav-icon">{n.icon}</span>
          <span className="nav-label">{n.label}</span>
        </button>
      ))}
    </nav>
  );
}
