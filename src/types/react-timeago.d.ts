declare module 'react-timeago' {
  import React from 'react';

  interface ReactTimeAgoProps {
    date: string | number | Date;
    formatter?: (value: number, unit: string, suffix?: string) => React.ReactNode;
    live?: boolean;
  }

  export default function ReactTimeAgo(props: ReactTimeAgoProps): JSX.Element;
}
