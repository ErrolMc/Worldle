export const WORD_LENGTH : number = 5;
export const MAX_ATTEMPTS : number = 6;

const API_BASE = import.meta.env.VITE_API_URL || 'https://localhost:7080';
export const AUTH_API_URL: string = `${API_BASE}/api/auth`;
export const GAME_API_URL: string = `${API_BASE}/api/game`;