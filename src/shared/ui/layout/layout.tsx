import React, { type PropsWithChildren } from 'react';
import cx from 'classnames';

import './layout.scss';

interface Props extends PropsWithChildren {
    mix?: string;
}

export const Layout = ({ children, mix }: Props) => {
    return <div className={cx('layout', mix)}>{children}</div>;
};
