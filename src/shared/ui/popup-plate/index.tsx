import React, { useEffect } from 'react';
import cx from 'classnames';

import { bem } from '../../lib';

import './index.scss';

interface Props {
    title: string;
    status: 'finished' | 'locked' | 'active' | 'finish-stantion';
    numberic?: number;
    defaultExpanded?: boolean;
    children?: React.ReactNode;
    mix?: string;
    color: 'white' | 'gray';
}

const b = bem('popup-plate');

export const PopupPlate = ({ title, status, numberic, defaultExpanded, children, mix, color }: Props) => {
    const [expanded, setExpanded] = React.useState(status === 'active' && (defaultExpanded ?? false));

    const handleExpand = () => {
        if (status === 'active' || status === 'finish-stantion') {
            setExpanded((val) => !val);
        }
    };

    useEffect(() => {
        if (status !== 'active') {
            setExpanded(false);
        }
    }, [status]);

    return (
        <div className={cx(b(null, { status, color }), mix)}>
            <div className={b('controls')} onClick={handleExpand}>
                <div className={b('status-badge', { status })} data-numberic={numberic} />

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
