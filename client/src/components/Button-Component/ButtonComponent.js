import React from 'react';
import './ButtonComponent.css';

const ButtonComponent = ({ btnName, iconPath, onClick }) => {
    return (
        <div className="button">
            <button onClick={onClick}>
                {iconPath && <img src={`/assests/icons/${iconPath}`} alt={`${btnName} icon`} />}
                {btnName}
            </button>
        </div>
    );
};

export default ButtonComponent;
