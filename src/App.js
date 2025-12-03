import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Login from './components/Login';
import { DndContext } from '@dnd-kit/core';
import { saveScore, getUserScores, getHighestScore } from './utils/scoreManager';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasElements, setCanvasElements] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [lastScore, setLastScore] = useState(null); // NEW: last score from Canvas

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('dragToStyleUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('dragToStyleUser');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      'Are you sure you want to logout? Your current design will be lost.'
    );
    if (confirmed) {
      localStorage.removeItem('dragToStyleUser');
      setUser(null);
      setCanvasElements([]);
      setLastScore(null);
    }
  };

  // SAVE SCORE FUNCTION - now uses lastScore from Canvas
  const handleSaveScore = () => {
    if (!user) {
      alert('Please login first!');
      return;
    }

    if (lastScore == null) {
      alert('Please check your score first (🏆 Check Score) before saving!');
      return;
    }

    saveScore(user.id, lastScore, canvasElements);
    alert('Score saved! 🎉');

    // Optional debug logs
    const userScores = getUserScores(user.id);
    console.log('All scores:', userScores);

    const highScore = getHighestScore(user.id);
    console.log('High score:', highScore);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over, delta } = event;

    if (over && over.id === 'canvas' && !active.data.current?.isCanvasElement) {
      const elementType = active.id;

      const canvasElement = document.querySelector('.canvas-dropzone');
      const canvasRect = canvasElement?.getBoundingClientRect();

      let x = 50;
      let y = 50;

      if (canvasRect && event.activatorEvent) {
        const clientX =
          event.activatorEvent.clientX ||
          event.activatorEvent.touches?.[0]?.clientX ||
          0;
        const clientY =
          event.activatorEvent.clientY ||
          event.activatorEvent.touches?.[0]?.clientY ||
          0;

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

    if (active.data.current?.isCanvasElement && delta) {
      const elementId = active.id.replace('canvas-', '');
      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === elementId) {
            return {
              ...el,
              position: {
                x: Math.max(0, (el.position?.x || 0) + delta.x),
                y: Math.max(0, (el.position?.y || 0) + delta.y),
              },
            };
          }
          return el;
        })
      );
    }

    setActiveId(null);
  };

  const removeElement = (id) => {
    setCanvasElements(canvasElements.filter((el) => el.id !== id));
  };

  const updateElement = (id, updates) => {
    setCanvasElements(
      canvasElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const updatePosition = (id, position) => {
    setCanvasElements(
      canvasElements.map((el) => (el.id === id ? { ...el, position } : el))
    );
  };

  const handleRestart = () => {
    if (canvasElements.length === 0) {
      alert('Canvas is already empty! 🎨');
      return;
    }

    const confirmed = window.confirm(
      `🔄 Are you sure you want to restart?\n\nThis will delete all ${canvasElements.length} elements on the canvas.`
    );

    if (confirmed) {
      setCanvasElements([]);
      setLastScore(null);
      alert('✅ Canvas cleared! Start fresh! 🎉');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.5rem',
        }}
      >
        Loading...
      </div>
    );
  }

  // Show login if no user
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Show game
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="App">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <h1>🎨 Drag to Style</h1>
              <p>
                Drop the Design, Drop the Code! | Welcome,{' '}
                <strong>{user.username}</strong>!
              </p>
            </div>
            <div className="header-actions">
              <button className="restart-btn" onClick={handleRestart}>
                🔄 Restart
              </button>
              <button className="save-btn" onClick={handleSaveScore}>
                💾 Save Score
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                👋 Logout
              </button>
            </div>
          </div>
        </header>
        <div className="main-content">
          <div className="sidebar-container">
            <Sidebar />
          </div>

          <div className="canvas-container-wrapper">
            <Canvas
              elements={canvasElements}
              onRemove={removeElement}
              onUpdate={updateElement}
              onPositionUpdate={updatePosition}
              user={user}                   // NEW: pass user
              onScoreChange={setLastScore}  // NEW: receive latest score
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default App;
