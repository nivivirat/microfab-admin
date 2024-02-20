import React, { useEffect, useState } from "react";
import Question from "../../../../assets/Home/WhyMicrofab/Question.svg";
import Case from "../../../../assets/Home/WhyMicrofab/Case.svg";
import { db } from '../../../../../firebase';
import { ref, get, set } from 'firebase/database';

const WhyMicrofab = () => {
    const [whyMicrofabData, setWhyMicrofabData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editHeading, setEditHeading] = useState('');
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await get(ref(db, 'Home/WhyMicrofab'));
                const data = snapshot.val();
                setWhyMicrofabData(data);
                setEditHeading(data.heading || '');
                setEditContent(data.content || '');
                setLoading(false);
                console.log('WhyMicrofab data:', data);
            } catch (error) {
                console.error('Error fetching WhyMicrofab data from Firebase:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpdate = async () => {
        try {
            // Update the database with the new data
            await set(ref(db, 'Home/WhyMicrofab'), {
                heading: editHeading,
                content: editContent,
            });
            console.log('Data updated successfully');
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    if (loading) {
        // Loading state: You can render a loading indicator here
        return <p>Loading...</p>;
    }

    if (!whyMicrofabData) {
        // Data not available
        return null;
    }

    return (
        <div className="px-10 border border-primary rounded-lg p-10 gap-10 flex flex-row">
            <div className="flex flex-col gap-5">
                <span className="font-extrabold text-3xl hover:text-primary">Why Microfab</span>
    
                <div className="transition-all w-[400px] duration-300 ease-in-out font-ClashDisplay md:h-full md:m-0 md:mr-4 m-4 hover:shadow-md hover:bg-[#a0b4b7] rounded-[16px] hover:shadow-gray-400 bg-gray-300 rounded-16 justify-center flex flex-col overflow-hidden">
                    {/* top */}
                    <div className="md:flex md:flex-col md:h-[50%] md:w-[60%] h-[40%] w-[45%] mt-[5px] ml-[5px] ">
                        <div className="md:rounded-[30px] rounded-[20px] p-2 md:p-0 bg-white flex flex-row place-items-center gap-1">
                            <div className="rounded-full bg-[#8aa6aa] md:m-2">
                                <img className="p-1 px-2" alt="question" src={Question}></img>
                            </div>
                            {editHeading || whyMicrofabData.heading}
                        </div>
                    </div>
    
                    {/* down */}
                    <div className="flex flex-row relative justify-between md:h-[50%]">
                        <p className="md:text-[17px] font-bold md:p-1 custom-font md:mt-0 mt-8 ml-3 place-content-center">
                            {editContent || whyMicrofabData.content}
                        </p>
                        <img src={Case} alt="case" className="md:h-[100%]"></img>
                    </div>
                </div>
            </div>
    
            <div className="md:text-[17px] font-bold md:p-1 custom-font md:mt-0 mt-12 ml-3 place-content-center">
                <input
                    type="text"
                    value={editHeading}
                    onChange={(e) => setEditHeading(e.target.value)}
                    className="border border-gray-300 rounded p-2 mb-2 focus:outline-none focus:border-primary"
                    placeholder="Edit Heading"
                />
                <br />
                <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="border border-gray-300 rounded p-2 mb-2 focus:outline-none focus:border-primary"
                    placeholder="Edit Content"
                />
                <br />
                <button
                    onClick={handleUpdate}
                    className="bg-primary text-white rounded py-2 px-4 hover:bg-primary-dark focus:outline-none"
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default WhyMicrofab;
