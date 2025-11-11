import React from 'react';
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
  const elementCategories = [
    {
      category: 'Layout',
      elements: [
        { id: 'header', label: '<header>', icon: '📋' },
        { id: 'nav', label: '<nav>', icon: '🧭' },
        { id: 'section', label: '<section>', icon: '📄' },
        { id: 'article', label: '<article>', icon: '📰' },
        { id: 'aside', label: '<aside>', icon: '📌' },
        { id: 'footer', label: '<footer>', icon: '⬇️' },
        { id: 'div', label: '<div>', icon: '📦' },
      ]
    },
    {
      category: 'Text',
      elements: [
        { id: 'h1', label: '<h1>', icon: 'H1' },
        { id: 'h2', label: '<h2>', icon: 'H2' },
        { id: 'h3', label: '<h3>', icon: 'H3' },
        { id: 'p', label: '<p>', icon: '¶' },
        { id: 'span', label: '<span>', icon: '✏️' },
        { id: 'b', label: '<b>', icon: '𝐁' },
        { id: 'i', label: '<i>', icon: '𝑰' },
        { id: 'hr', label: '<hr>', icon: '━' },
      ]
    },
    {
      category: 'Media',
      elements: [
        { id: 'img', label: '<img>', icon: '🖼️' },
        { id: 'video', label: '<video>', icon: '🎥' },
        { id: 'audio', label: '<audio>', icon: '🔊' },
      ]
    },
    {
      category: 'Interaction',
      elements: [
        { id: 'button', label: '<button>', icon: '🔘' },
        { id: 'a', label: '<a>', icon: '🔗' },
        { id: 'form', label: '<form>', icon: '📝' },
        { id: 'input', label: '<input>', icon: '⌨️' },
        { id: 'textarea', label: '<textarea>', icon: '📄' },
        { id: 'select', label: '<select>', icon: '▼' },
      ]
    },
    {
      category: 'Lists & Tables',
      elements: [
        { id: 'ul', label: '<ul>', icon: '•' },
        { id: 'ol', label: '<ol>', icon: '①' },
        { id: 'li', label: '<li>', icon: '▸' },
        { id: 'table', label: '<table>', icon: '▦' },
        { id: 'tr', label: '<tr>', icon: '▬' },
        { id: 'th', label: '<th>', icon: '▤' },
        { id: 'td', label: '<td>', icon: '▢' },
      ]
    }
  ];

  return (
    <div className="sidebar">
      <h2>HTML Elements</h2>
      <div className="sidebar-scroll">
        {elementCategories.map((category, index) => (
          <div key={index} className="category-section">
            <h3 className="category-title">{category.category}</h3>
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
          </div>
        ))}
      </div>
      <div className="instructions">
        <h3>How to Play:</h3>
        <ol>
          <li>Drag HTML elements</li>
          <li>Drop on the canvas</li>
          <li>Build your website!</li>
        </ol>
      </div>
    </div>
  );
};

export default Sidebar;
