import arrow from '../Assets/arrow.svg';

type OwnProps = {
    name: string;
    icon: string;
    info: string;
    index: number;
    move: (i: number, is: number) => void;
    onClick?: () => void;
}

export default function Transformation({ onClick, name, info, icon, index, move }: OwnProps) {

    return <div className="transformation">
        <div className="icon" onClick={onClick}>
            <img src={icon} alt="icon"/>
        </div>
        <div className="data">
            <span className="title">{name}</span>
            <span className="info">{info}</span>
        </div>
        <div className="buttons">
            {index !== 0 && <img src={arrow} alt="" onClick={() => move(index, -1)}/>}
            {index !== 2 && <img src={arrow} alt="" onClick={() => move(index, 1)} style={{ transform: 'rotateZ(180deg)'}}/>}
        </div>
    </div>
}
