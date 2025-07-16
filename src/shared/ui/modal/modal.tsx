import React, { useEffect, type PropsWithChildren } from 'react';

import styles from './modal.module.css';

interface Props extends PropsWithChildren {
    onClose: () => void;
}

export const Modal = ({ children, onClose }: Props) => {
    useEffect(() => {
        const close = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', close);
        return () => window.removeEventListener('keydown', close);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.overlay} onClick={onClose} />

            <div className={styles.content}>{children}</div>
        </div>
    );
};
