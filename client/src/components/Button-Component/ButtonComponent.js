import React from "react";
import './ButtonComponent.css'
const ButtonComponent = ({btnName,iconPath}) => {
    return(<div className="button">
        <button>{iconPath && <img src={iconPath} alt={`${btnName} icon`}></img>}{btnName}</button>
    </div>)
};
export default ButtonComponent;