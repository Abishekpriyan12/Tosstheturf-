import React, { useEffect, useState } from 'react';
import { graphQLCommand } from '../../util'; // Adjust the path as needed
import SliderComponent from '../slider-component/SliderComponent'; // Adjust the path as needed

const TurfList = () => {
  const [turfs, setTurfs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurfs = async () => {
      const query = `
        query {
          getTurfs {
            id
            turfName
            address
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
          }
        }
      `;

      try {
        const data = await graphQLCommand(query);
        setTurfs(data.getTurfs);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTurfs();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Turfs List</h2>
      <ul>
        {turfs.map((turf) => (
          <li key={turf.id}>
            <h3>{turf.turfName}</h3>
            <p>Address: {turf.address}</p>
            <p>Phone: {turf.phone}</p>
            <p>Amenities: {JSON.stringify(turf.amenities)}</p>
            <img src={turf.mainImage} alt={turf.turfName} style={{ width: '200px' }} />
            {/* Pass slider images to the SliderComponent */}
            <SliderComponent slides={turf.sliderImages} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TurfList;
