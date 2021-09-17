import React from 'react';
import {IField} from '../types';

import style from './style.module.css';

interface Props {
  children?: React.ReactNode;
  field: IField;
}

export default function Field({children = ''}: Props) {
  return <button className={style.Field}>{children}</button>;
}
