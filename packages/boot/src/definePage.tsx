import type React from 'react';
import { view } from '@risingstack/react-easy-state';

export function definePage(BaseComponent: React.ComponentType<any>) {
  return view(BaseComponent);
}
