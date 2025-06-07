import { BadgeView } from "./Badge.view"

interface BadgeProps {
    badgeType: 'success' | 'warning' | 'error';
    label: string;
}

const BADGE_COLOR = Object.freeze({
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545'
});

const BACKGROUND_COLOR = Object.freeze({
    success: '#d4edda',
    warning: '#fff3cd',
    error: '#f8d7da'
});

export const Badge = ({ badgeType, label }: BadgeProps) => {
    return <BadgeView backgroundColor={BACKGROUND_COLOR[badgeType]} badgeColor={BADGE_COLOR[badgeType]} label={label} />
}