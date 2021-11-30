import React, {FC, useCallback, useEffect, useMemo, useRef} from "react";
import WebpackWorker from "./worker";

type Pair = [number, number]
export type Color = [number, number, number]
type Set = { start: number, end: number }

const lagrange = ([X1, Y1]: Pair, [X2, Y2]: Pair, x: number) => {
    return (((Y1 * (x - X2)) / (X1 - X2)) + ((Y2 * (x - X1)) / (X2 - X1)));
}

const makeRGB = (r: number | [Pair, Pair], g: number | [Pair, Pair], b: number | [Pair, Pair], k: number): Color => {
    const calculate = (pair: [Pair, Pair]) => lagrange(pair[0], pair[1], k);
    if (typeof(r) !== 'number') r = calculate(r)
    if (typeof(g) !== 'number') g = calculate(g)
    if (typeof(b) !== 'number') b = calculate(b)

    return [r, g, b]
}

/**
 * get 250 colors from  interpolation (between 6 colors):
 * rgb(255, 0, 0) -> rgb(255, 255, 0) -> rgb(0, 255, 0)
 * rgb(0,255,255) -> rgb(0, 0, 255) -> rgb(255, 0, 255)
 */
const palette = (size = 250, colorPalette: Color[]) => {
    const range = size / colorPalette.length;
    const colors = []
    console.log('palette', colorPalette)
    for (let k = 0; k < size; k++) {
        const currentColor = colorPalette[Math.floor(k / range)];
        const nextColor = colorPalette[Math.floor(k / range) + 1 >= colorPalette.length ? 0 : Math.floor(k / range) + 1];


        function linear_interpolate(color1: Color, color2: Color, ratio: number): Color {
            let r = Math.floor((color2[0] - color1[0]) * ratio + color1[0]);
            let g = Math.floor((color2[1] - color1[1]) * ratio + color1[1]);
            let b = Math.floor((color2[2] - color1[2]) * ratio + color1[2]);
            return [r, g, b]
        }

        const c = linear_interpolate(currentColor, nextColor, k / range)
        console.log('current color', Math.floor(k / range), currentColor)
        // if (k <= range)//red to yellow
        //     c = makeRGB(255, [[0, 0], [range, 255]], 0, k)
        // else if (k <= range * 2)//yellow to green
        //     c = makeRGB([[range + 1, 255], [range * 2, 0]], 255, 0, k)
        // else if (k <= range * 3)//green to cyan
        //     c = makeRGB(0, 255, [[range * 2 + 1, 0], [range * 3, 255]], k)
        // else if (k <= range * 4)//cyan to blue
        //     c = makeRGB(0, [[range * 3 + 1, 255], [range * 4, 0]], 255, k)
        // else if (k <= range * 5)//blue to purple
        //     c = makeRGB([[range * 4 + 1, 0], [range * 5, 255]], 0, 255, k)
        // else//purple to red
        //     c = makeRGB(255, 0, [[range * 5 + 1, 255], [size - 1, 0]], k)

        colors.push(c)
    }
    return colors
}

const paletteBW = () => new Array(250).fill(0).map((_, i) => {
    const c = lagrange([0, 0], [250, 255], i)
    return [c, c, c]
})

const getRelativePoint = (pixel: any, length: any, set: any) => set.start + (pixel / length) * (set.end - set.start)

type OwnProps = {
    colorPalette: Color[]
}

