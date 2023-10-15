import { JustifyContent, AlignItems } from "../container";

export default function Row({
    children,
    gap = 1,
    justifyContent = 'normal',
    alignItems = 'normal',
}: {
    children: React.ReactNode,
    /**
     * Gap as `0.25rem` CSS units. Defaults to 1.
     */
    gap?: number,
    /**
     * The CSS property [`justify-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content).
     */
    justifyContent?: JustifyContent,
    /**
     * The CSS property [`align-items`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items).
     */
    alignItems?: AlignItems,
}) {
    return (
        <div className="flex flex-row" style={{gap: `${gap * 0.25}rem`, justifyContent, alignItems}}>
            {children}
        </div>
    );
}