import React from 'react';
import {IField} from '../types';

import style from './style.module.css';

interface Props {
  field: IField;
  isBombShown: boolean;
}

export default function Field({field, isBombShown}: Props) {
  let label: number | string = '';

  if (field.hasBomb && isBombShown) {
    label = '💣';
  } else if (field.bombsAround) {
    label = field.bombsAround;
  }

  return <button className={style.Field}>{label}</button>;
}
