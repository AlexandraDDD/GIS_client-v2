import React from 'react';

import { Page } from '../../ui/page';

export class ErrorBoundary extends React.Component<React.PropsWithChildren> {
    constructor(props: React.PropsWithChildren) {
        super(props);
        this.state = { hasError: false };
    }

    state: { hasError: boolean };

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log('что-то свалилось :(, 2 ошибки ниже');
        console.error(error);
        console.error(errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Page>
                    <h2>
                        Что-то поломалось! Попробуй обратиться в поддержку по{' '}
                        <a href="https://vk.com/supercereal" target="_blank">
                            ссылке
                        </a>
                    </h2>
                </Page>
            );
        }

        return this.props.children;
    }
}
