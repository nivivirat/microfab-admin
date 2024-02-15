import { Icon } from "@iconify/react";
import { ref, onValue } from 'firebase/database';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../../../../firebase';
import Slider from './Slider/Slider';

export default function MouldSlide() {
  const scrollRef = useRef(null);
  let [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRef = ref(db, 'Home/MouldSlide');
        onValue(dataRef, (snapshot) => {
          if (snapshot.exists()) {
            const dataObject = snapshot.val();
            const dataArray = Object.values(dataObject);
            setData(dataArray);
          }
        });
      } catch (error) {
        console.error('Error fetching data from Firebase:', error.message);
      }
    };

    fetchData();
  }, []);

  data = [...data, ...data];

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const scrollAmount = 20;
        const scrollWidth = scrollRef.current.scrollWidth / 2;

        if (scrollRef.current.scrollLeft >= scrollWidth) {
          // Reset scroll position to start when it reaches the end of original items
          scrollRef.current.scrollLeft -= scrollWidth / 4;
        } else {
          scrollRef.current.scrollLeft += scrollAmount;
        }
      }
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-['ClashDisplay'] w-[90%] h-[94%] flex flex-col justify-between rounded-[20px] bg-[#E9E9E9] md:mr-2 mr-14 mt-[8px]">
      {/* top */}
      <div className="flex h-[35%] w-full flex-row justify-between">
        <div className="bg-[#8AA6AA] h-full w-[47%] rounded-r-[20px] rounded-t-[20px]"></div>
        <div className="bg-[#b9c7c9] h-full w-[47%] rounded-l-[20px] rounded-t-[20px]"></div>
      </div>

      {/* middle */}
      <div className="flex flex-row h-[30%] w-[100%] justify-between">
        <div className="overflow-x-scroll text-center flex place-items-center justify-center w-full" ref={scrollRef} style={{ overflowX: 'hidden', scrollBehavior: 'smooth' }}>
          <Slider options={{ align: "center" }}>
            {data.map((item, index) => (
              <div key={item.order} className={`leading-5 h-full w-[200px] px-5 rounded-[20px] flex flex-col justify-center place-items-center font-bold ${index % 2 === 0 ? 'bg-white' : 'bg-primary'}`}>
                <div className={`h-[20px] w-[60px] place-items-center justify-center flex text-center ${index % 2 === 0 ? 'text-primary' : 'text-white'}`} >
                  <Icon icon={item.img} className='' />
                </div>
                <p className="text-[14px]">{item.line1}</p>
                <p className="text-[14px]">{item.line2}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* bottom */}
      <div className="flex h-[35%] w-full flex-row justify-between">
        <div className="bg-[#b9c7c9] h-full w-[47%] rounded-r-[20px] rounded-b-[20px]"></div>
        <div className="bg-[#8AA6AA] h-full w-[47%] rounded-l-[20px] rounded-b-[20px]"></div>
      </div>
    </div>
  );
}
