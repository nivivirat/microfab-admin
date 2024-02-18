import { get, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import AdvantageCard from './ManufacturingPageComponents/AdvantageCard';
import ApplicationCard from './ManufacturingPageComponents/ApplicationCard';

const ManufacturingPage = () => {
    const manufacturingPages = ['BFS', 'FFS', 'ISBM', 'IV'];

    const [selectedPage, setSelectedPage] = useState('BFS');
    const [advantagesData, setAdvantagesData] = useState([]);
    const [applicationsData, setApplicationsData] = useState([]);
    const [editableAdvantageIndex, setEditableAdvantageIndex] = useState(null);
    const [editableApplicationIndex, setEditableApplicationIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedPage) {
                const advantagesRef = ref(db, `ManufacturingPage/${selectedPage}/advantages`);
                const applicationsRef = ref(db, `ManufacturingPage/${selectedPage}/applications`);

                try {
                    const advantagesSnapshot = await get(advantagesRef);
                    const applicationsSnapshot = await get(applicationsRef);

                    const advantagesData = advantagesSnapshot.val() || [];
                    const applicationsData = applicationsSnapshot.val() || [];

                    setAdvantagesData(advantagesData);
                    setApplicationsData(applicationsData);
                } catch (error) {
                    console.error('Error fetching data:', error.message);
                }
            }
        };

        fetchData();
    }, [selectedPage]);

    const handlePageChange = (event) => {
        const page = event.target.value;
        setSelectedPage(page);
    };

    const handleEditAdvantage = (index) => {
        setEditableAdvantageIndex(index);
    };

    const handleSaveAdvantage = async (index, newHeading, newContent) => {
        try {
            const updatedAdvantages = [...advantagesData];

            if (index >= 0 && index < updatedAdvantages.length && updatedAdvantages[index]) {
                updatedAdvantages[index].heading = newHeading;
                updatedAdvantages[index].content = newContent;

                const advantagesRef = ref(db, `ManufacturingPage/${selectedPage}/advantages`);

                // Filter out null values before updating the array
                const filteredAdvantages = updatedAdvantages.filter((advantage) => advantage !== null);

                // Use set to replace the entire array with the filtered array
                await set(advantagesRef, filteredAdvantages);

                setAdvantagesData(filteredAdvantages);
            } else {
                console.error(`Index ${index} is out of bounds for advantages array`);
            }
        } catch (error) {
            console.error('Error updating advantage:', error.message);
        } finally {
            setEditableAdvantageIndex(null);
        }
    };

    const handleCancelAdvantage = () => {
        setEditableAdvantageIndex(null);
    };

    return (
        <div className="container mx-auto mt-8 p-8 bg-primary text-black rounded-lg">
            <div className="mb-4">
                <label className="block text-lg mb-2">Select Manufacturing Page:</label>
                <select
                    onChange={handlePageChange}
                    value={selectedPage}
                    className="border rounded-md px-3 py-2 bg-white text-primary"
                >
                    <option value="">Select Page</option>
                    {manufacturingPages.map((page) => (
                        <option key={page} value={page}>
                            {page}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Advantages:</h2>
                <p className='font-semibold my-4 text-red-800'>*The content must be less than 40 words</p>
                <div className="w-full h-full flex flex-wrap gap-5">
                    {advantagesData && advantagesData.length > 0 && advantagesData.map((item, index) => (
                        <div key={index} className="xl:w-[48%] w-full lg:w-[40%] md:w-[40%]">
                            <AdvantageCard
                                heading={item.heading}
                                content={item.content}
                                isEditable={editableAdvantageIndex === index}
                                onSave={(newHeading, newContent) => handleSaveAdvantage(index, newHeading, newContent)}
                                onCancel={handleCancelAdvantage}
                            />
                            {!editableAdvantageIndex && (
                                <button
                                    className="bg-primary text-white px-2 py-1 rounded-md mt-2"
                                    onClick={() => handleEditAdvantage(index)}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Applications:</h2>
                <div className="w-full flex flex-row gap-3 md:overflow-auto overflow-scroll pb-10">
                    {applicationsData.map((application, index) => (
                        <ApplicationCard
                            key={index}
                            heading={application.heading}
                            content={application.content}
                            img={application.img}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManufacturingPage;
