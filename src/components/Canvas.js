import React, { useState } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import './Canvas.css';

const DraggableCanvasElement = ({ element, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `canvas-${element.id}`,
    data: { isCanvasElement: true }
  });

  const style = {
    position: 'absolute',
    left: element.position?.x || 0,
    top: element.position?.y || 0,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isEditing ? 'text' : 'move',
    zIndex: isEditing ? 1000 : showColorPicker ? 999 : isDragging ? 998 : 1,
    width: element.width || 'auto',
    height: element.height || 'auto',
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    onUpdate(element.id, { content: e.target.value });
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && element.type !== 'p') {
      setIsEditing(false);
    }
  };

  const handleResize = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width || 200;
    const startHeight = element.height || 50;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      onUpdate(element.id, {
        width: Math.max(100, startWidth + deltaX),
        height: Math.max(30, startHeight + deltaY),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // COLOR PICKER HANDLERS - FIXED
  const handleBgColorChange = (e) => {
    e.stopPropagation();
    onUpdate(element.id, { bgColor: e.target.value });
  };

  const handleTextColorChange = (e) => {
    e.stopPropagation();
    onUpdate(element.id, { textColor: e.target.value });
  };

  const dragHandlers = isEditing ? {} : { ...listeners, ...attributes };

  const hasBackgroundColor = ['header', 'nav', 'button', 'footer', 'section'].includes(element.type);

  const elementStyle = {
    backgroundColor: element.bgColor,
    color: element.textColor,
    width: '100%',
    height: '100%',
  };

  const renderElement = () => {
    switch (element.type) {
      case 'header':
        return isEditing ? (
          <input type="text" value={content} onChange={handleContentChange} onBlur={handleBlur}
            onKeyPress={handleKeyPress} autoFocus className="edit-input header-input"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <header className="canvas-header" onDoubleClick={handleDoubleClick} style={elementStyle}>
            {content || 'Header Section'}
          </header>
        );
      case 'nav':
        return isEditing ? (
          <input type="text" value={content} onChange={handleContentChange} onBlur={handleBlur}
            onKeyPress={handleKeyPress} autoFocus className="edit-input"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <nav className="canvas-nav" onDoubleClick={handleDoubleClick} style={elementStyle}>
            {content || 'Navigation'}
          </nav>
        );
      case 'h1':
        return isEditing ? (
          <input type="text" value={content} onChange={handleContentChange} onBlur={handleBlur}
            onKeyPress={handleKeyPress} autoFocus className="edit-input h1-input"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <h1 className="canvas-h1" onDoubleClick={handleDoubleClick} style={{color: element.textColor}}>
            {content || 'Main Heading'}
          </h1>
        );
      case 'h2':
        return isEditing ? (
          <input type="text" value={content} onChange={handleContentChange} onBlur={handleBlur}
            onKeyPress={handleKeyPress} autoFocus className="edit-input h2-input"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <h2 className="canvas-h2" onDoubleClick={handleDoubleClick} style={{color: element.textColor}}>
            {content || 'Subheading'}
          </h2>
        );
      case 'h3':
        return isEditing ? (
          <input type="text" value={content} onChange={handleContentChange} onBlur={handleBlur}
            onKeyPress={handleKeyPress} autoFocus className="edit-input"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <h3 className="canvas-h3" onDoubleClick={handleDoubleClick} style={{color: element.textColor}}>
            {content || 'Heading 3'}
          </h3>
        );
      case 'p':
        return isEditing ? (
          <textarea value={content} onChange={handleContentChange} onBlur={handleBlur} autoFocus
            className="edit-textarea" rows="3" onClick={(e) => e.stopPropagation()} />
        ) : (
          <p className="canvas-p" onDoubleClick={handleDoubleClick} style={{color: element.textColor}}>
            {content || 'Paragraph text'}
          </p>
        );
      case 'button':
        return isEditing ? (
          <input type="text" value={content} onChange={handleContentChange} onBlur={handleBlur}
            onKeyPress={handleKeyPress} autoFocus className="edit-input"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <button className="canvas-button" onDoubleClick={handleDoubleClick} style={elementStyle}>
            {content || 'Click Me'}
          </button>
        );
      case 'a':
        return isEditing ? (
          <input type="text" value={content} onChange={handleContentChange} onBlur={handleBlur}
            onKeyPress={handleKeyPress} autoFocus className="edit-input"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <a href="#" className="canvas-link" onDoubleClick={handleDoubleClick} style={{color: element.textColor}}>
            {content || 'Link'}
          </a>
        );
      case 'img':
        return isEditing ? (
          <input type="text" value={content} onChange={handleContentChange} onBlur={handleBlur}
            onKeyPress={handleKeyPress} placeholder="Enter image URL" autoFocus className="edit-input"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <div className="canvas-img" onDoubleClick={handleDoubleClick}>
            {content ? (
              <img src={content} alt="User uploaded" style={{maxWidth: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover'}} />
            ) : '🖼️ Image'}
          </div>
        );
      case 'footer':
        return isEditing ? (
          <input type="text" value={content} onChange={handleContentChange} onBlur={handleBlur}
            onKeyPress={handleKeyPress} autoFocus className="edit-input"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <footer className="canvas-footer" onDoubleClick={handleDoubleClick} style={elementStyle}>
            {content || 'Footer'}
          </footer>
        );
      case 'section':
        return isEditing ? (
          <textarea value={content} onChange={handleContentChange} onBlur={handleBlur} autoFocus
            className="edit-textarea" rows="2" onClick={(e) => e.stopPropagation()} />
        ) : (
          <section className="canvas-section" onDoubleClick={handleDoubleClick} style={elementStyle}>
            {content || 'Section'}
          </section>
        );
      case 'div':
        return isEditing ? (
          <input type="text" value={content} onChange={handleContentChange} onBlur={handleBlur}
            onKeyPress={handleKeyPress} autoFocus className="edit-input"
            onClick={(e) => e.stopPropagation()} />
        ) : (
          <div className="canvas-div" onDoubleClick={handleDoubleClick} style={{color: element.textColor}}>
            {content || 'Container'}
          </div>
        );
      default:
        return <div className="default-element">{element.type}</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...dragHandlers} className="draggable-canvas-element">
      <div className="drag-handle" {...listeners}>⋮⋮</div>
      {renderElement()}
      
      {/* Color Picker Button */}
      <button 
        className="color-picker-btn" 
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowColorPicker(!showColorPicker);
        }}
        type="button"
      >
        🎨
      </button>

      {/* Color Picker Panel - ULTIMATE FIX */}
      {showColorPicker && (
        <div 
          className="color-picker-panel"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {hasBackgroundColor && (
            <div className="color-option">
              <label>Background:</label>
              <input 
                type="color" 
                value={element.bgColor || '#667eea'}
                onChange={handleBgColorChange}
                onInput={handleBgColorChange}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="mini-color-picker"
              />
            </div>
          )}
          <div className="color-option">
            <label>Text:</label>
            <input 
              type="color" 
              value={element.textColor || '#000000'}
              onChange={handleTextColorChange}
              onInput={handleTextColorChange}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="mini-color-picker"
            />
          </div>
          <button 
            className="close-picker-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(false);
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Resize Handle */}
      <div 
        className="resize-handle"
        onMouseDown={(e) => {
          e.stopPropagation();
          handleResize(e);
        }}
      >
        ↘
      </div>

      {/* Remove Button */}
      <button 
        className="remove-btn" 
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onRemove(element.id);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        type="button"
      >
        ✕
      </button>
    </div>
  );
};

const Canvas = ({ elements, onRemove, onUpdate }) => {
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');
  const [viewAllCode, setViewAllCode] = useState(true);
  const [selectedElement, setSelectedElement] = useState(null);
  const [bodyColor, setBodyColor] = useState('#ffffff');
  const [showGrid, setShowGrid] = useState(true);
  
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const generateElementCode = (element) => {
    const content = element.content || getDefaultContent(element.type);
    const indent = '  ';
    
    switch (element.type) {
      case 'header':
        return `${indent}<header>\n${indent}  ${content}\n${indent}</header>`;
      case 'nav':
        return `${indent}<nav>\n${indent}  ${content}\n${indent}</nav>`;
      case 'h1':
        return `${indent}<h1>${content}</h1>`;
      case 'h2':
        return `${indent}<h2>${content}</h2>`;
      case 'h3':
        return `${indent}<h3>${content}</h3>`;
      case 'p':
        return `${indent}<p>${content}</p>`;
      case 'button':
        return `${indent}<button>${content}</button>`;
      case 'a':
        return `${indent}<a href="#">${content}</a>`;
      case 'img':
        return `${indent}<img src="${content || 'image.jpg'}" alt="Image">`;
      case 'footer':
        return `${indent}<footer>\n${indent}  ${content}\n${indent}</footer>`;
      case 'section':
        return `${indent}<section>\n${indent}  ${content}\n${indent}</section>`;
      case 'div':
        return `${indent}<div>${content}</div>`;
      default:
        return `${indent}<${element.type}>${content}</${element.type}>`;
    }
  };

  const generateHTMLCode = () => {
    if (elements.length === 0) {
      return '<!-- Drag elements to see HTML code here -->';
    }

    const sortedElements = [...elements].sort((a, b) => {
      const aY = a.position?.y || 0;
      const bY = b.position?.y || 0;
      return aY - bY;
    });

    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '  <title>My Website</title>\n';
    html += '  <style>\n';
    html += `    body {\n`;
    html += `      background-color: ${bodyColor};\n`;
    html += `      margin: 0;\n`;
    html += `      padding: 20px;\n`;
    html += `      font-family: Arial, sans-serif;\n`;
    html += `    }\n`;
    html += '  </style>\n';
    html += '</head>\n';
    html += '<body>\n\n';

    if (viewAllCode) {
      sortedElements.forEach(element => {
        html += generateElementCode(element) + '\n\n';
      });
    } else if (selectedElement) {
      html += generateElementCode(selectedElement) + '\n\n';
    }

    html += '</body>\n</html>';
    return html;
  };

  const getDefaultContent = (type) => {
    const defaults = {
      header: 'Header Section',
      nav: 'Navigation',
      h1: 'Main Heading',
      h2: 'Subheading',
      h3: 'Heading 3',
      p: 'Paragraph text',
      button: 'Click Me',
      a: 'Link',
      img: '',
      footer: 'Footer',
      section: 'Section',
      div: 'Container'
    };
    return defaults[type] || 'Content';
  };

  const copyCodeToClipboard = () => {
    const code = generateHTMLCode();
    navigator.clipboard.writeText(code).then(() => {
      alert('✅ HTML code copied to clipboard!');
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    const feedback = [];
    
    const headerElement = elements.find(el => el.type === 'header');
    if (headerElement) {
      if (headerElement.position?.y < 100) {
        totalScore += 20;
        feedback.push('✅ Header at top (+20 points)');
      } else {
        feedback.push('⚠️ Header should be at the top');
      }
    } else {
      feedback.push('❌ Missing header element');
    }
    
    const navElement = elements.find(el => el.type === 'nav');
    if (navElement) {
      totalScore += 15;
      feedback.push('✅ Navigation included (+15 points)');
    } else {
      feedback.push('❌ Missing navigation');
    }
    
    const h1Element = elements.find(el => el.type === 'h1');
    if (h1Element) {
      if (h1Element.content && h1Element.content.length > 0) {
        totalScore += 15;
        feedback.push('✅ Main heading with content (+15 points)');
      } else {
        totalScore += 5;
        feedback.push('⚠️ Main heading needs content (+5 points)');
      }
    } else {
      feedback.push('❌ Missing main heading (h1)');
    }
    
    const paragraphs = elements.filter(el => el.type === 'p');
    if (paragraphs.length > 0) {
      totalScore += Math.min(paragraphs.length * 10, 30);
      feedback.push(`✅ Content paragraphs (+${Math.min(paragraphs.length * 10, 30)} points)`);
    } else {
      feedback.push('❌ Missing content paragraphs');
    }
    
    const footerElement = elements.find(el => el.type === 'footer');
    if (footerElement) {
      if (footerElement.position?.y > 400) {
        totalScore += 20;
        feedback.push('✅ Footer at bottom (+20 points)');
      } else {
        totalScore += 10;
        feedback.push('⚠️ Footer should be at the bottom (+10 points)');
      }
    } else {
      feedback.push('❌ Missing footer');
    }
    
    if (elements.length >= 5) {
      totalScore += 10;
      feedback.push('✅ Good content variety (+10 points)');
    }
    
    const customContent = elements.filter(el => el.content && el.content.length > 0);
    if (customContent.length >= 3) {
      totalScore += 10;
      feedback.push('✅ Customized content (+10 points)');
    }
    
    return { totalScore, feedback };
  };

  const handleCheckScore = () => {
    const result = calculateScore();
    setScore(result.totalScore);
    setShowScore(true);
    setActiveTab('score');
  };

  const renderPreviewElement = (element) => {
    const content = element.content || '';
    const style = {
      position: 'absolute',
      left: element.position?.x || 0,
      top: element.position?.y || 0,
      width: element.width || 'auto',
      height: element.height || 'auto',
      backgroundColor: element.bgColor,
      color: element.textColor,
    };

    switch (element.type) {
      case 'header': 
        return <header key={element.id} className="preview-header" style={style}>{content || 'Header'}</header>;
      case 'nav': 
        return <nav key={element.id} className="preview-nav" style={style}>{content || 'Nav'}</nav>;
      case 'h1': 
        return <h1 key={element.id} style={style}>{content || 'Heading 1'}</h1>;
      case 'h2': 
        return <h2 key={element.id} style={style}>{content || 'Heading 2'}</h2>;
      case 'h3': 
        return <h3 key={element.id} style={style}>{content || 'Heading 3'}</h3>;
      case 'p': 
        return <p key={element.id} style={style}>{content || 'Paragraph'}</p>;
      case 'button': 
        return <button key={element.id} className="preview-button" style={style}>{content || 'Button'}</button>;
      case 'a': 
        return <a key={element.id} href="#" className="preview-link" style={style}>{content || 'Link'}</a>;
      case 'img': 
        return content ? 
          <img key={element.id} src={content} alt="preview" className="preview-img" style={style} /> : 
          <div key={element.id} className="preview-img-placeholder" style={style}>🖼️</div>;
      case 'footer': 
        return <footer key={element.id} className="preview-footer" style={style}>{content || 'Footer'}</footer>;
      case 'section': 
        return <section key={element.id} className="preview-section" style={style}>{content || 'Section'}</section>;
      case 'div': 
        return <div key={element.id} className="preview-div" style={style}>{content || 'Div'}</div>;
      default: 
        return null;
    }
  };

  return (
    <div className="canvas-container">
      <div className="canvas-wrapper">
        <div className="canvas-header-bar">
          <h2>Design Canvas</h2>
          <div className="canvas-controls">
            <label className="color-picker-label">
              Background:
              <input 
                type="color" 
                value={bodyColor} 
                onChange={(e) => setBodyColor(e.target.value)}
                className="color-picker"
              />
            </label>
            <button 
              className="grid-toggle-btn" 
              onClick={() => setShowGrid(!showGrid)}
            >
              {showGrid ? '🔲 Hide Grid' : '▢ Show Grid'}
            </button>
            <span className="element-count">{elements.length} elements</span>
            <button className="score-btn" onClick={handleCheckScore}>
              🏆 Check Score
            </button>
          </div>
        </div>
        <div 
          ref={setNodeRef} 
          className={`canvas-dropzone ${showGrid ? 'with-grid' : ''}`}
          style={{backgroundColor: bodyColor}}
        >
          {elements.length === 0 ? (
            <div className="empty-state">
              <p>👆 Drag elements here to start designing!</p>
              <p className="hint">💡 Double-click to edit | Drag ⋮⋮ to move | 🎨 to color | ↘ to resize</p>
            </div>
          ) : (
            <>
              {elements.map((element) => (
                <DraggableCanvasElement
                  key={element.id}
                  element={element}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <div className="preview-panel">
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            👁️ Preview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            💻 HTML Code
          </button>
          <button 
            className={`tab-btn ${activeTab === 'score' ? 'active' : ''}`}
            onClick={() => setActiveTab('score')}
          >
            📊 Score
          </button>
        </div>

        {activeTab === 'preview' && (
          <div className="preview-content">
            <h4>Live Preview (Position Accurate):</h4>
            {elements.length === 0 ? (
              <p className="empty-preview">No elements yet. Start dragging!</p>
            ) : (
              <div className="preview-canvas" style={{backgroundColor: bodyColor}}>
                {elements.map((element) => renderPreviewElement(element))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="code-content">
            <div className="code-header">
              <h4>
                {viewAllCode ? 'Complete HTML Code' : `Code for: ${selectedElement?.type || 'element'}`}
              </h4>
              <div className="code-controls">
                <button 
                  className={`view-toggle-btn ${viewAllCode ? 'active' : ''}`}
                  onClick={() => setViewAllCode(true)}
                >
                  View All
                </button>
                <button className="copy-btn" onClick={copyCodeToClipboard}>
                  📋 Copy
                </button>
              </div>
            </div>
            {!viewAllCode && (
              <p className="code-hint">💡 Click an element on the canvas to see its code, or click "View All"</p>
            )}
            <pre className="code-block">
              <code>{generateHTMLCode()}</code>
            </pre>
          </div>
        )}

        {activeTab === 'score' && showScore && (
          <div className="score-content">
            <div className="score-display">
              <div className="score-number">
                <h2>{score}/100</h2>
                <p className="score-grade">
                  {score >= 90 ? '🌟 Excellent!' : 
                   score >= 70 ? '👍 Great!' : 
                   score >= 50 ? '😊 Good!' : 
                   '💪 Keep trying!'}
                </p>
              </div>
              <div className="score-feedback">
                <h4>Feedback:</h4>
                <ul>
                  {calculateScore().feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
