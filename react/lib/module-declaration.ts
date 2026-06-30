import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import type { JBInputWebComponent } from 'jb-input';
import type { DirectProps } from './JBInput.js';

type JBInputType = DetailedHTMLProps<HTMLAttributes<JBInputWebComponent>, JBInputWebComponent> & DirectProps

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-input': JBInputType;
    }
  }
}
