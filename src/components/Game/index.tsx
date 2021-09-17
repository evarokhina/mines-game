import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function Game(props: Props) {
  return <button>{props.children}</button>;
}
