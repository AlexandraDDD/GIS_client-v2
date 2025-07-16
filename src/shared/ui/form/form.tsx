import React from 'react';
import cx from 'classnames';

import { Button } from '../button';
import type { Field, Input, Textarea, Select } from './types';

import styles from './form.module.css';

interface Props {
    fields: (Field | Field[])[];
    buttons: React.ComponentProps<typeof Button>[];
    onSubmit: (e: React.FormEvent) => void;
}

export const Form = ({ fields, buttons, onSubmit }: Props) => {
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <Fields fields={fields} />

            <div className={styles.btns}>
                {buttons.map(({ mix, children, ...props }) => (
                    <Button mix={cx(styles.btn, mix)} {...props}>
                        {children}
                    </Button>
                ))}
            </div>
        </form>
    );
};

export const Fields = ({ fields }: Pick<Props, 'fields'>) => (
    <>
        {fields.map((field) => {
            if (Array.isArray(field)) {
                return (
                    <div className={styles.fieldGroup}>
                        <Fields fields={field} />
                    </div>
                );
            }

            const { label, fieldType, ...rest } = field;

            if (fieldType === 'input') {
                const props = rest as Omit<Input, 'fieldType'>;

                return (
                    <label>
                        {label}:
                        <input className={styles.input} {...props} />
                    </label>
                );
            }

            if (fieldType === 'textarea') {
                const props = rest as Omit<Textarea, 'fieldType'>;

                return (
                    <label>
                        {label}:
                        <textarea className={styles.input} {...props} />
                    </label>
                );
            }

            if (fieldType === 'select') {
                const { options, ...props } = rest as Omit<Select, 'fieldType'>;

                return (
                    <label>
                        {label}:
                        <select className={styles.aspectSelect} {...props}>
                            {options.map(({ name, value }) => (
                                <option key={value} value={value}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </label>
                );
            }
        })}
    </>
);
