// У typescript-a проблемы с определением модульных css – плагин не помогает почему-то
declare module '*.module.css' {
    const x: Record<string, string | undefined>;
    export default x;
}

declare module '*.module.scss' {
    const x: Record<string, string | undefined>;
    export default x;
}
