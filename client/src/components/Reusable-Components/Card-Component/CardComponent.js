import React from "react";
import PropTypes from "prop-types";

const CardComponent = ({ children, width, height, backgroundColor,imageSrc }) => {
  return (
    <div
      style={{
        width: width || 'auto',
        height: height || 'auto',
        backgroundColor: backgroundColor || "#222", 
        padding: "16px", 
        borderRadius: "25px", 
      }}
    >
      {children}
    </div>
  );
};

CardComponent.propTypes = {
  children: PropTypes.node,
  width: PropTypes.string,
  height: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default CardComponent;
