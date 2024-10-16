import React, { useState } from 'react';
import { storage, ref, uploadBytes, getDownloadURL } from '../../firebaseClient'; // Adjust the path accordingly
import { graphQLCommand } from '../../util'; // Adjust the path accordingly
import './AddTurfForm.css'; // Import CSS styles

const AddTurfForm = () => {
  const [turfName, setTurfName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [amenities, setAmenities] = useState({
    parking: false,
    drinkingWater: false,
    spareKits: false,
    nonAC: false,
  });
  const [timing, setTiming] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);

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

      // Prepare data for GraphQL mutation
      const turfData = {
        turfName,
        address,
        phone,
        amenities,
        timing,
        mainImage: mainImageURL,
        sliderImages: sliderImageURLs,
      };

      // Call your GraphQL mutation here
      const response = await graphQLCommand(`
        mutation addTurf(
          $turfName: String!,
          $address: String!,
          $phone: String!,
          $amenities: AmenitiesInput!,
          $timing: String!,
          $mainImage: String!,
          $sliderImages: [String!]!
        ) {
          addTurf(
            turfName: $turfName,
            address: $address,
            phone: $phone,
            amenities: $amenities,
            timing: $timing,
            mainImage: $mainImage,
            sliderImages: $sliderImages
          ) {
            id
            turfName
            mainImage
            sliderImages
          }
        }
      `, {
        turfName: turfData.turfName,
        address: turfData.address,
        phone: turfData.phone,
        amenities: turfData.amenities,
        timing: turfData.timing,
        mainImage: turfData.mainImage,
        sliderImages: turfData.sliderImages
      });

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
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
          <label>Timing:</label>
          <input
            type="text"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            required
          />
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
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default AddTurfForm;
