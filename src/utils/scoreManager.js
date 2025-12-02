// src/utils/scoreManager.js

// Save score for a user
export const saveScore = (userId, score, designData) => {
  const scores = JSON.parse(localStorage.getItem('dragToStyleScores') || '[]');
  
  const newScore = {
    id: Date.now(),
    userId: userId,
    score: score,
    designData: designData, // Store the canvas elements
    createdAt: new Date().toISOString()
  };
  
  scores.push(newScore);
  localStorage.setItem('dragToStyleScores', JSON.stringify(scores));
  
  return newScore;
};

// Get all scores for a user
export const getUserScores = (userId) => {
  const scores = JSON.parse(localStorage.getItem('dragToStyleScores') || '[]');
  return scores.filter(s => s.userId === userId).sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
};

// Get highest score for a user
export const getHighestScore = (userId) => {
  const userScores = getUserScores(userId);
  if (userScores.length === 0) return 0;
  return Math.max(...userScores.map(s => s.score));
};

// Get all users (for leaderboard)
export const getAllUsers = () => {
  return JSON.parse(localStorage.getItem('dragToStyleUsers') || '[]');
};

// Get leaderboard (top 10 users by highest score)
export const getLeaderboard = () => {
  const users = getAllUsers();
  const leaderboard = users.map(user => ({
    username: user.username,
    highestScore: getHighestScore(user.id),
    userId: user.id
  }));
  
  return leaderboard
    .sort((a, b) => b.highestScore - a.highestScore)
    .slice(0, 10);
};
