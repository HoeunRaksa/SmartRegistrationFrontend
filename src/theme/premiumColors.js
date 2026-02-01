export const premiumColors = {
    blue: {
        bg: 'bg-blue-50/50',
        text: 'text-blue-500',
        border: 'border-blue-100',
        icon: 'bg-blue-500',
        shadow: 'shadow-blue-500/5',
    },
    indigo: {
        bg: 'bg-indigo-50/50',
        text: 'text-indigo-500',
        border: 'border-indigo-100',
        icon: 'bg-indigo-500',
        shadow: 'shadow-indigo-500/5',
    },
    emerald: {
        bg: 'bg-emerald-50/50',
        text: 'text-emerald-500',
        border: 'border-emerald-100',
        icon: 'bg-emerald-500',
        shadow: 'shadow-emerald-500/5',
    },
    // Fallbacks for components that might still use other keys
    slate: {
        bg: 'bg-slate-50/50',
        text: 'text-slate-400',
        border: 'border-slate-100',
        icon: 'bg-slate-500',
        shadow: 'shadow-slate-500/5',
    },
    purple: {
        bg: 'bg-indigo-50/50',
        text: 'text-indigo-500',
        border: 'border-indigo-100',
        icon: 'bg-indigo-500',
        shadow: 'shadow-indigo-500/5',
    },
    orange: {
        bg: 'bg-blue-50/50',
        text: 'text-blue-500',
        border: 'border-blue-100',
        icon: 'bg-blue-500',
        shadow: 'shadow-blue-500/5',
    },
    rose: {
        bg: 'bg-indigo-50/50',
        text: 'text-indigo-500',
        border: 'border-indigo-100',
        icon: 'bg-indigo-500',
        shadow: 'shadow-indigo-500/5',
    }
};

export const getIconStyle = (color) => {
    const style = premiumColors[color] || premiumColors.blue;
    return `${style.icon} text-white shadow-sm border border-white/20`;
};
