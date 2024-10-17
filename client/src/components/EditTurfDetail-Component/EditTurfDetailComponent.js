import React, { useEffect, useState } from "react";
import ButtonComponent from "../Button-Component/ButtonComponent";
import NavBarComponent from "../navigation-component/NavBarComponent";
import "./EditTurfDetailComponent.css";
import CardComponent from "../Card-Component/CardComponent";
import FooterComponent from "../footer-component/FooterComponent";
import { graphQLCommand } from "../../util";

const EditTurfDetailComponent = () => {
  const [navBarData, setNavBarData] = useState([]);

  const fetchNavBarData = async () => {
    const query = `
      query {
        getNavItems {
          id
          name
          url
        }
      }
    `;
    const data = await graphQLCommand(query);
    setNavBarData(data.getNavItems || []);
  };

  useEffect(() => {
    fetchNavBarData();
  }, []);

  return (
    <div className="editturfdetail-page">
      <NavBarComponent navBarData={navBarData} />

      <div className="editturf-main">
        <CardComponent width={"70%"}>
          <div className="edit-turf-form">
            <h2>Edit Turf Details</h2>

            <form>
              <div className="editturf-form-row">
                <div className="editturf-column">
                  <input
                    type="text"
                    placeholder="Owner Name"
                    className="editturf-form-input"
                  />
                  <input
                    type="email"
                    placeholder="Owner Email"
                    className="editturf-form-input"
                  />
                  <input
                    type="text"
                    placeholder="Turf Name"
                    className="editturf-form-input"
                  />
                  <input
                    type="number"
                    placeholder="Cost"
                    className="editturf-form-input"
                  />
                </div>

                <div className="editturf-column">
                  <input
                    type="text"
                    placeholder="Location"
                    className="editturf-form-input"
                  />
                  <input
                    type="time"
                    placeholder="Opening Time"
                    className="editturf-form-input"
                  />
                  <input
                    type="time"
                    placeholder="Closing Time"
                    className="editturf-form-input"
                  />
                  <div className="file-upload">
                    <label htmlFor="turfImage" className="file-upload-label">
                      <img
                        src="\assests\images\fileuploadicon.png"
                        alt="Upload Icon"
                      />
                      Update Turf Image
                    </label>
                    <input id="turfImage" type="file" />
                  </div>
                </div>
              </div>

              <div className="submit-button">
                <ButtonComponent btnName={"Submit"} />
              </div>
            </form>
          </div>
        </CardComponent>
      </div>

      <FooterComponent />
    </div>
  );
};

export default EditTurfDetailComponent;


