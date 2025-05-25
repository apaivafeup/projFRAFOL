

interface BadgeViewProps {
    backgroundColor: string;
    badgeColor: string;
    label: string;
}

export const BadgeView = ({ backgroundColor, badgeColor, label }: BadgeViewProps) => {
    return (
        <div className={`p-2 border-1 rounded-full text-center justify-center items-center`} style={{ backgroundColor, borderColor: badgeColor }}>
            <p className={`mb-0`} style={{ color: badgeColor }}>{label}</p>
        </div>
    )
}