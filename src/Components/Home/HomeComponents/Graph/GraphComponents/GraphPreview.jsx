import React, { useState, useEffect } from 'react';
import sold from '../../../../../assets/Home/SoldGrahp/SoldGrahp.svg';
import { db } from '../../../../../../firebase';
import { ref, onValue } from 'firebase/database';

export default function GraphPreview() {
  const [isAnimationStarted, setAnimationStarted] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [maxValue, setMaxValue] = useState(0);
  const [yearsData, setYearsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from Firebase Realtime Database
    const fetchData = async () => {
      try {
        const dataRef = ref(db, 'Home/SoldGraph');
        // Listen for changes in the database
        onValue(dataRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const sortedYears = Object.keys(data)
              .map((year) => ({
                year: parseInt(year),
                value: data[year].value,
              }))
              .sort((a, b) => a.year - b.year) // Sort in ascending order based on year
              .slice(0, 7); // Take only the last 7 years

            setYearsData(sortedYears);
          } else {
            console.log('No data available');
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    };

    fetchData();
  }, []); // Run only once on mount

  useEffect(() => {
    // Calculate the maximum value and set initial isHovered value
    const max = Math.max(...yearsData.map((data) => data.value));
    setMaxValue(max);

    const yearWithMaxValue = yearsData.find((data) => data.value === max);
    if (yearWithMaxValue) {
      setIsHovered(yearWithMaxValue.year);
    }

    // Start the animation after 2 seconds
    const animationTimeout = setTimeout(() => {
      setAnimationStarted(true);
    }, 1500);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(animationTimeout);
  }, [yearsData]);

  const calculateHeight = (value) => {
    return isAnimationStarted ? `${(value / maxValue) * 80}%` : '0%';
  };

  const handleYearHover = (year) => {
    setIsHovered(year);
  };

  return (
    <div className="font-['ClashDisplay'] w-full h-full flex flex-col justify-between bg-black border border-black rounded-[20px] md:mr-4 ml-4 md:ml-0 mr-4">
      {isLoading ? (
        // Display a loading indicator while fetching data
        <div className="flex items-center justify-center h-full">
          Loading...
        </div>
      ) : (
        <div className="flex flex-row md:gap-2 gap-4 w-full h-full place-items-end pb-3">
          {yearsData.map(({ year, value }) => (
            <div key={year} className={`flex flex-col justify-end gap-2 place-items-center w-[13%] h-[90%]`}>
              <p className={`text-center text-white bg-[#414141] w-[90%] rounded-[10px] ${isHovered === year ? 'block' : 'hidden'} ${!isAnimationStarted ? 'hidden' : 'block'}`}>{value}</p>
              <div
                onMouseEnter={() => handleYearHover(year)}
                className={`${isHovered === year ? 'bg-primary text-white' : 'bg-white text-primary'} w-full rounded-[30px] text-[12px] flex justify-center place-items-end pb-2 transition-all duration-2000 ease-in h-[90%]`}
                style={{ height: calculateHeight(value), opacity: isAnimationStarted ? 1 : 0 }}
              >
                <p>{year}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white rounded-[15px] m-1 flex flex-row justify-between p-2 pl-5">
        <p className="font-extrabold text-[18px]">
          Machinery sold over <br></br>last 7 years
        </p>
        <div className="flex justify-center place-items-center">
          <img src={sold} alt="Sold Icon" className="h-10"></img>
        </div>
      </div>
    </div>
  );
}
