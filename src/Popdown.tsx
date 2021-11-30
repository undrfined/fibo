import classNames from "classnames";
import {FC, ReactNode, useCallback} from "react";
import close from './Assets/close.svg';
import apply from './Assets/apply.svg';

type OwnProps = {
    title: string;
    isOpen: boolean;
    setOpen?: (value: boolean) => void;
    children: ReactNode;
}

const Popdown: FC<OwnProps> = ({
    title,
    isOpen,
    setOpen,
    children,
}) => {
    const handleClose = useCallback(() => {
        if(setOpen)
        setOpen(false);
    }, [setOpen]);

    return <div className={classNames("popdown", isOpen && 'open')}>
        <div className="content">
            {children}
        </div>
        {setOpen && (
            <div className="nav">
                <img src={close} alt="" onClick={handleClose}/>
                <span>{title}</span>
                <img src={apply} alt="" onClick={handleClose}/>
            </div>
        )}
    </div>
}

export default Popdown;
