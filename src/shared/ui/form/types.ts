export interface Input extends React.InputHTMLAttributes<HTMLInputElement> {
    fieldType: 'input';
    options?: undefined;
}
export interface Textarea extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    fieldType: 'textarea';
    options?: undefined;
}
export interface Select extends React.SelectHTMLAttributes<HTMLSelectElement> {
    fieldType: 'select';
    options: {
        value: string | number;
        name: string;
    }[];
}

export type Field = { label: string } & (Input | Textarea | Select);
