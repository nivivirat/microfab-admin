import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { db, storage } from '../../../../../firebase';
import figure from '../../../../assets/AboutUs/KeyFigures/keyFigures.svg'
import { ref, get, update } from 'firebase/database';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';

const KeyFigures = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        const keyFiguresRef = ref(db, 'AboutUs/keyFigures');

        get(keyFiguresRef)
            .then((snapshot) => {
                const keyFiguresData = snapshot.val();
                setData(keyFiguresData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    const handleSaveClick = async () => {
        // Update the data in the database
        const keyFiguresRef = ref(db, 'AboutUs/keyFigures');
        await update(keyFiguresRef, data);

        // Upload a new image if provided
        if (newImage) {
            const storageRef = ref(storage, 'your-storage-path/' + newImage.name);
            await uploadBytes(storageRef, newImage);
            const imageURL = await getDownloadURL(storageRef);
            const newData = { ...data };
            newData.blocks[0].imageUrl = imageURL;
            setData(newData);
        }

        setEditMode(false);
    };

    const handleInputChange = (event, blockIndex, boxIndex, field) => {
        const newData = { ...data };
        const inputValue = event.target.value;

        // Check if the input value is a number
        // const isNumber = !isNaN(inputValue);

        newData.blocks[blockIndex].boxes[boxIndex][field] = inputValue;
        setData(newData);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleCancelClick = () => {
        setEditMode(false);
    };

    return (
        <div className='px-10 border border-primary rounded-lg p-10 flex-row'>
            <div className='pl-10'>
                <ul className='list-disc'>
                    <li>place only numbers in the left box to get counting animation</li>
                </ul>
            </div>
            {data && (
                <div className="flex mt-12 h-[600px] animate__animated animate__fadeInLeft animate__delay-2s">
                    <div className="bg-white md:mb-32 mb-44">
                        <img src={figure} alt={data.blocks[0].imageAlt} className="w-[650px] md:block hidden h-full object-cover" />
                    </div>
                    <div className="flex-1 mb-24 sm:ml-0 bg-white p-8 flex flex-col place-items-center justify-center">
                        <h3 className="lg:ml-0 sm:ml-0 text-5xl sm:text-4xl text-[#8AA6AA] pb-5 leading-tight font-['ClashDisplay']">
                            <strong>
                                {editMode ? (
                                    <input type="text" value={data.title} onChange={(e) => handleInputChange(e, 0, 0, 'title')} className="border border-white bg-primary text-white px-2 py-1 rounded-md" />
                                ) : (
                                    data.title
                                )}
                            </strong>
                        </h3>
                        <h3 className="mb-4 text-2xs text-[#8AA6AA] mx-10 leading-tight font-['ClashDisplay']">
                            {editMode ? (
                                <textarea value={data.description} onChange={(e) => handleInputChange(e, 0, 0, 'description')} className="border border-white bg-primary w-[500px] text-white px-2 py-1 rounded-md" />
                            ) : (
                                data.description
                            )}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-22">
                            {data.blocks[1].boxes.map((box, boxIndex) => (
                                <div key={boxIndex}>
                                    <div className={`w-36 h-36 md:w-30 p-6 md:m-1 mb-2 bg-[#8AA6AA] text-white `}>
                                        <h3 className="text-2xl text-white leading-tight -mb-6 font-['ClashDisplay']">
                                            <center>
                                                <strong>
                                                    {editMode ? (
                                                        <>
                                                            <span className='flex flex-row border border-black'>
                                                                <input type="number" value={box.count} onChange={(e) => handleInputChange(e, 1, boxIndex, 'count')} className="border border-white bg-primary text-white px-2 py-1 w-[70px] text-sm rounded-md mr-1" />
                                                                <input type="text" value={box.customValue} onChange={(e) => handleInputChange(e, 1, boxIndex, 'customValue')} className="border border-white bg-primary text-white px-2 w-[30px] py-1 rounded-md" />
                                                            </span>
                                                            <input type="text" value={box.percentage} onChange={(e) => handleInputChange(e, 1, boxIndex, 'percentage')} className="border border-white bg-primary text-white px-2 w-[100px] py-1 rounded-md mt-1" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CountUp end={box.count} duration={box.countDuration} separator="," />
                                                            {box.customValue && box.customValue}
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className='text-2xs'>
                                                                {box.percentage && box.percentage}
                                                            </span>
                                                        </>
                                                    )}
                                                </strong>
                                            </center>
                                        </h3>
                                        <br />
                                        <h3 className=" text-xs text-white w-full m-0 leading-tight ll font-['ClashDisplay']">
                                            <center>
                                                {editMode ? (
                                                    <input type="text" value={box.title} onChange={(e) => handleInputChange(e, 1, boxIndex, 'title')} className="border w-[120px] border-white bg-primary text-white px-2 py-1 rounded-md" />
                                                ) : (
                                                    box.title
                                                )}
                                            </center>
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            {editMode ? (
                                <>
                                    <button onClick={handleSaveClick} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                                        Save
                                    </button>
                                    <button onClick={handleCancelClick} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleEditClick} className="bg-green-500 text-white px-4 py-2 rounded-md">
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeyFigures;
