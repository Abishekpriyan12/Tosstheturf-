import React, { useState } from "react";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../../firebaseClient";
import { graphQLCommand } from  "../../../util";
import "./AddTurfForm.css";

const AddTurfForm = () => {
  const [turfName, setTurfName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [amenities, setAmenities] = useState({
    parking: false,
    drinkingWater: false,
    spareKits: false,
    nonAC: false,
  });
  const [timing, setTiming] = useState("");
  const [location, setlocation] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);
  const [sportType, setSportType] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [firstTimeDiscount, setFirstTimeDiscount] = useState("");

  const handleSliderImagesChange = (e) => {
    setSliderImages(e.target.files);
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleAmenitiesChange = (e) => {
    setAmenities({ ...amenities, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload main image
      const mainImageRef = ref(storage, `turfImages/${mainImage.name}`);
      await uploadBytes(mainImageRef, mainImage);
      const mainImageURL = await getDownloadURL(mainImageRef);

      // Upload slider images
      const sliderImageURLs = await Promise.all(
        Array.from(sliderImages).map(async (file) => {
          const sliderImageRef = ref(storage, `turfImages/${file.name}`);
          await uploadBytes(sliderImageRef, file);
          return await getDownloadURL(sliderImageRef);
        })
      );

 
      const turfData = {
        turfName,
        address,
        location,
        phone,
        amenities,
        timing,
        mainImage: mainImageURL,
        sliderImages: sliderImageURLs,
        sportType,
        price,
        rating,
        firstTimeDiscount,
      };

      // Call your GraphQL mutation here
      const response = await graphQLCommand(
        `
        mutation addTurf(
          $turfName: String!,
          $address: String!,
          $location:String!,
          $phone: String!,
          $amenities: AmenitiesInput!,
          $timing: String!,
          $mainImage: String!,
          $sliderImages: [String!]!,
          $sportType: String!,
         $price: String!   
          $rating: String!,
          $firstTimeDiscount: String
        ) {
          addTurf(
            turfName: $turfName,
            address: $address,
            location:$location,
            phone: $phone,
            amenities: $amenities,
            timing: $timing,
            mainImage: $mainImage,
            sliderImages: $sliderImages,
            sportType: $sportType,
            price: $price,
            rating: $rating,
            firstTimeDiscount: $firstTimeDiscount
          ) {
            id
            turfName
            mainImage
            sliderImages
          }
        }
      `,
        {
          turfName: turfData.turfName,
          address: turfData.address,
          location:turfData.location,
          phone: turfData.phone,
          amenities: turfData.amenities,
          timing: turfData.timing,
          mainImage: turfData.mainImage,
          sliderImages: turfData.sliderImages,
          sportType: turfData.sportType,
          price: turfData.price,
          rating: turfData.rating,
          firstTimeDiscount: turfData.firstTimeDiscount,
        }
      );

      console.log("Turf added:", response);
    } catch (error) {
      console.error("Error adding turf:", error);
    }
  };

  return (
    <div className="form-container">
      <h1>Add Turf</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Turf Name:</label>
          <input
            type="text"
            value={turfName}
            onChange={(e) => setTurfName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <select
            value={location}
            onChange={(e) => setlocation(e.target.value)}
            required
          >
            <option value="">Select Timing</option>
            <option value="Cambridge">Cambridge</option>
            <option value="Waterloo">Waterloo</option>
            <option value="Kitchner">Kitchner</option>
          </select>
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Sport Type:</label>
          <input
            type="text"
            value={sportType}
            onChange={(e) => setSportType(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            max="5"
            min="0"
            step="0.1"
            required
          />
        </div>
        <div className="form-group">
          <label>Amenities:</label>
          <div className="checkbox-group">
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
        <div className="form-group">
          <label>First-Time Discount:</label>
          <input
            type="text"
            value={firstTimeDiscount}
            onChange={(e) => setFirstTimeDiscount(e.target.value)}
          />
        </div>
        <div className="form-group">
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
        <div className="form-group">
          <label>Upload Main Image:</label>
          <input
            type="file"
            onChange={handleMainImageChange}
            accept="image/*"
            required
          />
        </div>
        <div className="form-group">
          <label>Upload Slider Images (at least 3):</label>
          <input
            type="file"
            onChange={handleSliderImagesChange}
            accept="image/*"
            multiple
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddTurfForm;
