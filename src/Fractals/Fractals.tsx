import {Page} from "../Page";
import fractals from "../Assets/fractal.png";
import dashboard from "../Assets/dashboard.svg";
import scale from "../Assets/scale.svg";
import color from "../Assets/color.svg";
import reset from "../Assets/reset.svg";
import {useCallback, useState} from "react";
import Popdown from "../Popdown";
import Slider from "../Slider";
import ColorTheme from "./ColorTheme";
import NumberedInput from "../NumberedInput";
import Mandelbrot, {Color} from "./Mandelbrot";

function hexToRgb(hex: string): Color {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [
        parseInt(result![1], 16),
        parseInt(result![2], 16),
        parseInt(result![3], 16)
    ];
}

const colorThemes = [
    {
        name: "Deep Sea",
        colors: ["#FFC300", "#00086D", "#FFFFFF"]
    },
    {
        name: "Children’s dreams",
        colors: ["#FF70F9", "#FBFDB7"]
    }
]
export default function Fractals() {
    const [isConstPopdownOpen, setIsConstPopdownOpen] = useState(false);
    const [isScalePopdownOpen, setIsScalePopdownOpen] = useState(false);
    const [isColorPopdownOpen, setIsColorPopdownOpen] = useState(false);
    const [selectedColorTheme, setSelectedColorTheme] = useState(0);
    const [randomColorTheme, setRandomColorTheme] = useState<Color[]>([]);

    const handleClickConst = useCallback(() => {
        setIsConstPopdownOpen(true)
    }, []);

    const handleClickColor = useCallback(() => {
        setIsColorPopdownOpen(true)
    }, []);

    const handleClickScale = useCallback(() => {
        setIsScalePopdownOpen(true)
    }, []);

    const handleClickReset = useCallback(() => {
        setSelectedColorTheme(0);
    }, []);

    const handleSelectColorTheme = useCallback((i: number) => {
        setSelectedColorTheme(i)
    }, [])

    return <Page
        hasBackButton
        title="Mandelbrot & Julia set"
        subtitle="For f(z)=z*z+c"
        learnPage="/fractals/learn"
        navItems={[
            {
                name: 'Const C',
                icon: dashboard,
                onClick: handleClickConst
            },
            {
                name: 'Color',
                icon: color,
                onClick: handleClickColor
            },
            {
                name: 'Scale',
                icon: scale,
                onClick: handleClickScale
            },
            {
                name: 'Reset',
                icon: reset,
                onClick: handleClickReset
            },
        ]}
    >
        <div className="fractal">
            <Mandelbrot
                colorPalette={selectedColorTheme === -1 ? randomColorTheme : colorThemes[selectedColorTheme].colors.map(hexToRgb)}
            />
        </div>

        <Popdown
            title="Iterations"
            isOpen={isConstPopdownOpen}
            setOpen={setIsConstPopdownOpen}
        >
            <NumberedInput label="Mandelbrot set" defaultValue={100}/>
            <NumberedInput label="Julia set" defaultValue={1000}/>
        </Popdown>

        <Popdown
            title="Scale"
            isOpen={isScalePopdownOpen}
            setOpen={setIsScalePopdownOpen}
        >
            <Slider label="Zoom" />
        </Popdown>


        <Popdown
            title="Color"
            isOpen={isColorPopdownOpen}
            setOpen={setIsColorPopdownOpen}
        >
            {colorThemes.map((colorTheme, i) => (
                <ColorTheme
                    key={i}
                    name={colorTheme.name}
                    colors={colorTheme.colors}
                    onClick={() => handleSelectColorTheme(i)}
                    isApplied={selectedColorTheme === i}
                />
            ))}
            <ColorTheme
                name="Random"
                isRandom
                onClick={() => {
                    setRandomColorTheme(
                        new Array(Math.floor(Math.random() * 10) + 5)
                            .fill(undefined)
                            .map(() => [Math.random() * 255, Math.random() * 255, Math.random() * 255])
                    )
                    handleSelectColorTheme(-1)
                }}
                isApplied={selectedColorTheme === -1}
            />
        </Popdown>
    </Page>
}
