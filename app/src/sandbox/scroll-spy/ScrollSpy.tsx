import { ReactNode, useCallback, useEffect, useState } from 'react';

export interface IScrollSpyApi {
    scrollToElement: (item?: string, selector?: string) => void;
    currentActive?: string;
    setRef: (ref: HTMLElement) => void;
}
interface IScrollSpyProps {
    root?: HTMLElement;
    elements?: Readonly<string[]>;
    selector?: string;
    initialActive?: string;
    options?: IntersectionObserverInit;
    children?: (api: IScrollSpyApi) => ReactNode;
}

export function useScrollSpy(
    elements?: IScrollSpyProps['elements'],
    initialActive?: string,
    options?: IScrollSpyProps['options']
) : IScrollSpyApi {
    const [ref, setRef] = useState<HTMLElement>(null);
    const [observedNodes, setObservedNodes] = useState<HTMLElement[]>([]);
    const [currentActive, setCurrentActive] = useState<string>(
        initialActive || (Array.isArray(elements) && elements.length > 0 && elements[0])
    );

    const getElement = useCallback((root: IScrollSpyProps['root'], id?: string, selector?: IScrollSpyProps['selector']): HTMLElement => {
        return root.querySelector(selector || `[id='${id}'], [data-spy='${id}'], [name='${id}'], [class='${id}']`)
    }, []);

    const scrollToElement = useCallback(
        ({ root, elements }: Pick<IScrollSpyProps, 'root' | 'elements'>): IScrollSpyApi['scrollToElement'] => {
            return (item, selector) => {
                let element;

                if (item && elements && elements.includes(item)) {
                    const selected = elements.find(i => i === item);
                    if (selected) element = getElement(root, selected);
                } else if (!elements && !item && selector) {
                    element = getElement(root, undefined, selector);
                }

                if (element) {
                    element.scrollIntoView({ block: 'start', behavior: 'smooth' });
                } else return;
            };
        }, []
    );

    useEffect(() => {
        if (!ref || !elements || !Array.isArray(elements) || elements.length === 0) return;
        setObservedNodes(elements.map(element => getElement(ref, element)));
    }, [ref]);

    useEffect(() => {
        if (observedNodes.length === 0) return;

        const observer = new IntersectionObserver(entries => {
            const intersectingElement = entries.find(entry => entry.isIntersecting) as any;
            setCurrentActive(intersectingElement?.target?.dataset?.spy);
        }, {
            ...options,
            root: options?.root || document.querySelector('body')
        });

        observedNodes.forEach(element => element ? observer.observe(element) : null);

        return () => observer.disconnect();
    }, [observedNodes]);

    return {
        scrollToElement: scrollToElement({ root: ref, elements }),
        currentActive,
        setRef,
    };
};

export function ScrollSpy({ elements, children } : IScrollSpyProps): ReactNode {
    const { currentActive, scrollToElement,  setRef } = useScrollSpy(elements);
    return children({ scrollToElement, setRef, currentActive });
}