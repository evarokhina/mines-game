import React from 'react';
import cn from 'classnames';
import {IField} from '../types';

import style from './style.module.css';

interface Props {
  field: IField;
  isBombShown: boolean;
  onClick: (field: IField) => void;
}

export default function Field({field, isBombShown, onClick}: Props) {
  let label: number | string = '';

  if (field.isOpened) {
    if (field.hasBomb) {
      label = '💣';
    } else if (field.bombsAround) {
      label = field.bombsAround;
    }
  }

  const classes = cn({
    [style.Field]: true,
    [style.isOpened]: field.isOpened,
    [style.has]: field.isOpened,
  });

  return (
    <button className={classes} onClick={() => onClick(field)}>
      {label}
    </button>
  );
}
