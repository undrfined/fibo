import {Page} from "../Page";
import React, {useCallback, useEffect, useRef, useState} from "react";
import Popdown from "../Popdown";
import Transformation from "./Transformation";
import a from '../Assets/a.svg';
import b from '../Assets/b.svg';
import c from '../Assets/c.svg';
import Slider from "../Slider";

function multiply(a: number[][], b: number[][]) {
    const aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows)
    for (let r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols);
        for (let c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;
            for (let i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}

function d2r(degrees: number)
{
    const pi = Math.PI;
    return degrees * (pi/180);
}

export default function Animations() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [matrix, setMatrix] = useState([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ])
    const [activePopdown, setActivePopdown] = useState<string>()
    const [rotation, setRotation] = useState(0)
    const [deltaX, setDeltaX] = useState(0)
    const [deltaY, setDeltaY] = useState(0)
    const [scaleX, setScaleX] = useState(1)
    const [scaleY, setScaleY] = useState(1)
    const [zoom, setZoom] = useState(1)
    const [transformations, setTransformations] = useState([0, 1, 2])

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        const { width, height } = canvas.getBoundingClientRect();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;

        const hw = width / 2 * zoom;
        const hh = height / 2 * zoom;

        ctx.beginPath();
        ctx.moveTo(hw, 0);
        ctx.lineTo(hw, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, hh);
        ctx.lineTo(width, hh);
        ctx.stroke();

        const step = 50 * zoom;

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.setLineDash([2, 2]);
        for(let y = hh % step; y < height; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        for(let x = hw % step; x < width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        const getCoordinates = (x: number, y: number): [number, number] => [(x + width / 2) * zoom, (height / 2 - y) * zoom];

        ctx.fillStyle = '#2A0AF1';
        ctx.beginPath();

        let m = matrix;
        for(let i = 0; i < 3; i++) {
            const c = transformations[i];
            if(c === 0) {
                m = multiply(m, [
                    [Math.cos(d2r(rotation)), Math.sin(d2r(rotation)), 0],
                    [-Math.sin(d2r(rotation)), Math.cos(d2r(rotation)), 0],
                    [0, 0, 1]
                ])
            } else if(c === 1) {
                m = multiply(m, [
                    [1, 0, deltaX],
                    [0, 1, deltaY],
                    [0, 0, 1]
                ])
            } else {
                m = multiply(m, [
                    [scaleY, 0, 0],
                    [0, scaleX, 0],
                    [0, 0, 1]
                ])
            }
        }

        let [[x], [y]] = multiply(m, [
            [0],
            [0],
            [1],
        ])
        ctx.moveTo(...getCoordinates(x, y));

        [[x], [y]] = multiply(m, [
            [0],
            [50],
            [1],
        ])
        ctx.lineTo(...getCoordinates(x, y));


        [[x], [y]] = multiply(m, [
            [50],
            [50],
            [1],
        ])
        ctx.lineTo(...getCoordinates(x, y));


        [[x], [y]] = multiply(m, [
            [50],
            [0],
            [1],
        ])
        ctx.lineTo(...getCoordinates(x, y));
        ctx.fill()
    }, [deltaX, deltaY, matrix, rotation, scaleX, scaleY, transformations, zoom]);

    useEffect(() => {
        if(!canvasRef.current) return;
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight - 328
        draw();
    }, [draw])


    const handleMove = (index: number, i: number) => {
        const a = Array.from(transformations);
        const ins = a.indexOf(index)
        const k = a[ins]
        a[ins] = a[ins + i];
        a[ins + i] = k

        setTransformations(a)
    }

    return <Page hasBackButton title="Affine transformation">
        <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }}/>
        <Popdown
            title="Scale"
            isOpen={true}
        >
            {transformations.map((i, z) => {
                if(i === 0) {
                    return <Transformation onClick={() => setActivePopdown('rotation')} name={rotation + "°"} icon={a} info="Rotation" index={z} move={(_, l) => handleMove(i, l)}/>
                } else if(i === 1) {
                    return <Transformation onClick={() => setActivePopdown('delta')} name={deltaX + ", " + deltaY} icon={b} info="Delta X, Delta Y" index={z} move={(_, l) => handleMove(i, l)} />
                } else if(i === 2) {
                    return <Transformation onClick={() => setActivePopdown('scale')} name={scaleX + ", " + scaleY} icon={c} info="Scale X, Scale Y" index={z} move={(_, l) => handleMove(i, l)}/>
                }
            })}
            {/* @ts-ignore */}
            <Slider min="0" max="10" step="0.001" value={zoom} label="Zoom" onChange={({currentTarget: { value }}) => setZoom(Number(value))} postfix=" "/>
            {/*{matrix.map((m, mi) =>*/}
            {/*    <div>*/}
            {/*        {m.map((k, ki) =>*/}
            {/*            <input className="matrix-input" defaultValue={k} onChange={({ currentTarget: { value }}) => {*/}
            {/*                const m = Array.from(matrix.map(l => Array.from(l))) // deep copy*/}
            {/*                m[mi][ki] = Number(value);*/}
            {/*                setMatrix(m as number[][]);*/}
            {/*            }} type="text" key={mi + "_" + ki}/>)*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*)}*/}
        </Popdown>
        <Popdown
            setOpen={() => setActivePopdown(undefined)}
            title="Delta"
            isOpen={activePopdown === 'delta'}
        >
            {/* @ts-ignore */}
            <Slider min="-1000" max="1000" step="1" value={deltaX} label="Delta X" onChange={({currentTarget: { value }}) => setDeltaX(Number(value))} postfix=" "/>
            {/* @ts-ignore */}
            <Slider min="-1000" max="1000" step="1" value={deltaY} label="Delta Y" onChange={({currentTarget: { value }}) => setDeltaY(Number(value))} postfix=" "/>
        </Popdown>
        <Popdown
            setOpen={() => setActivePopdown(undefined)}
            title="Scale"
            isOpen={activePopdown === 'scale'}
        >
            {/* @ts-ignore */}
            <Slider min="-10" max="10" step="0.01" value={scaleX} label="Scale X" onChange={({currentTarget: { value }}) => setScaleX(Number(value))} postfix=" "/>
            {/* @ts-ignore */}
            <Slider min="-10" max="10" step="0.01" value={scaleY} label="Scale Y" onChange={({currentTarget: { value }}) => setScaleY(Number(value))} postfix=" "/>
        </Popdown>
        <Popdown
            setOpen={() => setActivePopdown(undefined)}
            title="Rotation"
            isOpen={activePopdown === 'rotation'}
        >
            {/* @ts-ignore */}
            <Slider min="-360" max="360" step="1" value={rotation} label="Rotation" onChange={({currentTarget: { value }}) => setRotation(Number(value))} postfix="°"/>
        </Popdown>

    </Page>
}
