import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { onValue, ref, update } from 'firebase/database';
import { db } from '../../../../../../firebase';

export default function AnalyticsPreview() {
    const [analyticsData, setAnalyticsData] = useState({
        down: { content: '', number: '', label: '' },
        left: { content: '', number: '' },
        right: { content: '', number: '' },
    });

    const [editMode, setEditMode] = useState(false);
    const [labelText, setLabelText] = useState(analyticsData.down?.label || "Countries");
    const [duration, setDuration] = useState(7); // Initial duration value

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataRef = ref(db, 'Home/Analytics');
                onValue(dataRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();

                        // Check if the expected keys exist
                        if (data && 'down' in data && 'left' in data && 'right' in data) {
                            setAnalyticsData(data);
                            setLabelText(data.down?.label || "Countries");
                            setDuration(data.duration || 7); // Set duration from the fetched data
                        } else {
                            console.error('Invalid data structure in Firebase:', data);
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching data from Firebase:', error.message);
            }
        };

        fetchData();
    }, []);

    const getNumericValue = (stringValue) => {
        if (stringValue) {
            return parseInt(stringValue.replace(/[\D]+/g, ''), 10) || 0;
        }
        return 0;
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        // Update data in Firebase
        const dataToUpdate = {
            'Home/Analytics/down/content': analyticsData.down.content,
            'Home/Analytics/down/number': analyticsData.down.number,
            'Home/Analytics/down/label': labelText,
            'Home/Analytics/left/content': analyticsData.left.content,
            'Home/Analytics/left/number': analyticsData.left.number,
            'Home/Analytics/right/content': analyticsData.right.content,
            'Home/Analytics/right/number': analyticsData.right.number,
            'Home/Analytics/duration': duration, // Add duration to the data
        };

        update(ref(db), dataToUpdate)
            .then(() => {
                console.log('Data updated successfully!');
                setEditMode(false);
            })
            .catch((error) => {
                console.error('Error updating data:', error.message);
            });
    };

    return (
        <div className="font-['ClashDisplay'] md:ml-[10%] md:mt-16 m-6 w-full flex flex-col md:justify-center md:place-items-start">
            <p className="text-[#8AA6AA] font-bold md:text-[35px] text-[30px] md:mt-[3%]">Analytics</p>
            <div className="w-full flex flex-col md:justify-start">
                {editMode ? (
                    <div>
                        <label className='font-bold'>Speed of animation : (In seconds) </label>
                        <input
                            className='w-[200px] border border-primary my-4'
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>
                ) : (
                    <></>
                )}
                {/* top */}
                <div className="md:w-[80%] w-[80%] flex md:flex-row flex-col md:justify-between gap-10">
                    <div>
                        <h1 className="md:text-[80px] text-[50px] flex flex-row font-[1000]">
                            {editMode ? (
                                <input
                                    className='w-full border border-primary'
                                    type="text"
                                    value={analyticsData.left.number}
                                    onChange={(e) => setAnalyticsData({ ...analyticsData, left: { ...analyticsData.left, number: e.target.value } })}
                                />
                            ) : (
                                <CountUp
                                    end={getNumericValue(analyticsData.left.number)}
                                    duration={duration}
                                    separator=","
                                    useEasing={false}
                                />
                            )}
                            <span className="text-[#8AA6AA]">+</span>
                        </h1>
                        {editMode ? (
                            <input
                                className='w-full border border-primary'
                                type="text"
                                value={analyticsData.left.content}
                                onChange={(e) => setAnalyticsData({ ...analyticsData, left: { ...analyticsData.left, content: e.target.value } })}
                            />
                        ) : (
                            <p className="text-[15px] font-semibold">{analyticsData.left.content}</p>
                        )}
                    </div>
                    <div className="">
                        <h1 className="md:text-[80px] text-[50px] flex flex-row font-[1000]">
                            {editMode ? (
                                <input
                                    className='w-full border border-primary'
                                    type="text"
                                    value={analyticsData.right.number}
                                    onChange={(e) => setAnalyticsData({ ...analyticsData, right: { ...analyticsData.right, number: e.target.value } })}
                                />
                            ) : (
                                <CountUp
                                    end={getNumericValue(analyticsData.right.number)}
                                    duration={duration}
                                    separator=","
                                    useEasing={false}
                                />
                            )}
                            <span className="text-[#8AA6AA]">+</span>
                        </h1>
                        {editMode ? (
                            <input
                                className='w-full border border-primary'
                                type="text"
                                value={analyticsData.right.content}
                                onChange={(e) => setAnalyticsData({ ...analyticsData, right: { ...analyticsData.right, content: e.target.value } })}
                            />
                        ) : (
                            <p className="font-semibold">{analyticsData.right.content}</p>
                        )}
                    </div>
                </div>

                {/* bottom */}
                <div className="md:w-[80%] w-[80%] mt-[30px]">
                    <h1 className="md:text-[80px] text-[50px] flex flex-row font-[1000]">
                        {editMode ? (
                            <input
                                className='w-full border border-primary'
                                type="text"
                                value={analyticsData.down.number}
                                onChange={(e) => setAnalyticsData({ ...analyticsData, down: { ...analyticsData.down, number: e.target.value } })}
                            />
                        ) : (
                            <CountUp
                                end={getNumericValue(analyticsData.down?.number)}
                                duration={duration}
                                separator=","
                                useEasing={false}
                            />
                        )}
                        <span className="text-[#8AA6AA]">+</span>
                        {editMode ? (
                            <input
                                className='w-full border border-primary'
                                type="text"
                                value={labelText}
                                onChange={(e) => setLabelText(e.target.value)}
                            />
                        ) : (
                            labelText
                        )}
                    </h1>
                    {editMode ? (
                        <input
                            className='w-full border border-primary'
                            type="text"
                            value={analyticsData.down?.content}
                            onChange={(e) => setAnalyticsData({ ...analyticsData, down: { ...analyticsData.down, content: e.target.value } })}
                        />
                    ) : (
                        <p className="font-semibold">{analyticsData.down?.content}</p>
                    )}
                </div>
            </div>

            {editMode && (
                <div className="flex mt-10 space-x-4">
                    <button onClick={handleSaveClick} className="bg-primary text-white p-2 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:border-primary">
                        Save Changes
                    </button>
                    <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white p-2 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:border-gray-700">
                        Cancel
                    </button>
                </div>
            )}

            {!editMode && (
                <button onClick={handleEditClick} className="bg-primary mt-10 px-4 text-white p-2 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:border-primary">
                    Edit
                </button>
            )}
        </div>
    );
}
