import {Page} from "./Page";
import {useHistory} from "react-router-dom";

export default function Main() {
    const history = useHistory();

    const handleClick = (location: string) => {
        history.push("/" + location)
    };

    const Block = ({
                       grad,
                       title,
                       location,
                       children,
                   }: {
        grad: string;
        title: string;
        children: string;
        location: string;
    }): JSX.Element => {
        return <div className={"block grad" + grad}>
            <div className="title">{title}</div>
            <div className="info">
                {children}
            </div>
            <button className="primary" onClick={() => handleClick(location)}>Get Started</button>
        </div>
    }

    return <Page title="Select educational program">
        <div className="scrollable">
            <Block title="Mandelbrot & Julia set" grad="1" location="fractals">
                A fractal is a non-regular geometric shape that has the same degree of non-regularity on all scales. Fractals can be thought of as never-ending patterns.
            </Block>
            <Block title="HSV & CMYK color models" grad="3" location="colors">
                HSV is an alternative representations of the RGB color model; CMYK is a subtractive color model, used in color printing.
            </Block>
            <Block title="Affine transformation" grad="2" location="animations">
                Affine transformation is any transformation that preserves collinearity and ratios of distances.
            </Block>
        </div>
    </Page>
}
