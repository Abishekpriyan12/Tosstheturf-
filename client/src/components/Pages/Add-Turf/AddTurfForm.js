import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../../firebaseClient";
import { graphQLCommand } from "../../../util";
import browserImageCompression from "browser-image-compression";
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
  const [recordingField, setRecordingField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize speech recognition
  const startVoiceInput = (field) => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice input. Please use Google Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setRecordingField(field);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      switch (field) {
        case "turfName":
          setTurfName(transcript);
          break;
        case "address":
          setAddress(transcript);
          break;
        case "phone":
          setPhone(transcript);
          break;
        case "price":
          setPrice(transcript);
          break;
        default:
          break;
      }
    };

    recognition.onerror = (event) => {
      alert(`An error occurred during voice input: ${event.error}`);
    };

    recognition.onend = () => {
      setRecordingField(null);
    };

    recognition.start();
  };

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

  const compressImage = async (file) => {
    const options = {
      maxWidthOrHeight: 800, // Adjust as necessary
      useWebWorker: true,
    };
    try {
      const compressedFile = await browserImageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Image compression failed:", error);
      return file; // Return original if compression fails
    }
  };

  const handleImageUpload = async (file) => {
    const compressedFile = await compressImage(file);
    const imageRef = ref(storage, `turfImages/${compressedFile.name}`);
    try {
      const existingUrl = await getDownloadURL(imageRef);
      return existingUrl;
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        await uploadBytes(imageRef, compressedFile);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
      }
      throw error;
    }
  };

  const uploadImages = async () => {
    const mainImageURL = await handleImageUpload(mainImage);

    const sliderImageURLs = await Promise.all(
      Array.from(sliderImages).map((file) => handleImageUpload(file))
    );

    return { mainImageURL, sliderImageURLs };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { mainImageURL, sliderImageURLs } = await uploadImages();

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

      alert("Your Turf Added successfully!");
      navigate(sessionStorage.getItem("role") === "Admin" ? "/displayturf" : "/ownerDashboard");
    } catch (error) {
      console.error("Error adding turf:", error);
      alert("There was an error adding the turf. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-form-container">
      <h1>Add Turf</h1>
      <form onSubmit={handleSubmit}>
        <div className="add-form-group">
          <label>Turf Name:</label>
          <div className="voice-input-group">
            <input
              type="text"
              value={turfName}
              onChange={(e) => setTurfName(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => startVoiceInput("turfName")}
              className={`voice-input-button ${recordingField === "turfName" ? "recording" : ""}`}
            >
              🎤
            </button>
          </div>
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
          <div className="voice-input-group">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => startVoiceInput("address")}
              className={`voice-input-button ${recordingField === "address" ? "recording" : ""}`}
            >
              🎤
            </button>
          </div>
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
          <div className="voice-input-group">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => startVoiceInput("phone")}
              className={`voice-input-button ${recordingField === "phone" ? "recording" : ""}`}
            >
              🎤
            </button>
          </div>
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
          <div className="voice-input-group">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => startVoiceInput("price")}
              className={`voice-input-button ${recordingField === "price" ? "recording" : ""}`}
            >
              🎤
            </button>
          </div>
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

        <button type="submit" className="add-form-submit-button" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {isLoading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default AddTurfForm;
