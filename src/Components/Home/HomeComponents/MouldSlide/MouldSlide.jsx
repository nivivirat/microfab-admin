import { Icon } from "@iconify/react";
import { ref, onValue } from 'firebase/database';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../../../../firebase';
import Slider from './Slider/Slider';
import Sliderop from './Slider/Sliderop';

export default function MouldSlide() {
  const topScrollRef = useRef(null);
  const middleScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  let [topData, setTopData] = useState([]);
  let [middleData, setMiddleData] = useState([]);
  let [bottomData, setBottomData] = useState([]);

  useEffect(() => {
    const fetchData = async (section) => {
      try {
        const dataRef = ref(db, `Home/MouldSlide/${section}`);
        onValue(dataRef, (snapshot) => {
          if (snapshot.exists()) {
            const dataObject = snapshot.val();
            const dataArray = Object.values(dataObject);
            switch (section) {
              case 'top':
                setTopData(dataArray);
                break;
              case 'middle':
                setMiddleData(dataArray);
                break;
              case 'bottom':
                setBottomData(dataArray);
                break;
              default:
                break;
            }
          }
        });
      } catch (error) {
        console.error(`Error fetching data for ${section} from Firebase:`, error.message);
      }
    };

    fetchData('top');
    fetchData('middle');
    fetchData('bottom');
  }, []);

  topData = [...topData, ...topData, ...topData];
  middleData = [...middleData, ...middleData , ...middleData];
  bottomData = [...bottomData, ...bottomData, ...bottomData];

  return (
    <div className="font-['ClashDisplay'] w-[90%] h-[94%] flex flex-col justify-between rounded-[20px] bg-[#E9E9E9] md:mr-2 mr-14 mt-[8px]">
      {/* top */}
      <div className="flex flex-row h-[40%] w-[100%] justify-between">
        <div className="overflow-x-scroll rotate-180 text-center flex place-items-center justify-center w-full" ref={topScrollRef} style={{ overflowX: 'hidden', scrollBehavior: 'smooth' }}>
          <Sliderop options={{ align: "center" }}>
            {topData.map((item, index) => (
              <div key={item.order} className={`rotate-180 leading-5 h-[100px] w-[250px] px-5 rounded-[20px] flex flex-col justify-center place-items-center font-bold ${index % 2 !== 0 ? 'bg-[#b9c7c9]' : 'bg-primary'}`}>
                <div className={`opacity-0 h-[20px] w-[60px] place-items-center justify-center flex text-center ${index % 2 !== 0 ? 'text-primary' : 'text-[#b9c7c9]'}`} >
                  {item.imageUrl && <img src={item.imageUrl} alt={`${index + 1}`} className="py-1 pt-3 w-10 h-10 object-contain" />}
                </div>
                <p className="text-[14px] opacity-0 font-bold mt-3">{item.line1}</p>
                <p className="text-[12px] opacity-0">{item.line2}</p>
              </div>
            ))}
          </Sliderop>
        </div>
      </div>

      {/* middle */}
      <div className="flex flex-row h-[40%] w-[100%] justify-between">
        <div className="overflow-x-scroll text-center flex place-items-center justify-center w-full" ref={middleScrollRef} style={{ overflowX: 'hidden', scrollBehavior: 'smooth' }}>
          <Slider options={{ align: "center" }}>
            {middleData.map((item, index) => (
              <div key={item.order} className={`leading-5 h-full w-[200px] px-5 rounded-[20px] flex flex-col justify-center place-items-center font-bold ${index % 2 === 0 ? 'bg-white' : 'bg-primary'}`}>
                <div className={`h-[20px] w-[60px] place-items-center justify-center flex text-center ${index % 2 === 0 ? 'text-primary' : 'text-white'}`} >
                  {item.imageUrl && <img src={item.imageUrl} alt={`${index + 1}`} className="py-1 pt-3 w-10 h-10 object-contain" />}
                </div>
                <p className="text-[14px] font-bold mt-3">{item.line1}</p>
                <p className="text-[12px]">{item.line2}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* bottom */}
      <div className="flex flex-row h-[40%] w-[100%] justify-between">
        <div className="overflow-x-scroll rotate-180 text-center flex place-items-center justify-center w-full" ref={bottomScrollRef} style={{ overflowX: 'hidden', scrollBehavior: 'smooth' }}>
          <Sliderop options={{ align: "center" }}>
            {bottomData.map((item, index) => (
              <div key={item.order} className={`rotate-180 leading-5 h-[100px] w-[230px] px-5 rounded-[20px] flex flex-col justify-center place-items-center font-bold ${index % 2 !== 0 ? 'bg-[#b9c7c9]' : 'bg-primary'}`}>
                <div className={`h-[20px] opacity-0 w-[60px] place-items-center justify-center flex text-center ${index % 2 !== 0 ? 'text-primary' : 'text-[#3b9c7c9]'}`} >
                  {item.imageUrl && <img src={item.imageUrl} alt={`${index + 1}`} className="py-3 pt-3 w-10 h-10 object-contain" />}
                </div>
                <p className="text-[14px] opacity-0 font-bold mt-3">{item.line1}</p>
                <p className="text-[12px] opacity-0">{item.line2}</p>
              </div>
            ))}
          </Sliderop>
        </div>
      </div>
    </div>
  );
}
