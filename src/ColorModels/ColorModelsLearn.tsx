import {FC, ReactNode} from "react";
import {Page} from "../Page";
import link from "../Assets/link.svg";
import p1 from "../Assets/learn_p2/1.gif";
import p2 from "../Assets/learn_p2/2.png";
import p3 from "../Assets/learn_p2/3.png";
import p4 from "../Assets/learn_p2/4.png";
import {useHistory} from "react-router-dom";

const TextBlock: FC<{
    src: string,
    children: ReactNode
}> = ({
          src,
          children
      }) => {
    return <div>
        <img src={src} alt=""/>
        <p>{children}</p>
    </div>
}

const ColorModelsLearn: FC = () => {
    const history = useHistory();

    return <Page isScrollable hasBackButton title="More about HSV & CMYK color models">
        <div className="article">
            <TextBlock src={p1}>
                Do you see this weird shrimp?
                It is Mantis Shrimp, which dwells in the area of Barrier Reef. Its eyes have wider color diapason then humans, it is a living spectrograph!
                However physiological capabilities also allow human to appreciate up to 1 million colors and tones — not so little, right?
            </TextBlock>
            <TextBlock src={p2}>
                Currently this humongous variety of colors appreciable by humans is described by CIELAB color space. It’s nonlinear model of color space coordinated with L — Lightness (0–100), a & b — chromatic component — orthogonal coordinates.
                <br/><br/>
                But to represent part of all color varieties on screen or book pages well-known models as HSV and CMYK are used.
            </TextBlock>

            <TextBlock src={p3}>
                <h1>CMYK color model</h1>

                This model also got its name by base colors: Cyan, Magenta, Yellow and Black, alternatively black color is called the Key Color.
                <br/><br/>

                CMYK is subtractive model (from Eng. — subtract), meaning that it is based on subtracting other components from white color. This color scheme is mostly used in printing industry. Physically when cyan, magenta and yellow colors impose on each other we get dirty color as a result, to prevent this the black color was added.
                <br/><br/>

                CMYK model has lower color diapason then RGB because of printing tech limits. Before printing the image is separated into channels which are printed one by one: Yellow — Magenta — Cyan — Black.
                <br/><br/>

                Resulting printing color depends on percentage of each paint, however, this description cannot represents color as it is. We need to use another color profiles and models for this, XYZ and LAB are the most popular for now            </TextBlock>
            <TextBlock src={p4}>
                <h1>HSV color model</h1>

                The name hides parameters characterizing color in the model: H — Hue, S — Saturation, B — Brightness, (V — Value).
                <br/><br/>
                It’s also nonlinear color model, usually presented in form of cylinder or cone. Circumferentially we have value of Hue, on radius — Saturation, and height represents Brightness (Value). Hue varies from 0 to 360 degrees, but ranges of 0–100 or 0–1 are also used, Saturation — from 0 to 100, or 0–1 (if parameter higher the color becomes cleaner), Brightness — from 0 to 100 or 0–1.
                <br/><br/>


                Often, the model is used in graphic redactors because it is more visually convenient and vivid to people. There exist several flat representations of HSB(V) model.
                <br/><br/>

                Resulting printing color depends on percentage of each paint, however, this description cannot represents color as it is. We need to use another color profiles and models for this, XYZ and LAB are the most popular for now
            </TextBlock>

            <a href="https://example.com">
                <img src={link} alt=""/>
                Get to know more here
            </a>

            <button className="primary" onClick={history.goBack}>Back</button>
        </div>
    </Page>
}

export default ColorModelsLearn;
