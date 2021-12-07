import React, {FC, useCallback, useEffect, useRef, useState} from "react";
import {Page} from "../Page";
import Popdown from "../Popdown";
import Slider from "../Slider";

type OwnProps = {
    selectedImage: string
}

type ColorSpace = 'rgb' | 'cmyk' | 'hsv';

const ColorModelsPage: FC<OwnProps> = ({
    selectedImage
}) => {
    const [imageData, setImageData] = useState<ImageData>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [colorSpace, setColorSpace] = useState<ColorSpace>('rgb');
    const [colorPickerX, setColorPickerX] = useState(0)
    const [uriPositionX, setUriPositionX] = useState(0)
    const [uriPositionY, setUriPositionY] = useState(0)
    const [colorPickerY, setColorPickerY] = useState(0)

    const [currentPixelPositionX, setCurrentPixelPositionX] = useState(0)
    const [currentPixelPositionY, setCurrentPixelPositionY] = useState(0)
    const [backgroundSize, setBackgroundSize] = useState('')
    const [uri, setUri] = useState('');

    const [areaStart, setAreaStart] = useState<[number, number, number, number]>();
    const [areaEnd, setAreaEnd] = useState<[number, number, number, number]>();

    const [colorPickerActive, setColorPickerActive] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const image = new Image();
        image.src = selectedImage;
        image.decode().then(() => {
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d')?.drawImage(image, 0, 0)
            setBackgroundSize((image.width * 40) + "px")
            setImageData(canvas.getContext('2d')?.getImageData(0, 0, image.width, image.height))
            dodraw();

        })
    }, [selectedImage])


    const getIndexAt = useCallback((x: number, y: number) => {
        if(!imageData) return 0;
        return (x + y * imageData.width) * 4
    }, [imageData]);

    const getPixelAt = useCallback((x: number, y: number, id?: any): [number, number, number] => {
        if(!imageData) return [0, 0, 0];
        const index = getIndexAt(x, y);
        return [(id || imageData).data[index], (id || imageData).data[index + 1], (id || imageData).data[index + 2]]
    }, [getIndexAt, imageData])


    const draw = useCallback((imageData: ImageData) => {
        if(!imageData) return;
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        if(colorSpace === 'rgb') {
            ctx.putImageData(imageData, 0, 0);
        } else {
            for (let x = 0; x < imageData.width; x++) {
                for (let y = 0; y < imageData.height; y++) {
                    const pixel = getPixelAt(x, y, imageData); // rgb
                    const color = (colorSpace === 'hsv' ?
                                hsvToRgb(rgbToHsv(pixel))
                                : cmykToRgb(rgbToCmyk(pixel))
                        );
                    ctx.fillStyle = `rgb(${color.join(',')})`;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }

        canvas.toBlob((a) => {
            setUri(URL.createObjectURL(a))
        }, 'image/jpeg')
    }, [colorSpace, getPixelAt])

    const rgbToHsv = (rgb: [number, number, number]): [number, number, number] => {
        const [r, g, b] = rgb.map(l => l / 255);
        let h: number = 0;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const maxmin = max - min;
        if(max === min) h = 0;
        else if(max === r && g >= b) h = 60 * (g - b) / maxmin;
        else if(max === r && g < b) h = 60 * (g - b) / maxmin + 360;
        else if(max === g) h = 60 * (b - r) / maxmin + 120;
        else if(max === b) h = 60 * (r - g) / maxmin + 240;
        const s = max === 0 ? 0 : (1-(min / max));
        return [h, s, max];
    }

    const hsvToRgb = ([h, s, v]: [number, number, number]): [number, number, number] => {
        const hi = Math.floor((h / 60)) % 6;
        const f = (h / 60) - hi;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        let rgb: [number, number, number] = [0, 0, 0];
        const hiF = hi;
        if(hiF === 0) rgb = [v, t, p];
        else if(hiF === 1) rgb = [q, v, p];
        else if(hiF === 2) rgb = [p, v, t];
        else if(hiF === 3) rgb = [p, q, v];
        else if(hiF === 4) rgb = [t, p, v];
        else if(hiF === 5) rgb = [v, p, q];

        return rgb.map(l => Math.round(l * 255)) as [number, number, number];
    }


    const rgbToCmyk = (rgb: [number, number, number]): [number, number, number, number] => {
        const [r, g, b] = rgb.map(l => l / 255);
        const [_c, _m, _y] = [1 - r, 1 - g, 1 - b];
        const k = Math.min(_c, _m, _y);
        if(k === 1) return [0, 0, 0, 1];
        const kdiff = (1 - k);
        return [(_c - k) / kdiff, (_m - k) / kdiff, (_y - k) / kdiff, k];
    }

    const cmykToRgb = (cmyk: [number, number, number, number]) => {
        let [c, m, y, k] = cmyk;
        const kdiff = (1 - k);

        c = c * kdiff + k;
        m = m * kdiff + k;
        y = y * kdiff + k;

        let r = 1 - c;
        let g = 1 - m;
        let b = 1 - y;

        return [r, g, b].map(l => Math.round(l * 255));
    }

    const setPixelAt = useCallback((id: ImageData, x: number, y: number, color: [number, number, number]) => {
        if(!imageData) return;
        const index = getIndexAt(x, y);
        id.data[index] = color[0];
        id.data[index + 1] = color[1];
        id.data[index + 2] = color[2];
    }, [getIndexAt, imageData])

    const [saturation, setSaturation] = useState(50);
    const [brightness, setBrightness] = useState(50);


    const dodraw = () => {
        if(!imageData) return;
        const startX = areaStart && areaEnd ? Math.min(areaStart![2], areaEnd![2]) : 0;
        const endX = areaStart && areaEnd ? Math.max(areaStart![2], areaEnd![2]) : imageData.width;
        const startY = areaStart && areaEnd ? Math.min(areaStart![3], areaEnd![3]) : 0;
        const endY = areaStart && areaEnd ? Math.max(areaStart![3], areaEnd![3]) : imageData.height;
        console.log(areaStart, areaEnd);
        const id = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                const pixel = getPixelAt(x, y);
                const hsv = rgbToHsv(pixel);
                const a = 40;
                if (hsv[0] > 240 - a && hsv[0] < 240 + a) {
                    // hsv[1] = va  lue;
                    hsv[1] = hsv[1] * (saturation / 100 + 0.5);
                    hsv[2] = hsv[2] * (brightness / 100 + 0.5);
                    setPixelAt(id, x, y, hsvToRgb(hsv))
                }
            }
        }
        draw(id);
    }

    const handleSaturationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if(!imageData) return;
        const value = Number(e.currentTarget.value);
        setSaturation(value);
        dodraw()
    }, [dodraw, imageData]);

    const handleBrightnessChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if(!imageData) return;
        const value = Number(e.currentTarget.value);
        setBrightness(value);
        dodraw()
    }, [dodraw, imageData]);


    const handleMouseMove = useCallback((e: React.TouchEvent) => {
        const canvas = canvasRef.current;
        if(!canvas || !imageData) return;
        const {pageX, pageY} = e.touches[0];
        console.log(canvas.offsetTop)
        const y = Math.floor((pageY - canvas.getBoundingClientRect().top) / canvas.getBoundingClientRect().width * imageData.width);
        const x = Math.floor((pageX) / canvas.getBoundingClientRect().height * imageData.height);
        if(colorPickerActive) {
            setColorPickerX(Math.floor(pageX - 100));
            setColorPickerY(Math.floor(pageY - 100));
            setUriPositionY((y - 2) * -40);
            setUriPositionX((x - 2) * -40);
            setCurrentPixelPositionX(x)
            setCurrentPixelPositionY(y)
        } else {
            setAreaEnd([pageX, pageY, x, y]);

            dodraw();
        }
    }, [areaEnd, areaStart, brightness, colorPickerActive, draw, getPixelAt, imageData, saturation, setPixelAt])

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const canvas = canvasRef.current;
        if(!canvas || !imageData) return;

        if(colorPickerActive) {
            handleMouseMove(e);
        } else {
            const {pageX, pageY} = e.touches[0];
            const y = Math.floor((pageY - canvas.getBoundingClientRect().top) / canvas.getBoundingClientRect().width * imageData.width);
            const x = Math.floor((pageX) / canvas.getBoundingClientRect().height * imageData.height);
            setAreaStart([pageX, pageY, x, y]);
            // const y = Math.floor((pageY - canvas.offsetTop)/canvas.getBoundingClientRect().width*imageData.width);
            // const x = Math.floor((pageX)/canvas.getBoundingClientRect().height*imageData.height);
            // setUriPositionY((y - 2) * -40);
            // setUriPositionX((x - 2) * -40);
            // setCurrentPixelPositionX(x)
            // setCurrentPixelPositionY(y)
        }
    }, [colorPickerActive, handleMouseMove, imageData])


    const currentPixel = getPixelAt(currentPixelPositionX, currentPixelPositionY);
    const currentPixelHsv = rgbToHsv(currentPixel);
    const currentPixelCmyk = rgbToCmyk(currentPixel).map(l => Math.round(l * 100)).map(l => `${l}%`);
    return <Page hasBackButton title="HSV & CMYK color models"
                 learnPage="/colors/learn"
    >
        <div className="canvas-wrapper">
            <div className="area-mask" style={{
                borderLeftWidth: Math.min(areaEnd?.[0] || 0, areaStart?.[0] || 0) + 'px',
                borderTopWidth: Math.min(areaEnd?.[1] || 0, areaStart?.[1] || 0) - 119 + 'px',
                borderBottomWidth: ((canvasRef.current?.clientHeight || 0) - Math.max(areaEnd?.[1] || 0, areaStart?.[1] || 0) + 119) + 'px',

                borderRightWidth: ((canvasRef.current?.clientWidth || 0) - Math.max(areaEnd?.[0] || 0, areaStart?.[0] || 0)) + 'px',
            }}/>
            <canvas ref={canvasRef} className="color-models-canvas" onTouchMove={handleMouseMove} onTouchStart={handleTouchStart}/>
        </div>
        {/*<img className="image" src={selectedImage} alt=""/>*/}
        <div className="color-picker" style={
            {
                transform: `translate(${colorPickerX}px, ${colorPickerY}px)`,
                backgroundImage: `url(${uri})`,
                backgroundPositionX: (uriPositionX) + "px",
                backgroundPositionY: (uriPositionY) + "px",
                backgroundSize,
                display: !colorPickerActive ? 'none' : 'block'
            }}>
        </div>

        <div className="color-picker-color" style={{
            transform: `translate(${colorPickerX}px, ${colorPickerY + 200 + 10}px)`,
            display: !colorPickerActive ? 'none' : 'block'
        }}>
            [{currentPixelPositionX}/{currentPixelPositionY}]<br/>
            rgb({currentPixel.join(", ")})<br/>
            hsv({Math.round(currentPixelHsv[0])}, {Math.round(currentPixelHsv[1] * 100)}%, {Math.round(currentPixelHsv[2] * 100)}%)<br/>
            cmyk({currentPixelCmyk.join(", ")})<br/>
        </div>

        <div className="area" style={{
            transform: `translate(${Math.min(areaEnd?.[0] || 0, areaStart?.[0] || 0)}px, ${Math.min(areaEnd?.[1] || 0, areaStart?.[1] || 0)}px)`,
            width: Math.abs((areaEnd?.[0] || 0) - (areaStart?.[0] || 0)) + 'px',
            height: Math.abs((areaEnd?.[1] || 0) - (areaStart?.[1] || 0)) + 'px',
            display: colorPickerActive ? 'none' : 'block'
        }}>
        </div>

        <Popdown
            title="Scale"
            isOpen={true}
        >
            <div className="btns">
                <button onClick={() => {
                    setAreaStart(undefined)
                    setAreaEnd(undefined)
                    dodraw()
                }}>reset</button>
                <button onClick={() => setColorPickerActive(!colorPickerActive)}>color picker</button>
                <button onClick={() => {
                    setColorSpace('rgb')
                    dodraw()
                }}>rgb</button>
                <button onClick={() => {
                    setColorSpace('hsv')
                    dodraw()
                }}>hsv</button>
                <button onClick={() => {
                    setColorSpace('cmyk')
                    dodraw()
                }}>cmyk</button>
            </div>
            <Slider label="Saturation (Blue)" onChange={handleSaturationChange}/>
            <Slider label="Brightness (Blue)" onChange={handleBrightnessChange}/>
        </Popdown>
    </Page>
}

export default ColorModelsPage;
