import React, {FC, useCallback, useRef} from "react";

type OwnProps = {
    label?: string;
};

const NumberedInput: FC<OwnProps & React.HTMLAttributes<HTMLInputElement>> = (params) => {
    const { label, ...otherParams } = params;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClickMinus = useCallback(() => {
        if(!inputRef.current) return;
        inputRef.current.value = (Number(inputRef.current.value) - 1).toString();
    }, []);

    const handleClickPlus = useCallback(() => {
        if(!inputRef.current) return;
        inputRef.current.value = (Number(inputRef.current.value) + 1).toString();
    }, []);

    return <div className="numbered-input">
        <div className="label">{label}</div>
        <button className="primary" onClick={handleClickMinus}>-</button>
        <input {...otherParams} type="number" ref={inputRef}/>
        <button className="primary" onClick={handleClickPlus}>+</button>
    </div>
}

export default NumberedInput;
