import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseClient"; // Firebase instance
import { graphQLCommand } from "../../../util";
import "./EditTurfDetailComponent.css";
 
const EditTurfDetailComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
 
  // Extract turf data from location state
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
    await uploadBytes(fileRef, file); // Upload file
    const url = await getDownloadURL(fileRef); // Get the Cloud URL
    console.log("File uploaded. URL:", url);
    return url;
  };
 
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      console.log("Starting update process...");
 
      let mainImageURL = turf.mainImage; // Retain the current main image URL
      if (mainImage) {
        mainImageURL = await uploadToFirebase(mainImage); // Upload new main image
      }
 
      const sliderImageURLs = await Promise.all(
        sliderImages.length > 0
          ? sliderImages.map((file) => uploadToFirebase(file)) // Upload new slider images
          : turf.sliderImages.map((url) => url) // Retain current slider image URLs
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
      <h1>Edit Turf</h1>
      <form onSubmit={handleSubmit}>
        <div className="edit-turf-form-group">
          <label>Turf Name:</label>
          <input
            type="text"
            value={turfName}
            onChange={(e) => setTurfName(e.target.value)}
            required
          />
        </div>
        <div className="edit-turf-form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="edit-turf-form-group">
          <label>Location:</label>
          <select
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
            required
          >
            <option value="">Select City</option>
            <option value="Cambridge">Cambridge</option>
            <option value="Waterloo">Waterloo</option>
            <option value="Kitchner">Kitchner</option>
          </select>
        </div>
        <div className="edit-turf-form-group">
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="edit-turf-form-group">
          <label>Sport Type:</label>
          <select
            value={sportType}
            onChange={(e) => setSportType(e.target.value)}
            required
          >
            <option value="">Select Sport Type</option>
            <option value="Cricket">Cricket</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
            <option value="Tennis">Tennis</option>
          </select>
        </div>
        <div className="edit-turf-form-group">
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
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
          <label>First-Time Discount:</label>
          <input
            type="text"
            value={firstTimeDiscount}
            onChange={(e) => setFirstTimeDiscount(e.target.value)}
          />
        </div>
        <div className="edit-turf-form-group">
          <label>Timing:</label>
          <select
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            required
          >
            <option value="">Select Timing</option>
            <option value="5 AM to 9 AM">Morning (5 AM to 9 AM)</option>
            <option value="9 AM to 1 PM">Late Morning (9 AM to 1 PM)</option>
            <option value="1 PM to 5 PM">Afternoon (1 PM to 5 PM)</option>
            <option value="5 PM to 9 PM">Evening (5 PM to 9 PM)</option>
          </select>
        </div>
        <div className="edit-turf-form-group">
          <label>Main Image:</label>
          <input type="file" onChange={handleMainImageChange} accept="image/*" />
        </div>
        <div className="edit-turf-form-group">
          <label>Slider Images:</label>
          <input
            type="file"
            onChange={handleSliderImagesChange}
            accept="image/*"
            multiple
          />
        </div>
        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};
 
export default EditTurfDetailComponent;