import React from 'react';
import {GameState, IField, Settings, TimerID} from '../types';
import {randomNumber} from '../../utils/helpers';

import style from './style.module.css';
import Field from '../Field';

interface Props {
  children?: React.ReactNode;
}

interface State {
  fields: IField[];
  timer: number;
  gameState: GameState;
  freeFlagsCount: number;
}

export default class Game extends React.PureComponent<Props, State> {
  state = {
    fields: this.generateFields(),
    timer: 0,
    gameState: GameState.IDLE,
    freeFlagsCount: Settings.BOMBS_COUNT,
  };

  timerId!: TimerID;

  get playButtonLabel(): string {
    if (this.state.gameState === GameState.IDLE) {
      return 'Play';
    }

    return 'Play again';
  }

  get pauseButtonLabel(): string {
    switch (this.state.gameState) {
      case GameState.PAUSE:
        return 'Continue';
      default:
        return 'Pause';
    }
  }

  initGameState() {
    this.setState({
      fields: this.generateFields(),
      timer: 0,
      gameState: GameState.PLAYING,
      freeFlagsCount: Settings.BOMBS_COUNT,
    });
  }

  play() {
    // Clear game values
    this.initGameState();
    // Start timer
    clearInterval(this.timerId);
    this.timerId = setInterval(this.tick.bind(this), 1000);
  }

  continue() {
    this.setState((state) => ({
      gameState: GameState.PLAYING,
    }));
    this.timerId = setInterval(this.tick.bind(this), 1000);
  }

  pause() {
    clearInterval(this.timerId);
    this.setState((state) => ({
      gameState: GameState.PAUSE,
    }));
  }

  tick() {
    this.setState((state) => ({
      timer: state.timer + 1,
    }));
  }

  generateFields() {
    const fieldsWithBombsIds: Set<number> = new Set();
    const fields: IField[] = [];

    // Random ID generator for BOMBS_COUNT bombs
    const generateRandomBomds = () => {
      fieldsWithBombsIds.add(randomNumber(1, Settings.FIELDS_COUNT));
      if (fieldsWithBombsIds.size < Settings.BOMBS_COUNT) {
        generateRandomBomds();
      }
    };

    generateRandomBomds();

    // Create basic fields with coords
    Array.from(Array(Settings.FIELDS_COUNT).keys()).forEach((index) => {
      const y = Math.floor(index / Settings.FIELDS_CONSTRAINTS_Y) + 1;
      const x = (index % Settings.FIELDS_CONSTRAINTS_X) + 1;
      const id = index + 1;

      fields.push({
        id,
        coords: {y, x},
        isOpened: false,
        hasBomb: fieldsWithBombsIds.has(id),
        hasFlag: false,
        bombsAround: 0,
      });
    });

    const findFieldByCoords = (x: number, y: number): IField | undefined => {
      return fields.find((field) => field.coords.y === y && field.coords.x === x);
    };

    const isInBoundaries = (x: number, y: number): boolean => {
      return x >= 1 || x <= Settings.FIELDS_CONSTRAINTS_X || y >= 1 || y <= Settings.FIELDS_CONSTRAINTS_Y;
    };

    // Create bombsAround logic
    for (const field of fields) {
      if (field.hasBomb) {
        const {x, y} = field.coords;
        const foundFields: Array<IField | undefined> = [];

        isInBoundaries(x - 1, y - 1) && foundFields.push(findFieldByCoords(x - 1, y - 1));
        isInBoundaries(x, y - 1) && foundFields.push(findFieldByCoords(x, y - 1));
        isInBoundaries(x + 1, y - 1) && foundFields.push(findFieldByCoords(x + 1, y - 1));
        isInBoundaries(x - 1, y) && foundFields.push(findFieldByCoords(x - 1, y));
        isInBoundaries(x + 1, y) && foundFields.push(findFieldByCoords(x + 1, y));
        isInBoundaries(x - 1, y + 1) && foundFields.push(findFieldByCoords(x - 1, y + 1));
        isInBoundaries(x, y + 1) && foundFields.push(findFieldByCoords(x, y + 1));
        isInBoundaries(x + 1, y + 1) && foundFields.push(findFieldByCoords(x + 1, y + 1));

        foundFields.forEach((field) => field && field.bombsAround++);
      }
    }

    return fields;
  }

  handlePlayButtonClick = () => {
    this.play();
  };

  handlePauseButtonClick = () => {
    this.pause();
    if (this.state.gameState === GameState.PAUSE) {
      this.continue();
    } else {
      this.pause();
    }
  };

  handleFieldClick = (clickedField: IField) => {
    if (clickedField.hasBomb) {
      return this.setState((state) => ({
        // TODO: add gameOver() method
        gameState: GameState.GAME_OVER,
        fields: state.fields.map((field) => ({
          ...field,
          isOpened: field.hasBomb,
        })),
      }));
    }

    this.setState((state) => ({
      fields: state.fields.map((field) => ({
        ...field,
        isOpened: field.isOpened ? true : clickedField.id === field.id,
      })),
    }));
  };

  renderFields() {
    return this.state.fields.map((field) => (
      <Field
        key={field.id}
        field={field}
        isBombShown={this.state.gameState === GameState.GAME_OVER}
        onClick={this.handleFieldClick}
      />
    ));
  }

  render() {
    return (
      <div className={style.Game}>
        <section className={style.fields}>{this.renderFields()}</section>
        <aside className={style.aside}>
          <div className={style.stats}>
            <p>Time: 0:{this.state.timer}</p>
            <p>Flags: 0/10</p>
          </div>
          <div className={style.buttonWrapper}>
            <button className={style.button} onClick={this.handlePlayButtonClick}>
              {this.playButtonLabel}
            </button>
            {this.state.gameState === GameState.IDLE || (
              <button className={style.button} onClick={this.handlePauseButtonClick}>
                {this.pauseButtonLabel}
              </button>
            )}
          </div>
        </aside>
      </div>
    );
  }
}
