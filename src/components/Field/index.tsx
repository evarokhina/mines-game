import React from 'react';
import {IField} from '../types';

import style from './style.module.css';

interface Props {
  field: IField;
  isBombShown: boolean;
  onClick: (field: IField) => void;
}

export default function Field({field, isBombShown, onClick}: Props) {
  let label: number | string = '';

  if (field.hasBomb) {
    label = '💣';
  } else if (field.bombsAround) {
    label = field.bombsAround;
  }

  return (
    <button className={style.Field} onClick={() => onClick(field)}>
      {label}
    </button>
  );
}