const Mandelbrot: FC<OwnProps> = ({
    colorPalette
}) => {
    const width = useRef<number>(0)
    const height = useRef<number>(0)
    // const WIDTH = 800 / 5
    // const HEIGHT = 600 / 5

    let REAL_SET: Set = { start: -2, end: 1 }
    let IMAGINARY_SET: Set = { start: -1, end: 1 }
    const ZOOM_FACTOR = 0.1
    const workersCount = navigator.hardwareConcurrency || 4
    let workers: WebpackWorker[] | undefined = undefined;
    let colorPaletteDrawing: Color[] = []

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasJuliaRef = useRef<HTMLCanvasElement>(null);

    const start = () => {
        if(!canvasJuliaRef.current) return;
        const ctxJulia = canvasJuliaRef.current.getContext('2d');
        if(!ctxJulia) return;
        ctxJulia.fillStyle = "white";
        ctxJulia.fillRect(0, 0, width.current, height.current);
        // for (let col = 0; col < width.current; col++) TASKS[col] = col
        workers!.forEach((worker, i) => {
            const start = Math.floor(width.current / workers!.length * i);
            const end = Math.floor(width.current / workers!.length * (i + 1));
            for (let col = start; col < end; col++) {
                worker.draw(col).then(draw)
                worker.drawJulia(col).then(drawJulia)
            }
        })
    }

    const drawJulia = (res: any) => {
        if(!canvasJuliaRef.current) return;
        const ctx = canvasJuliaRef.current.getContext('2d');
        if(!ctx) return;

        const { col, mandelbrotSets } = res
        for (let i = 0; i < height.current; i++) {
            const draw = mandelbrotSets[i]
            if(draw) {
                ctx.fillStyle = `rgb(0, 0, 0)`
                ctx.fillRect(col, i, 1, 1)
            }
        }
    }
    const draw = (res: any) => {
        if(!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if(!ctx) return;

        const { col, mandelbrotSets } = res
        for (let i = 0; i < height.current; i++) {
            const [m, isMandelbrotSet] = mandelbrotSets[i]
            const c = isMandelbrotSet ? [0, 0, 0] : colorPaletteDrawing[m % (colorPaletteDrawing.length - 1)]
            ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`
            ctx.fillRect(col, i, 1, 1)
        }
    }

    const init = () => {
        if(width.current === 0 || height.current === 0) {
            width.current = window.innerWidth;
            height.current = Math.floor(window.innerWidth * 3/4);
        }
        if(!canvasRef.current || !canvasJuliaRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        const ctxJulia = canvasJuliaRef.current.getContext('2d');
        if(!ctx || !ctxJulia) return;

        ctxJulia.canvas.width = width.current;
        ctx.canvas.width = width.current;
        ctx.canvas.height = height.current;
        ctxJulia.canvas.height = height.current;

        ctxJulia.fillStyle = "white";
        ctxJulia.fillRect(0, 0, width.current, height.current);

        if(workers) {
            workers.forEach(l => l.terminate());
        }
        workers = new Array(workersCount).fill(undefined).map(() => new WebpackWorker());
        workers.forEach((worker) => {
            console.log(worker)
            worker.init(width.current, height.current, REAL_SET, IMAGINARY_SET, {
                x: (REAL_SET.end - REAL_SET.start) / 2,
                y: (IMAGINARY_SET.end - IMAGINARY_SET.start) / 2
            });
        })
        start()
        colorPaletteDrawing = palette(100, colorPalette)
        // worker.onmessage = draw
    }

    const handleZoom = useCallback((e: React.MouseEvent) => {
        console.log(e)
        const canvas = canvasRef.current;
        if(!canvas) return;

        const zfw = (width.current * ZOOM_FACTOR)
        const zfh = (height.current * ZOOM_FACTOR)

        const bbox = canvas.getBoundingClientRect();

        const juliaX = getRelativePoint(bbox.x/2 - canvas.offsetLeft - zfw, width.current, REAL_SET)
        const juliaY = getRelativePoint(bbox.y/2 - canvas.offsetTop - zfh, height.current, IMAGINARY_SET)

        REAL_SET = {
            start: getRelativePoint(e.pageX - canvas.offsetLeft - zfw, width.current, REAL_SET),
            end: getRelativePoint(e.pageX - canvas.offsetLeft + zfw, width.current, REAL_SET)
        }
        IMAGINARY_SET = {
            start: getRelativePoint(e.pageY - canvas.offsetTop - zfh, height.current, IMAGINARY_SET),
            end: getRelativePoint(e.pageY - canvas.offsetTop + zfh, height.current, IMAGINARY_SET)
        }

        workers?.forEach(worker => {
            worker.init(width.current, height.current, REAL_SET, IMAGINARY_SET,{
                x: juliaX,
                y: juliaY
            });
        })

        start()
    }, [init]);

    useEffect(init, [IMAGINARY_SET, REAL_SET]);

    return <div className="mandelbrot">
        <canvas ref={canvasRef} onClick={handleZoom}/>
        <canvas ref={canvasJuliaRef} />
    </div>
}

export default Mandelbrot;
