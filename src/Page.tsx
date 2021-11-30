import {FC} from "react";
import {useHistory} from "react-router-dom";
import back from "./Assets/back.svg";
import info from "./Assets/info.svg";
import classNames from "classnames";

type OwnProps = {
    title: string;
    subtitle?: string;
    hasBackButton?: boolean;
    learnPage?: string;
    navItems?: NavItem[];
    children?: JSX.Element | JSX.Element[];
    isScrollable?: boolean;
};

export type NavItem = {
   name: string;
   icon: string;
   onClick: () => void;
};

export const Page: FC<OwnProps> = ({
    title,
    subtitle,
    hasBackButton,
    learnPage,
    navItems,
    children,
    isScrollable,
}) => {
    const history = useHistory();
    return <div className={classNames("Page", isScrollable && 'is-scrollable')}>
        <div className="header">
            {hasBackButton && <button className="back-button" onClick={history.goBack}>
                <img src={back} alt=""/>
            </button>}
            {learnPage && <button className="info-button" onClick={() => history.push(learnPage)}>
                <img src={info} alt=""/>
            </button>}
        </div>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        <div className="content">
            {children}
        </div>
        {navItems && <div className="navbar">
            {navItems.map((navItem, i) => (
                <div className="item" onClick={navItem.onClick} key={i}>
                    <img src={navItem.icon} alt=""/>
                    <span>{navItem.name}</span>
                </div>
            ))}
        </div>}
    </div>;
}
