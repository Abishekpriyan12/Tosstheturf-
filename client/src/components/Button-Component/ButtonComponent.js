import React from "react";
import './ButtonComponent.css';

const ButtonComponent = ({ btnName, iconPath, className }) => {
  return (
    <div className={`button ${className ? className : ''}`}>
      <button>
        {iconPath && <img src={`/assets/icons/${iconPath}`} alt={`${btnName} icon`} />}
        {btnName}
      </button>
    </div>
  );
};

export default ButtonComponent;
