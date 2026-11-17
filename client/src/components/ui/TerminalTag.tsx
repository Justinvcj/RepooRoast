import React from 'react';
import { Badge, type BadgeProps } from './Badge';

export type TerminalTagProps = BadgeProps;

export const TerminalTag: React.FC<TerminalTagProps> = (props) => {
  return <Badge bracketed={true} {...props} />;
};
