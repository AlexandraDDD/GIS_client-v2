import React from 'react';
import cx from 'classnames';

import { Copy as CopyIcon } from 'react-bootstrap-icons';

import styles from './text-with-copy.module.css';

/** Рендерит текст с кнопкой "копировать" */
export const TextWithCopy = ({
    title,
    text,
    color = 'gray',
}: {
    title: string;
    text?: string;
    color?: 'gray' | 'black';
}) => {
    const handleCopyId = () => {
        if (text) {
            navigator.clipboard.writeText(text);
        }
    };

    const value = text ? text.slice(0, 15) : '-';
    const dots = text && text.length > 15 && '...';

    return (
        <div className={cx(styles.box, color === 'black' && styles.black)}>
            <span>
                {title}: {value} {dots}
            </span>
            <CopyIcon className={styles.copy} onClick={handleCopyId} />
        </div>
    );
};
