import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { graphQLCommand } from '../../util';
import SliderComponent from '../slider-component/SliderComponent';
import ButtonComponent from "../Button-Component/ButtonComponent";
import ScrollerComponent from "../Scroller-Component/ScrollerComponent";
import './TurfDetailComponent.css';

const TurfDetailComponent = () => {
  const { id } = useParams();
  const [turfDetail, setTurfDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTurfs, setFilteredTurfs] = useState([]);

  // Fetch single turf by ID
  const fetchTurfDetail = async () => {
    if (!id) {
      setError('No turf ID provided. Please check the URL.');
      setLoading(false);
      return;
    }

    const query = `
      query ($id: ID!) {
        turf(id: $id) {
          id
          turfName
          address
          location
          phone
          amenities {
            parking
            drinkingWater
            spareKits
            nonAC
          }
          timing
          mainImage
          sliderImages
          sportType
          price
          rating
          firstTimeDiscount
        }
      }
    `;

    const variables = { id };

    try {
      const data = await graphQLCommand(query, variables);
      if (!data.turf) {
        setError('Turf not found.');
      } else {
        setTurfDetail(data.turf);
      }
    } catch (err) {
      console.error('Error fetching turf details:', err);
      setError(`Failed to fetch turf details: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all turfs and filter by location
  const fetchTurfData = async () => {
    const query = `
      query {
        getTurfs {
          id
          turfName
          address
          location
          phone
          amenities {
            parking
            drinkingWater
            spareKits
            nonAC
          }
          timing
          mainImage
          sliderImages
          sportType
          price
          rating
          firstTimeDiscount
        }
      }
    `;
    try {
      const data = await graphQLCommand(query);
      if (turfDetail && data.getTurfs) {
        const turfsByLocation = data.getTurfs.filter(
          (turf) => turf.location.toLowerCase() === turfDetail.location.toLowerCase() && turf.id !== turfDetail.id
        );
        setFilteredTurfs(turfsByLocation);
      }
    } catch (error) {
      console.error("Error fetching turf data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTurfDetail();
      await fetchTurfData(); // Fetch all turfs when the component mounts
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, turfDetail]);

  if (loading) return <div>Loading turf details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!turfDetail) return <div>No turf details available.</div>;

  return (
    <div className="turf-detail">
      <SliderComponent slides={turfDetail.sliderImages} />
      
      <div className="info-section">
        <div className="turf-header">
          <div className="turf-details">
            <h1>{turfDetail.turfName}, <span>{turfDetail.location}</span></h1>
            <div className="sport-type-rating">
              <span className="badge">{turfDetail.sportType}</span>
              <span className="rating">★ {turfDetail.rating}</span>
            </div>
          </div>
          <ButtonComponent btnName="Book Now" />
        </div>

        <div className="address-section">
          <h3>Address</h3>
          <p>{turfDetail.address}</p>
          <div className="address-icons">
            <i className="fas fa-directions"></i>
            <i className="fas fa-phone-alt"></i>
            <p>{turfDetail.phone}</p>
          </div>
        </div>

        <div className="amenities-section">
          <h3>Amenities</h3>
          <ul className="amenities-list">
            {turfDetail.amenities.parking && <li><i className="fas fa-parking"></i> Parking</li>}
            {turfDetail.amenities.drinkingWater && <li><i className="fas fa-water"></i> Drinking Water</li>}
            {turfDetail.amenities.spareKits && <li><i className="fas fa-toolbox"></i> Spare Kits</li>}
            {turfDetail.amenities.nonAC && <li><i className="fas fa-fan"></i> Non A/C</li>}
          </ul>
        </div>

        <div className="timing-section">
          <h3>Timings</h3>
          <p>{turfDetail.timing}</p>
        </div>

        <div className="reviews-section">
          <h3>Reviews</h3>
          <span className="review-rating">★ {turfDetail.rating}</span>
        </div>
      </div>
      <div className="related-turfs-section">
        {filteredTurfs.length > 0 ? (
          <ScrollerComponent items={filteredTurfs} />
        ) : (
          <p>No related turfs available in this location.</p>
        )}
      </div>

    </div>
  );
};

export default TurfDetailComponent;
