import styles from '../styles.module.css';

export default function Label({
    children,
    dark = false,
}: {
    children: React.ReactNode,
    /**
     * Whether to render the font with a dark color.
     * Defaults to false.
     */
    dark?: boolean,
}) {
    return (
        <div className={`${styles.label}`}>
            {children}
        </div>
    );
}