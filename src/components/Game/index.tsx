import React from 'react';
import {IField, Settings, TimerID} from '../types';
import {randomNumber} from '../../utils/helpers';

import style from './style.module.css';
import Field from '../Field';

interface Props {
  children?: React.ReactNode;
}

interface State {
  fields: IField[];
  timer: number;
  isPlaying: boolean;
  freeFlagsCount: number;
}

export default class Game extends React.PureComponent<Props, State> {
  state = {
    fields: [],
    timer: 0,
    isPlaying: false,
    freeFlagsCount: Settings.BOMBS_COUNT,
  };

  timerId!: TimerID;

  initStatistics() {
    this.setState({
      fields: [],
      timer: 0,
      isPlaying: false,
      freeFlagsCount: Settings.BOMBS_COUNT,
    });
  }

  play() {
    // Clear game values
    this.initStatistics();
    // Start timer
    this.timerId = setInterval(this.tick.bind(this), 1000);
    // Init random bomds
    this.initFields();
    // this.initNumbers();
  }

  start() {
    this.setState((state) => ({
      isPlaying: true,
    }));
    this.timerId = setInterval(this.tick.bind(this), 1000);
  }

  pause() {
    clearInterval(this.timerId);
    this.setState((state) => ({
      isPlaying: false,
    }));
  }

  tick() {
    this.setState((state) => ({
      timer: state.timer + 1,
    }));
  }

  initFields() {
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

    // Create fields
    Array.from(Array(Settings.FIELDS_COUNT).keys()).forEach((index) => {
      const y = Math.floor(index / Settings.FIELDS_CONSTRAINTS_Y) + 1;
      const x = (index % Settings.FIELDS_CONSTRAINTS_X) + 1;
      const id = index + 1;

      fields.push({
        id,
        coords: [y, x],
        isOpened: false,
        hasBomb: fieldsWithBombsIds.has(id),
        hasFlag: false,
        bombsAround: 0,
      });
    });

    this.setState({fields});
  }

  renderFields() {
    return Array.from(Array(Settings.FIELDS_COUNT).keys()).map((id) => (
      <Field
        field={{
          bombsAround: 0,
          hasBomb: false,
          id: id,
          coords: [0, 0],
          hasFlag: false,
          isOpened: false,
        }}
      />
    ));
  }

  render() {
    return (
      <div className={style.Game}>
        <section className={style.fields}>{this.renderFields()}</section>
        <aside className={style.aside}>
          <div className={style.stats}>
            <p>Time: 0:00</p>
            <p>Flags: 0/10</p>
          </div>
          <div className={style.buttonWrapper}>
            <button className={style.button}>Pause</button>
            <button className={style.button}>Play again</button>
          </div>
        </aside>
      </div>
    );
  }
}
