import React from 'react';

import { bem } from '../../lib';

import './index.scss';

interface Props extends React.PropsWithChildren, React.ButtonHTMLAttributes<HTMLButtonElement> {
    mix?: string;
    color?: 'blue' | 'orange' | 'violet';
    size?: 's' | 'm';
}

const b = bem('button');

export const Button = ({ color = 'blue', size = 's', mix, children, ...props }: Props) => {
    return (
        <button className={b(null, { color, size }, mix)} {...props}>
            {children}
        </button>
    );
};
