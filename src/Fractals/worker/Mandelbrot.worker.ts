let WIDTH: number;
let HEIGHT: number;
let REAL_SET: { start: number; end: number; };
let JULIA_C: { x: number; y: number; };
let IMAGINARY_SET: { start: number; end: number; };
let END_START_RL: number;
let END_START_IM: number;

const MAX_ITERATION = 1000
const MAX_ITERATION_JULIA = 1000

const relativePoint = (x: number, y: number) => {
    x = REAL_SET.start + (x / WIDTH) * (END_START_RL)
    y = IMAGINARY_SET.start + (y / HEIGHT) * (END_START_IM)

    return { x, y }
}

const mandelbrot = (c: { x: number; y: number; }) => {
    let z = { x: 0, y: 0 }, n = 0, p, d;
    do {
        p = {
            x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
            y: 2 * z.x * z.y
        }
        z = {
            x: p.x + c.x,
            y: p.y + c.y
        }
        d = 0.5 * (Math.pow(z.x, 2) + Math.pow(z.y, 2))
        n++;
    } while (d <= 2 && n < MAX_ITERATION)

    return [n, d <= 2]
}

const julia = (za: { x: number; y: number; }) => {
    const f = (z: { x: number; y: number; }) => {
        return { x: z.x*z.x - z.y * z.y + JULIA_C.x, y: 2 * z.x * z.y + JULIA_C.y};
    }
    const R = (1 + Math.sqrt(1+4*abs(JULIA_C))) / 2;
    za = conversion(za.x, za.y, WIDTH, R);
    for (let i = 0; i < MAX_ITERATION_JULIA; i++){ // I know I can change it to while and remove this flag.
        za = f(za);
        if (abs(za) > R){  // if during every one of the iterations we have value bigger then R, do not draw this point.
            return false;
        }
    }

    return true
}

function abs(z: { x: number; y: number; }){  // absolute value of a complex number
    return Math.sqrt(z.x*z.x + z.y*z.y);
}

const calculate = (i: number, j: number) => mandelbrot(relativePoint(i, j))

function conversion(x: number, y: number, width: number, R: number){   // transformation from canvas coordinates to XY plane
    const m = R / width;
    const x1 = m * (2 * x - width);
    const y2 = m * (width - 2 * y);
    return {x: x1, y: y2};
}

const calculateJulia = (i: number, j: number) => julia({x:i, y:j})

export function init(w: number, h: number, realSet: any, imaginarySet: any, juliaC: any) {
    REAL_SET = { start: realSet.start, end: realSet.end }
    IMAGINARY_SET = { start: imaginarySet.start, end: imaginarySet.end }

    END_START_RL = (REAL_SET.end - REAL_SET.start)
    END_START_IM = (IMAGINARY_SET.end - IMAGINARY_SET.start)

    JULIA_C = juliaC

    WIDTH = w
    HEIGHT = h
}

export function draw(col: number) {
    const mandelbrotSets = []
    for (let row = 0; row < HEIGHT; row++)
        mandelbrotSets[row] = calculate(col, row)

    return {
        col,
        mandelbrotSets
    }
    // postMessage({ col, mandelbrotSets })
}

export function drawJulia(col: number) {
    const mandelbrotSets = []
    for (let row = 0; row < HEIGHT; row++)
        mandelbrotSets[row] = calculateJulia(col, row)

    return {
        col,
        mandelbrotSets
    }
    // postMessage({ col, mandelbrotSets })
}

