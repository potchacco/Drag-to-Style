import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { DndContext } from '@dnd-kit/core';

function App() {
  const [canvasElements, setCanvasElements] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over, delta } = event;

    // Check if dragging from sidebar to canvas
    if (over && over.id === 'canvas' && !active.data.current?.isCanvasElement) {
      const elementType = active.id;
      
      // Get canvas bounds to calculate relative position
      const canvasElement = document.querySelector('.canvas-dropzone');
      const canvasRect = canvasElement?.getBoundingClientRect();
      
      // Calculate position relative to canvas
      let x = 50; // Default position
      let y = 50;
      
      if (canvasRect && event.activatorEvent) {
        // Get the mouse/touch position
        const clientX = event.activatorEvent.clientX || event.activatorEvent.touches?.[0]?.clientX || 0;
        const clientY = event.activatorEvent.clientY || event.activatorEvent.touches?.[0]?.clientY || 0;
        
        // Calculate relative position within canvas
        x = Math.max(10, clientX - canvasRect.left + delta.x);
        y = Math.max(10, clientY - canvasRect.top + delta.y);
      }
      
      const newElement = {
        id: `${elementType}-${Date.now()}`,
        type: elementType,
        content: '',
        position: { x, y },
      };
      setCanvasElements([...canvasElements, newElement]);
    }

    // Check if repositioning element on canvas
    if (active.data.current?.isCanvasElement && delta) {
      const elementId = active.id.replace('canvas-', '');
      setCanvasElements(canvasElements.map(el => {
        if (el.id === elementId) {
          return {
            ...el,
            position: {
              x: Math.max(0, (el.position?.x || 0) + delta.x),
              y: Math.max(0, (el.position?.y || 0) + delta.y)
            }
          };
        }
        return el;
      }));
    }

    setActiveId(null);
  };

  const removeElement = (id) => {
    setCanvasElements(canvasElements.filter(el => el.id !== id));
  };

  const updateElement = (id, updates) => {
    setCanvasElements(canvasElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const updatePosition = (id, position) => {
    setCanvasElements(canvasElements.map(el => 
      el.id === id ? { ...el, position } : el
    ));
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="App">
        <header className="header">
          <h1>🎨 Drag to Style</h1>
          <p>Drop the Design, Drop the Code!</p>
        </header>
        <Sidebar />
        <Canvas 
          elements={canvasElements} 
          onRemove={removeElement}
          onUpdate={updateElement}
          onPositionUpdate={updatePosition}
        />
      </div>
    </DndContext>
  );
}

export default App;