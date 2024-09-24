import React, { useState } from "react";
import ButtonComponent from "../Button-Component/ButtonComponent";
const HomePageComponent = () => {
    const [data] = useState(['abishek', 'vish', 'sasi'])
    const [dummy,setdummy] = useState(data)
    return(<div className="home-page">
        <ButtonComponent iconPath="user.png" btnName="Login"></ButtonComponent>
        <ul>
       { dummy.map((item,index)=>{
        console.log(item); 

      return <li key={index}>{item}</li>
                
            
        })}
        </ul>
    </div>)
};
export default HomePageComponent;