import cx from 'classnames';

import styles from './loader.module.css';

// из отсюда стащил https://dev.to/kirteshbansal/spinner-loader-in-react-using-css-458h
/** Спиннер для отображения загрузки */
export const Loader = ({ className }: { className?: string }) => <div className={cx(styles.loader, className)} />;
