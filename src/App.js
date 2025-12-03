import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Login from './components/Login';
import { DndContext } from '@dnd-kit/core';
import { saveScore, getUserScores, getHighestScore } from './utils/scoreManager';
import GameModal from './components/GameModal';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasElements, setCanvasElements] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [lastScore, setLastScore] = useState(null);

  // Global modal state
  const [modalState, setModalState] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'OK',
    cancelLabel: null,
    onConfirm: null,
  });

  const showModal = ({
    title = '',
    message = '',
    confirmLabel = 'OK',
    cancelLabel = null,
    onConfirm = null,
  }) => {
    setModalState({
      open: true,
      title,
      message,
      confirmLabel,
      cancelLabel,
      onConfirm: onConfirm
        ? () => {
            setModalState((prev) => ({ ...prev, open: false }));
            onConfirm();
          }
        : () => setModalState((prev) => ({ ...prev, open: false })),
    });
  };

  const hideModal = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };

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
    showModal({
      title: 'Logout?',
      message: 'Are you sure you want to logout? Your current design will be lost.',
      confirmLabel: 'Logout',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        localStorage.removeItem('dragToStyleUser');
        setUser(null);
        setCanvasElements([]);
        setLastScore(null);
      },
    });
  };

  // SAVE SCORE FUNCTION - now uses lastScore from Canvas
  const handleSaveScore = () => {
    if (!user) {
      showModal({
        title: 'Login required',
        message: 'Please login first before saving a score.',
        confirmLabel: 'OK',
      });
      return;
    }

    if (lastScore == null) {
      showModal({
        title: 'Check score first',
        message: 'Use 🏆 Check Score before saving so there is a score to save.',
        confirmLabel: 'Got it',
      });
      return;
    }

    saveScore(user.id, lastScore, canvasElements);

    showModal({
      title: 'Score saved',
      message: `Your score of ${lastScore}/100 has been saved locally on this device.`,
      confirmLabel: 'Nice!',
    });

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

  // Dropping a new element from the sidebar onto the canvas
  if (over && over.id === 'canvas' && !active.data.current?.isCanvasElement) {
    const elementType = active.id;

    const canvasElement = document.querySelector('.canvas-dropzone');
    const canvasRect = canvasElement?.getBoundingClientRect();

    let x = 50;
    let y = 50;
    let width;
    let height;

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

    // Special behavior for footer: full width at bottom like a real footer
    if (canvasRect && elementType === 'footer') {
      x = 0;
      const footerHeight = 80;
      width = canvasRect.width;
      height = footerHeight;
      y = Math.max(canvasRect.height - footerHeight - 20, 10);
    }

    const newElement = {
      id: `${elementType}-${Date.now()}`,
      type: elementType,
      content: '',
      position: { x, y },
      ...(width !== undefined ? { width } : {}),
      ...(height !== undefined ? { height } : {}),
    };

    setCanvasElements((prev) => [...prev, newElement]);
  }

  // Moving an existing canvas element
  if (active.data.current?.isCanvasElement && delta) {
    const elementId = active.id.replace('canvas-', '');
    setCanvasElements((prev) =>
      prev.map((el) => {
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
    setCanvasElements((prev) => prev.filter((el) => el.id !== id));
  };

  const updateElement = (id, updates) => {
    setCanvasElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const updatePosition = (id, position) => {
    setCanvasElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, position } : el))
    );
  };

  const handleRestart = () => {
    if (canvasElements.length === 0) {
      showModal({
        title: 'Nothing to clear',
        message: 'The canvas is already empty. Drag elements from the sidebar to start designing.',
        confirmLabel: 'OK',
      });
      return;
    }

    showModal({
      title: 'Restart design?',
      message: `This will delete all ${canvasElements.length} elements on the canvas and clear the last score.`,
      confirmLabel: 'Restart',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        setCanvasElements([]);
        setLastScore(null);
      },
    });
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
              user={user}
              onScoreChange={setLastScore}
              onShowModal={showModal}
            />
          </div>
        </div>
      </div>

      <GameModal
        open={modalState.open}
        title={modalState.title}
        message={modalState.message}
        confirmLabel={modalState.confirmLabel}
        cancelLabel={modalState.cancelLabel}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.cancelLabel ? hideModal : null}
      />
    </DndContext>
  );
}

export default App;
