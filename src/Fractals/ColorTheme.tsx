import React, {FC, useCallback, useEffect} from "react";
import random from "../Assets/random.png";

type OwnProps = {
    name: string;
    colors?: string[];
    isRandom?: boolean;
    isApplied?: boolean;
    onClick: () => void;
}

const ColorTheme: FC<OwnProps> = ({
    name,
    colors,
    isRandom,
    isApplied,
    onClick,
}) => {
    const handleClick = useCallback(() => {
        onClick();
    }, [onClick]);

    return <div className="color-theme" onClick={handleClick}>
        <div className="colors">
            {isRandom && (
                <img src={random} alt=""/>
            )}
            {colors?.map((color, i) => (
                <div className="color" key={i}>
                    <div style={{"--color": color} as React.CSSProperties}/>
                    <div style={{"--color": color} as React.CSSProperties}/>
                </div>
            ))}
        </div>
        <span>{name}</span>
        {isApplied && <div className="applied">Applied</div>}
    </div>
}

export default ColorTheme;
