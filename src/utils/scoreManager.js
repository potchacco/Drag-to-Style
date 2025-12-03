// src/utils/scoreManager.js

const USERS_KEY = 'dragToStyleUsers';
const SCORES_KEY = 'dragToStyleScores';
const CURRENT_USER_KEY = 'dragToStyleUser';

function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    return data ?? fallback;
  } catch (e) {
    console.error('Failed to parse localStorage key:', key, e);
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ===== USERS =====

export function getUsers() {
  return safeParse(USERS_KEY, []);
}

function saveUsers(users) {
  saveJson(USERS_KEY, users);
}

/**
 * Get existing user by username (case-insensitive) or create a new one.
 * Also updates lastLogin and stores CURRENT_USER_KEY.
 */
export function getOrCreateUser(username) {
  const trimmed = username.trim();
  const normalized = trimmed.toLowerCase();
  const now = new Date().toISOString();

  let users = getUsers();
  let user = users.find((u) => u.normalizedUsername === normalized);

  if (user) {
    user.lastLogin = now;
  } else {
    user = {
      id: Date.now(),           // simple unique id per device
      username: trimmed,        // display name (keeps original case)
      normalizedUsername: normalized,
      createdAt: now,
      lastLogin: now,
    };
    users.push(user);
  }

  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  return user;
}

// ===== SCORES =====

export function getAllScores() {
  return safeParse(SCORES_KEY, []);
}

function saveAllScores(scores) {
  saveJson(SCORES_KEY, scores);
}

/**
 * Save a score for a given user.
 * layoutElements is optional extra data about the design.
 */
export function saveScore(userId, score, layoutElements = []) {
  const scores = getAllScores();
  const entry = {
    id: Date.now(),
    userId,
    score,
    createdAt: new Date().toISOString(),
    layout: layoutElements,
  };
  scores.push(entry);
  saveAllScores(scores);
}

/**
 * Returns scores for a specific user, newest first.
 */
export function getUserScores(userId) {
  return getAllScores()
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Highest score for a user, or null if none.
 */
export function getHighestScore(userId) {
  const scores = getUserScores(userId);
  if (!scores.length) return null;
  return Math.max(...scores.map((s) => s.score));
}

/**
 * Stats for the profile box.
 */
export function getUserStats(userId) {
  const scores = getUserScores(userId);
  if (!scores.length) {
    return {
      highestScore: null,
      lastScore: null,
      averageScore: null,
      totalGames: 0,
      lastPlayed: null,
    };
  }

  const totalGames = scores.length;
  const highestScore = Math.max(...scores.map((s) => s.score));
  const lastScore = scores[0].score;
  const lastPlayed = scores[0].createdAt;
  const averageScore = Math.round(
    scores.reduce((sum, s) => sum + s.score, 0) / totalGames
  );

  return {
    highestScore,
    lastScore,
    averageScore,
    totalGames,
    lastPlayed,
  };
}

/**
 * Leaderboard across all users on this device.
 * Returns [{ userId, username, bestScore, lastScore, lastPlayed }, ...]
 */
export function getLeaderboard(limit = 10) {
  const users = getUsers();
  const scores = getAllScores();

  const userScoresMap = new Map();

  for (const s of scores) {
    if (!userScoresMap.has(s.userId)) {
      userScoresMap.set(s.userId, []);
    }
    userScoresMap.get(s.userId).push(s);
  }

  const rows = [];

  for (const [userId, userScores] of userScoresMap.entries()) {
    const user = users.find((u) => u.id === userId);
    const username = user ? user.username : 'Unknown';

    const bestScore = Math.max(...userScores.map((s) => s.score));

    // newest first
    userScores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const lastScore = userScores[0].score;
    const lastPlayed = userScores[0].createdAt;

    rows.push({
      userId,
      username,
      bestScore,
      lastScore,
      lastPlayed,
    });
  }

  // sort by best score desc
  rows.sort((a, b) => b.bestScore - a.bestScore);

  return rows.slice(0, limit);
}
