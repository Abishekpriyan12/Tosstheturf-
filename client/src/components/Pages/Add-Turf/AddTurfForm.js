import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../../firebaseClient";
import { graphQLCommand } from "../../../util";
import "./AddTurfForm.css";

const AddTurfForm = () => {
  const [turfName, setTurfName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [amenities, setAmenities] = useState({
    parking: false,
    drinkingWater: false,
    spareKits: false,
    nonAC: false,
  });
  const [timing, setTiming] = useState("");
  const [location, setLocation] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);
  const [sportType, setSportType] = useState("");
  const [price, setPrice] = useState("");
  const [firstTimeDiscount, setFirstTimeDiscount] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Set owner name automatically from session
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role === "Owner") {
      setOwnerName(sessionStorage.getItem("username"));
      setUserId(sessionStorage.getItem("userId"));
    }
  }, []);

  const handleSliderImagesChange = (e) => {
    setSliderImages(e.target.files);
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleAmenitiesChange = (e) => {
    setAmenities({ ...amenities, [e.target.name]: e.target.checked });
  };

  const handleImageUpload = async (file) => {
    const imageRef = ref(storage, `turfImages/${file.name}`);
    try {
      const existingUrl = await getDownloadURL(imageRef);
      return existingUrl;
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        await uploadBytes(imageRef, file);
        return await getDownloadURL(imageRef);
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const mainImageURL = await handleImageUpload(mainImage);
      const sliderImageURLs = await Promise.all(
        Array.from(sliderImages).map((file) => handleImageUpload(file))
      );

      const turfData = {
        turfName,
        ownerName,
        userId,
        address,
        location,
        phone,
        amenities,
        timing,
        mainImage: mainImageURL,
        sliderImages: sliderImageURLs,
        sportType,
        price,
        firstTimeDiscount,
        status: sessionStorage.getItem("role") === "Admin" ? "Approved" : "Pending", 
      };
      console.log("Payload being sent:", turfData);
      const response = await graphQLCommand(
        `mutation addTurf(
           $turfName: String!,
           $ownerName: String!,
            $userId: String!,
           $address: String!,
           $location: String!,
           $phone: String!,
           $amenities: AmenitiesInput!,
           $timing: String!,
           $mainImage: String!,
           $sliderImages: [String!]!,
           $sportType: String!,
           $price: String!,
           $firstTimeDiscount: String,
           $status: String!
         ) {
           addTurf(
             turfName: $turfName,
             ownerName: $ownerName,
              userId: $userId,
             address: $address,
             location: $location,
             phone: $phone,
             amenities: $amenities,
             timing: $timing,
             mainImage: $mainImage,
             sliderImages: $sliderImages,
             sportType: $sportType,
             price: $price,
             firstTimeDiscount: $firstTimeDiscount,
             status: $status
           ) {
             id
             turfName
             status
           }
         }`,
        turfData
      );

      console.log("Turf added:", response);
      navigate(sessionStorage.getItem("role") === "Admin" ? "/displayturf" : "/ownerDashboard");
    } catch (error) {
      console.error("Error adding turf:", error);
    }
  };

  return (
    <div className="add-form-container">
      <h1>Add Turf</h1>
      <form onSubmit={handleSubmit}>
        <div className="add-form-group">
          <label>Turf Name:</label>
          <input
            type="text"
            value={turfName}
            onChange={(e) => setTurfName(e.target.value)}
            required
          />
        </div>
        <div className="add-form-group">
          <label>Owner Name:</label>
          <input
            type="text"
            value={ownerName}
            readOnly={sessionStorage.getItem("role") === "Owner"}
            onChange={(e) => setOwnerName(e.target.value)}
            required
          />
        </div>
        <div className="add-form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="add-form-group">
          <label>Location:</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select City</option>
            <option value="Cambridge">Cambridge</option>
            <option value="Waterloo">Waterloo</option>
            <option value="Kitchner">Kitchner</option>
          </select>
        </div>
        <div className="add-form-group">
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="add-form-group">
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
        <div className="add-form-group">
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="add-form-group">
          <label>Amenities:</label>
          <div className="add-form-checkbox-group">
            <label>
              <input
                type="checkbox"
                name="parking"
                checked={amenities.parking}
                onChange={handleAmenitiesChange}
              />
              Parking
            </label>
            <label>
              <input
                type="checkbox"
                name="drinkingWater"
                checked={amenities.drinkingWater}
                onChange={handleAmenitiesChange}
              />
              Drinking Water
            </label>
            <label>
              <input
                type="checkbox"
                name="spareKits"
                checked={amenities.spareKits}
                onChange={handleAmenitiesChange}
              />
              Spare Kits
            </label>
            <label>
              <input
                type="checkbox"
                name="nonAC"
                checked={amenities.nonAC}
                onChange={handleAmenitiesChange}
              />
              Non A/C
            </label>
          </div>
        </div>
        <div className="add-form-group">
          <label>First-Time Discount:</label>
          <input
            type="text"
            value={firstTimeDiscount}
            onChange={(e) => setFirstTimeDiscount(e.target.value)}
          />
        </div>
        <div className="add-form-group">
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
        <div className="add-form-group">
          <label>Upload Main Image:</label>
          <input
            type="file"
            onChange={handleMainImageChange}
            accept="image/*"
            required
          />
        </div>
        <div className="add-form-group">
          <label>Upload Slider Images (at least 3):</label>
          <input
            type="file"
            onChange={handleSliderImagesChange}
            accept="image/*"
            multiple
            required
          />
        </div>
        <button type="submit" className="add-form-submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddTurfForm;
