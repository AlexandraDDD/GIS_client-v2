import React from 'react';
import cx from 'classnames';

import { bem } from '../../lib';

import './spoiler.scss';

interface Props {
    title: string;
    badgeText?: string;
    defaultExpanded?: boolean;
    children?: React.ReactNode;
    mix?: string;
    color?: 'white' | 'gray';
}

const b = bem('spoiler');

export const Spoiler = ({ title, badgeText, defaultExpanded, children, mix, color = 'gray' }: Props) => {
    const [expanded, setExpanded] = React.useState(defaultExpanded ?? false);

    const handleExpand = () => {
        setExpanded((val) => !val);
    };

    return (
        <div className={cx(b(null, { color }), mix)}>
            <div className={b('controls')} onClick={handleExpand}>
                {badgeText && <div className={b('status-badge')} data-text={badgeText} />}

                <h2 className={b('title')}>{title}</h2>

                <svg
                    className={b('expand-button', { expanded })}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path d="M12 8L6 14L12 8Z" fill="#111111" />
                    <path
                        d="M18 14L12 8L6 14"
                        stroke="#AAAAAA"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {expanded && <div className={b('content')}>{children}</div>}
        </div>
    );
};
