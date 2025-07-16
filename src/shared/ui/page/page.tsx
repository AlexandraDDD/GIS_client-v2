import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

import { Layout } from '../layout';

import './page.scss';

interface Props extends PropsWithChildren {
    mix?: string;
}

export const Page = ({ children, mix }: Props) => (
    <div className={cx('page', mix)}>
        <Layout>{children}</Layout>
    </div>
);
