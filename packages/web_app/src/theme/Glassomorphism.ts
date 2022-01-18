import React from 'react';

export default (color: string, filterAmount: number): React.CSSProperties => ({
    background: color,
    boxShadow: `0 8px 32px 0 rgba( 31, 38, 135, 0.37 )`,
    backdropFilter: `blur( ${filterAmount} )`,
    borderRadius: "10px",
    border: "1px solid rgba( 255, 255, 255, 0.18 )"
});