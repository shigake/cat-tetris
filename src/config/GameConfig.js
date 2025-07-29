export const GameConfig = {
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 20,
  INITIAL_DROP_TIME: 1000,
  LOCK_DELAY: 500,
  SOFT_DROP_MULTIPLIER: 20,
  NEXT_PIECES_COUNT: 3,
  BAG_SIZE: 7,
  KICK_OFFSETS: [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 }
  ],
  DROP_TIMES: [
    1000, 850, 700, 600, 500, 400, 350, 300, 250, 200,
    150, 100, 80, 60, 50
  ],
  LEVEL_LINES_REQUIREMENT: 10,
  MAX_LEVEL: 15
}; 