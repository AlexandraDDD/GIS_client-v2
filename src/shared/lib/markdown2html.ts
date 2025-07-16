import { marked } from 'marked';

export const markdown2html = (markdown: string) => {
    // при желании можно настроить то как будет рендерится отдельно взятый элемент
    return marked.parse(markdown);
}