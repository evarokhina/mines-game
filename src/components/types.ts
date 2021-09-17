export type Coords = {
  y: number;
  x: number;
};

export interface IField {
  id: number;
  coords: Coords;
  isOpened: boolean;
  hasBomb: boolean;
  hasFlag: boolean;
  bombsAround: number;
}

export enum Settings {
  FIELDS_COUNT = 64,
  FIELDS_CONSTRAINTS_X = 8,
  FIELDS_CONSTRAINTS_Y = 8,
  BOMBS_COUNT = 10,
}

export enum GameState {
  IDLE,
  PLAYING,
  PAUSE,
  GAME_OVER,
}

export type TimerID = ReturnType<typeof setTimeout>;
