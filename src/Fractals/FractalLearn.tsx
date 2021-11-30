import {FC, ReactNode} from "react";
import {Page} from "../Page";
import link from "../Assets/link.svg";
import p1 from "../Assets/learn_p1/1.gif";
import p2 from "../Assets/learn_p1/2.png";
import p3 from "../Assets/learn_p1/3.png";
import p4 from "../Assets/learn_p1/4.png";
import p5 from "../Assets/learn_p1/5.png";
import p6 from "../Assets/learn_p1/6.png";
import p7 from "../Assets/learn_p1/7.png";
import p8 from "../Assets/learn_p1/8.png";
import p9 from "../Assets/learn_p1/9.png";
import p10 from "../Assets/learn_p1/10.png";
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
const FractalLearn: FC = () => {
    const history = useHistory();

    return <Page isScrollable hasBackButton title="More about Mandelbrot & Julia set">
        <div className="article">
            <TextBlock src={p1}>
                <h1>A Fractal is a way to see infinity</h1>
            </TextBlock>
            <TextBlock src={p2}>
                Captivated by the motion of waves & mesmerized by the perfectly-imperfect symmetry of leaves, it’s crystal-clear we’re a pattern-seeking species.
            </TextBlock>

            <TextBlock src={p3}>
                Externally, studies have proven that we use patterns to weigh our environment of danger — a disruption in our daily routine (particularly back in hunter-&-gather societies) signals to our conscious that something is off. Internally, patterns are inscribed in our DNA; in an energy-conservation effort, most biological processes are duplicative & are therefore likely to generate a visual form indicative of patterns.
            </TextBlock>
            <TextBlock src={p4}>
                Fractals, the crux of fractal geometry, are infinitely complex & detailed patterns that are self-similar across different scales; they’re mathematical objects created by recursions of functions in the complex space. As we’ll see shortly, fractal geometry brings us much closer to replicating the irregularities & intricacies that surround us.
            </TextBlock>
            <TextBlock src={p5}>
                The prequel to modern fractal geometry begins in the early 1900s with a young protagonist by the name Gaston Julia. A curious collegiate student fascinated with music & mathematics, he was particularly drawn to complex numbers & functions.
            </TextBlock>

            <TextBlock src={p6}>
                Unfortunately, life abruptly interrupted Gaston’s academic endeavors midway through his academic career at the University of Paris when he was drafted & scripted into joining the army for World War I. Compounding his misfortune, in 1915 he lost his nose & was nearly blinded; awarded the Legion of Honour for his valor, Julia, unfortunately, had to wear a black strap across his face for the rest of his life.
            </TextBlock>
            <TextBlock src={p7}>
                Progress remained stagnant for decades. In fact, the now-accepted term fractals wasn’t coined until the 1970s, when one Benoit Mandlebrot brought the topic back to life.
            </TextBlock>
            <TextBlock src={p8}>
                Appropriately, Benoit’s entry to the field was inspired by nature; the first relevant publication for modern fractals is found in his 1975 investigative report, How Long Is the Coast of Britain? Statistical Self-Similarity and Fractional Dimension.In it, he explores geographical curves & discovers that while they’re undefinable, they are:
                <blockquote>
                    Statistically “self-similar,” each portion can be considered a reduced-scale image of the whole. In that case, the degree of complication can be described by a quantity D that has many properties of a “dimensions,” though it is fractional.
                </blockquote>
            </TextBlock>
            <TextBlock src={p9}>
                <h1>The Mandelbrot set is a dictionary of all Julia sets</h1>
                The visual above is the crux of fractal geometry. Tying it all together, it highlights the relationship between the Mandelbrot Set & all the corresponding Julia Sets within. Every dot in black (within the set) connects to a continuous Julia set, yet the middle lowest red dot, stemming from the white (outside of the set), connects to a cluster, a Fatou set.
            </TextBlock>
            <TextBlock src={p10}>
                Mandelbrot subsequently displayed images of the set & elaborated on its significance in speeches, papers & books. Much like Julia’s publication a near half-century ago, the Mandelbrot Set rocketed Benoit Mandelbrot to academic fame; consequently, the renewed interest established fractal geometry & eventually set the foundation for additional branches of math (such as chaos theory).
                <br/><br/>
                I won’t explore the philosophy here but it’s nothing short of poetic irony that it took imaginary numbers to mathematically map out reality. There is order behind the chaos; as Julia & Mandlebrot taught us, all we need to do is shift our perspective. This is hardly the beginning however, next, we’ll delve into some semi-original work as we attempt to bring significance to the Mandelbrot Set in three-dimensions…
            </TextBlock>

            <a href="https://example.com">
                <img src={link} alt=""/>
                Get to know more here
            </a>

            <button className="primary" onClick={history.goBack}>Back</button>
        </div>
    </Page>
}

export default FractalLearn;
