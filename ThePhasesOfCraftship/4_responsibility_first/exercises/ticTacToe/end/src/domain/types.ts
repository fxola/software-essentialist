
// Types - level 1
export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Position = { row: number; col: number };

export interface GameEvent {
  type: 'MOVE';
  player: Player;
  position: Position;
  timestamp: number;
}