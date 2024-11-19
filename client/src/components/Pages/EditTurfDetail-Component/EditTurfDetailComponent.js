import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseClient"; // Firebase instance
import { graphQLCommand } from "../../../util";
import "./EditTurfDetailComponent.css";
import CardComponent from "../../Reusable-Components/Card-Component/CardComponent";
import ButtonComponent from "../../Reusable-Components/Button-Component/ButtonComponent";
 
const EditTurfDetailComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
 

  const { turf } = location.state || {};
 
  // State variables for each field
  const [turfName, setTurfName] = useState(turf?.turfName || "");
  const [address, setAddress] = useState(turf?.address || "");
  const [locationCity, setLocationCity] = useState(turf?.location || "");
  const [phone, setPhone] = useState(turf?.phone || "");
  const [amenities, setAmenities] = useState(turf?.amenities || {});
  const [timing, setTiming] = useState(turf?.timing || "");
  const [mainImage, setMainImage] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);
  const [sportType, setSportType] = useState(turf?.sportType || "");
  const [price, setPrice] = useState(turf?.price || "");
  const [firstTimeDiscount, setFirstTimeDiscount] = useState(
    turf?.firstTimeDiscount || ""
  );
 
  // Handle file input changes
  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };
 
  const handleSliderImagesChange = (e) => {
    setSliderImages(Array.from(e.target.files));
  };
 
  // Handle checkbox changes for amenities
  const handleAmenitiesChange = (e) => {
    setAmenities({ ...amenities, [e.target.name]: e.target.checked });
  };
 
  // Function to upload a file to Firebase and return its Cloud URL
  const uploadToFirebase = async (file) => {
    const fileRef = ref(storage, `turfImages/${file.name}`);
    console.log("Uploading file:", file.name);
    await uploadBytes(fileRef, file); 
    const url = await getDownloadURL(fileRef); 
    console.log("File uploaded. URL:", url);
    return url;
  };
 
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      console.log("Starting update process...");
 
      let mainImageURL = turf.mainImage; 
      if (mainImage) {
        mainImageURL = await uploadToFirebase(mainImage); 
      }
 
      const sliderImageURLs = await Promise.all(
        sliderImages.length > 0
          ? sliderImages.map((file) => uploadToFirebase(file)) 
          : turf.sliderImages.map((url) => url) 
      );
 
      // Prepare updated turf data
      const variables = {
        id: turf.id,
        turfName,
        address,
        location: locationCity,
        phone,
        amenities,
        timing,
        mainImage: mainImageURL,
        sliderImages: sliderImageURLs,
        sportType,
        price,
        firstTimeDiscount,
      };
 
      console.log("Prepared variables for GraphQL mutation:", variables);
 
      // GraphQL mutation to update the turf
      const mutation = `
        mutation updateTurf(
          $id: ID!,
          $turfName: String!,
          $address: String!,
          $location: String!,
          $phone: String!,
          $amenities: AmenitiesInput!,
          $timing: String!,
          $mainImage: String!,
          $sliderImages: [String!]!,
          $sportType: String!,
          $price: String!,
          $firstTimeDiscount: String
        ) {
          updateTurf(
            id: $id,
            turfName: $turfName,
            address: $address,
            location: $location,
            phone: $phone,
            amenities: $amenities,
            timing: $timing,
            mainImage: $mainImage,
            sliderImages: $sliderImages,
            sportType: $sportType,
            price: $price,
            firstTimeDiscount: $firstTimeDiscount
          ) {
            id
            turfName
          }
        }
      `;
 
      const response = await graphQLCommand(mutation, variables);
      console.log("GraphQL mutation response:", response);
 
      alert("Turf updated successfully!");
      navigate("/displayturf");
    } catch (error) {
      console.error("Error updating turf:", error);
      alert("Error updating turf: " + error.message);
    }
  };
 
  return (
    <div className="edit-turf-container">
      
      <h1>Edit Turf Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="edit-turf-form-group">
          <label htmlFor="turfName">Turf Name:</label>
          <input
            id="turfName"
            type="text"
            value={turfName}
            onChange={(e) => setTurfName(e.target.value)}
            placeholder="Enter the turf name"
            required
            aria-label="Turf Name"
          />
        </div>
        <div className="edit-turf-form-group">
          <label htmlFor="address">Address:</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter the address"
            required
            aria-label="Address"
          />
        </div>
        <div className="edit-turf-form-group">
          <label htmlFor="locationCity">Location:</label>
          <select
            id="locationCity"
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
            required
            aria-label="Location City"
          >
            <option value="" disabled>
              Select City
            </option>
            <option value="Cambridge">Cambridge</option>
            <option value="Waterloo">Waterloo</option>
            <option value="Kitchner">Kitchner</option>
          </select>
        </div>
        <div className="edit-turf-form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            required
            aria-label="Phone Number"
          />
        </div>
        <div className="edit-turf-form-group">
          <label htmlFor="sportType">Sport Type:</label>
          <select
            id="sportType"
            value={sportType}
            onChange={(e) => setSportType(e.target.value)}
            required
            aria-label="Sport Type"
          >
            <option value="" disabled>
              Select Sport Type
            </option>
            <option value="Cricket">Cricket</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
            <option value="Tennis">Tennis</option>
          </select>
        </div>
        <div className="edit-turf-form-group">
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price per hour"
            required
            aria-label="Price"
          />
        </div>
        <div className="edit-turf-form-group">
          <label>Amenities:</label>
          <div className="checkbox-group">
            {["parking", "drinkingWater", "spareKits", "nonAC"].map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name={key}
                  checked={amenities[key] || false}
                  onChange={handleAmenitiesChange}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <div className="edit-turf-form-group">
          <label htmlFor="firstTimeDiscount">First-Time Discount:</label>
          <input
            id="firstTimeDiscount"
            type="text"
            value={firstTimeDiscount}
            onChange={(e) => setFirstTimeDiscount(e.target.value)}
            placeholder="Enter first-time discount"
            aria-label="First-Time Discount"
          />
        </div>
        <div className="edit-turf-form-group">
          <label htmlFor="timing">Timing:</label>
          <select
            id="timing"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            required
            aria-label="Timing"
          >
            <option value="" disabled>
              Select Timing
            </option>
            <option value="5 AM to 9 AM">Morning (5 AM to 9 AM)</option>
            <option value="9 AM to 1 PM">Late Morning (9 AM to 1 PM)</option>
            <option value="1 PM to 5 PM">Afternoon (1 PM to 5 PM)</option>
            <option value="5 PM to 9 PM">Evening (5 PM to 9 PM)</option>
          </select>
        </div>
        <div className="edit-turf-form-group">
          <label htmlFor="mainImage">Main Image:</label>
          <input
            id="mainImage"
            type="file"
            onChange={handleMainImageChange}
            accept="image/*"
            aria-label="Main Image"
          />
        </div>
        <div className="edit-turf-form-group">
          <label htmlFor="sliderImages">Slider Images:</label>
          <input
            id="sliderImages"
            type="file"
            onChange={handleSliderImagesChange}
            accept="image/*"
            multiple
            aria-label="Slider Images"
          />
        </div>
        <button  type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
      
    </div>
  );  
};
 
export default EditTurfDetailComponent;