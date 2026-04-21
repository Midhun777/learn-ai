import React from 'react';

const Avatar = ({ user, size = '10', className = '' }) => {
    // Generate avatar URL based on username if not already provided
    const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'anonymous'}`;

    const sizeClasses = {
        '5': 'w-5 h-5 rounded-md',
        '8': 'w-8 h-8 rounded-lg',
        '10': 'w-10 h-10 rounded-xl',
        '12': 'w-12 h-12 rounded-2xl',
        '14': 'w-14 h-14 rounded-[18px]',
        '24': 'w-24 h-24 rounded-[32px]'
    };

    const selectedSize = sizeClasses[size] || sizeClasses['10'];

    return (
        <div className={`${selectedSize} bg-slate-100 flex items-center justify-center overflow-hidden border border-ui-border shadow-sm shrink-0 transition-shadow transition-transform duration-300 ${className}`}>
            <img 
                src={avatarUrl} 
                alt={user?.name || 'User'} 
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=94a3b8&color=fff`;
                }}
            />
        </div>
    );
};

export default Avatar;
