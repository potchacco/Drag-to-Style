import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import './Sidebar.css';

const DraggableItem = ({ id, label, icon }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-item"
    >
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </div>
  );
};

const Sidebar = () => {
  // Track which category is open
  const [openCategory, setOpenCategory] = useState('Layout');

  const elementCategories = [
    {
      category: 'Layout',
      icon: '📐',
      elements: [
        { id: 'header', label: '<header>', icon: '📋' },
        { id: 'nav', label: '<nav>', icon: '🧭' },
        { id: 'section', label: '<section>', icon: '📄' },
        { id: 'footer', label: '<footer>', icon: '⬇️' },
        { id: 'div', label: '<div>', icon: '📦' },
      ]
    },
    {
      category: 'Text',
      icon: '📝',
      elements: [
        { id: 'h1', label: '<h1>', icon: 'H1' },
        { id: 'h2', label: '<h2>', icon: 'H2' },
        { id: 'h3', label: '<h3>', icon: 'H3' },
        { id: 'p', label: '<p>', icon: '¶' },
      ]
    },
    {
      category: 'Media',
      icon: '🖼️',
      elements: [
        { id: 'img', label: '<img>', icon: '🖼️' },
      ]
    },
    {
      category: 'Interactive',
      icon: '🎮',
      elements: [
        { id: 'button', label: '<button>', icon: '🔘' },
        { id: 'a', label: '<a>', icon: '🔗' },
      ]
    }
  ];

  const toggleCategory = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="sidebar">
      <h2>HTML Elements</h2>
      <p className="sidebar-subtitle">Click category to expand</p>
      
      <div className="sidebar-scroll">
        {elementCategories.map((category, index) => (
          <div key={index} className="category-section">
            <button 
              className={`category-header ${openCategory === category.category ? 'active' : ''}`}
              onClick={() => toggleCategory(category.category)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.category}</span>
              <span className="category-count">({category.elements.length})</span>
              <span className="category-arrow">
                {openCategory === category.category ? '▼' : '▶'}
              </span>
            </button>
            
            {openCategory === category.category && (
              <div className="elements-grid">
                {category.elements.map((element) => (
                  <DraggableItem
                    key={element.id}
                    id={element.id}
                    label={element.label}
                    icon={element.icon}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="instructions">
        <h3>How to Play:</h3>
        <ol>
          <li>Click a category above</li>
          <li>Drag HTML elements</li>
          <li>Drop on the canvas</li>
          <li>Build your website!</li>
        </ol>
      </div>
    </div>
  );
};

export default Sidebar;
