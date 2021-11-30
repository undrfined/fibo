import React, {FC, useCallback, useEffect, useRef} from "react";

type OwnProps = {
    label?: string;
};

const Slider: FC<OwnProps & React.HTMLAttributes<HTMLInputElement>> = (params) => {
    const { label, ...otherParams } = params;
    const sliderRef = useRef<HTMLInputElement>(null)

    const updateValues = useCallback(() => {
        const target = sliderRef.current;
        if(!target) return;

        const val = Number(target.value);
        const min = Number(target.min || 0);
        const max = Number(target.max || 100);
        const value = (val - min) / (max - min) * 100;

        target.style.background = 'linear-gradient(to right, #FFF 0%, #fff ' + value + '%, rgba(255, 255, 255, 0.2) ' + value + '%, rgba(255, 255, 255, 0.2) 100%)'
    }, [])

    useEffect(updateValues, [updateValues])

    return <div className="slider-input">
        <span className="label">{label}</span>
        <input {...otherParams} ref={sliderRef} onInput={updateValues} type="range"/>
    </div>
}

export default Slider;
