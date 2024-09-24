import React from "react";
import './ButtonComponent.css'
const ButtonComponent = ({btnName}) => {
    return(<div className="button">
        <button>{btnName}</button>
    </div>)
};
export default ButtonComponent;