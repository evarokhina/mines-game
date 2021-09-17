import React from 'react';

interface Props {
  children: React.ReactNode;
}

function Field(props: Props) {
  return <button>{props.children}</button>;
}
