import styles from '../styles.module.css';

export default function Card({children}: {
    children: React.ReactNode
}) {
    return (
        <div className={`flex flex-col gap-4 p-16 ${styles.card}`}>
            {children}
        </div>
    );
}

export function CardHeader({children}: {
    children: React.ReactNode
}) {
    return (
        <div>
            {children}
        </div>
    );
}

export function CardContent({children}: {
    children: React.ReactNode
}) {
    return (
        <div>
            {children}
        </div>
    );
}

export function CardFooter({children}: {
    children: React.ReactNode
}) {
    return (
        <div>
            {children}
        </div>
    );
}