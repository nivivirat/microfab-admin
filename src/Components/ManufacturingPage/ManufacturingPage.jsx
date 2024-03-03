// ManufacturingPage.jsx
import { get, ref, set, onValue, off } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import AdvantageCard from '../Product/ProductComponents/AdvantageCard';
import ApplicationCard from '../Product/ProductComponents/ApplicationCard';

const ManufacturingPage = () => {
    const manufacturingPages = ['BFS', 'FFS', 'ISBM', 'IV'];

    const [selectedPage, setSelectedPage] = useState('');
    const [advantagesData, setAdvantagesData] = useState([]);
    const [applicationsData, setApplicationsData] = useState([]);
    const [editableAdvantageIndex, setEditableAdvantageIndex] = useState(null);
    const [editableApplicationIndex, setEditableApplicationIndex] = useState(null);

    useEffect(() => {
        const fetchData = () => {
            if (selectedPage) {
                // Advantages data
                const advantagesRef = ref(db, `ManufacturingPage/${selectedPage}/advantages`);
                const advantagesListener = onValue(advantagesRef, (snapshot) => {
                    const advantagesData = snapshot.val() || [];
                    setAdvantagesData(advantagesData);
                });
    
                // Applications data
                const applicationsRef = ref(db, `ManufacturingPage/${selectedPage}/applications`);
                const applicationsListener = onValue(applicationsRef, (snapshot) => {
                    const applicationsData = snapshot.val() || [];
                    setApplicationsData(applicationsData);
                });
    
                // Cleanup previous listeners
                return () => {
                    off(advantagesRef, 'value', advantagesListener);
                    off(applicationsRef, 'value', applicationsListener);
                };
            }
        };
    
        // Clear state when the page changes
        setAdvantagesData([]);
        setApplicationsData([]);
    
        fetchData();
    }, [selectedPage]);    

    const handlePageChange = (event) => {
        const page = event.target.value;
        setSelectedPage(page);
        setAdvantagesData([]);
        setApplicationsData([]);
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
                await set(advantagesRef, updatedAdvantages);
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

    const handleEditApplication = (index) => {
        setEditableApplicationIndex(index);
    };

    const handleSaveApplication = async (index, newHeading, newContent, newImage) => {
        try {
            const updatedApplications = [...applicationsData];

            if (index >= 0 && index < updatedApplications.length && updatedApplications[index]) {
                updatedApplications[index].heading = newHeading;
                updatedApplications[index].content = newContent;
                updatedApplications[index].img = newImage;

                const applicationsRef = ref(db, `ManufacturingPage/${selectedPage}/applications`);
                await set(applicationsRef, updatedApplications);
            } else {
                console.error(`Index ${index} is out of bounds for applications array`);
            }
        } catch (error) {
            console.error('Error updating application:', error.message);
        } finally {
            setEditableApplicationIndex(null);
        }
    };

    const handleCancelApplication = () => {
        setEditableApplicationIndex(null);
    };

    return (
        <div className="container mt-8 p-8  text-black rounded-lg">
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
                <div className="w-full h-full flex flex-wrap gap-5 bg-primary p-10">
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
                <p className='font-semibold my-4 text-red-800'>*The content must be less than 40 words</p>
                <p className='font-semibold my-4 text-red-800'>*The images must be in 1:1 ratio (background white color)</p>

                <div className="w-full flex flex-row gap-3 md:overflow-auto overflow-scroll pb-10">
                    {applicationsData && applicationsData.length > 0 && applicationsData.map((application, index) => (
                        <div key={index} className="xl:w-[48%] w-full lg:w-[40%] md:w-[40%]">
                            <ApplicationCard
                                heading={application.heading}
                                content={application.content}
                                img={application.img}
                                isEditable={editableApplicationIndex === index}
                                onSave={(newHeading, newContent, newImage) => handleSaveApplication(index, newHeading, newContent, newImage)}
                                onCancel={handleCancelApplication}
                            />
                            {!editableApplicationIndex && (
                                <button
                                    className="bg-primary text-white px-2 py-1 rounded-md mt-2"
                                    onClick={() => handleEditApplication(index)}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManufacturingPage;
