import React from 'react';

export function SetOpacity(color: string, opacity: number): string {
    if (opacity < 0) opacity = 0;
    if (opacity > 1) opacity = 1;

    let _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

export function Glassomorphism(color: string, filterAmount: number, transparencyAmount: number): React.CSSProperties {
    if (filterAmount < 0) filterAmount = 0;
    if (transparencyAmount < 0) transparencyAmount = 0;

    return {
        background: SetOpacity(color, transparencyAmount),
        boxShadow: `0 8px 32px 0 rgba( 31, 38, 135, 0.37 )`,
        backdropFilter: `blur( ${filterAmount} )`,
        borderRadius: "10px",
        border: "1px solid rgba( 255, 255, 255, 0.18 )"
    }
}

export const centerItemCss: React.CSSProperties = {
    display: "flex", justifyContent: "center", alignItems: "center"
}

export const buttonCss: React.CSSProperties = {
    display: "inline-block",
    padding: "0.7em 1.4em",
    margin: "0 0.3em 0.3em 0",
    borderRadius: "0.15em",
    boxSizing: "border-box",
    textDecoration: "none",
    fontFamily: "Roboto,sans-serif",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "#FFFFFF",
    backgroundColor: "#3369ff",
    boxShadow: "inset 0 -0.6em 0 -0.35em rgba(0,0,0,0.17)",
    textAlign: "center",
    position: "relative"
}