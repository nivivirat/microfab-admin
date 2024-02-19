import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { ref, get, update, push } from 'firebase/database';
import MedicalDevicesCard from './MedicalDevicesComponents/MedicalDevicesCard';

const MedicalDevices = () => {
    const [data, setData] = useState([]);
    const [newMode, setNewMode] = useState(false);
    const [newCardUID, setNewCardUID] = useState('');
    const [newCardData, setNewCardData] = useState({
        img: '',
        heading: '',
        content: '',
        order: '' // Add order field for new cards
    });
    const [openCardIndex, setOpenCardIndex] = useState(null); // Define openCardIndex
    const [orderNewMode, setOrderNewMode] = useState(false); // Track order edit mode
    const [sortedEntries, setSortedEntries] = useState([]); // Store sorted entries
    const [editMode, setEditMode] = useState(false);
    const [editCardIndex, setEditCardIndex] = useState(null); // Track the index of the card being edited
    const [editedCardData, setEditedCardData] = useState({}); // Store edited card data

    useEffect(() => {
        fetchData();
    }, []);

    console.log(editedCardData);

    useEffect(() => {
        if (data) {
            const sortedEntries = Object.entries(data).sort((a, b) => a[1].order - b[1].order);
            setSortedEntries(sortedEntries);
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const snapshot = await get(ref(db, 'MedicalDevices'));
            const fetchedData = snapshot.val();
            setData(fetchedData || {});
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddNewCard = () => {
        const newUID = generateUID();
        setNewCardUID(newUID);
        setNewMode(true);
    };

    const handleSaveNewCard = async () => {
        setNewMode(false);

        try {
            const newCardRef = push(ref(db, 'MedicalDevices'));
            await update(newCardRef, newCardData);
            setNewCardData({
                img: '',
                heading: '',
                content: '',
                order: ''
            });
            fetchData();
        } catch (error) {
            console.error('Error saving new card:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setNewCardData({ ...newCardData, [field]: value });
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setNewCardData({ ...newCardData, img: selectedImage });
    };

    const handleOrderEditToggle = () => {
        setOrderNewMode(!orderNewMode);
    };

    const handleOrderSave = async () => {
        try {
            const updatedData = {};
            sortedEntries.forEach(([index, device], i) => {
                updatedData[index] = { ...device, order: i + 1 };
            });
            await update(ref(db, 'MedicalDevices'), updatedData);
            setOrderNewMode(false);
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    const handleCardToggle = (index) => {
        if (openCardIndex === index) {
            setOpenCardIndex(null); // Close the card if it's already open
        } else {
            setOpenCardIndex(index); // Open the clicked card
        }
    };

    const handleOrderChange = (index, newOrder) => {
        if (newOrder === "" || isNaN(newOrder)) {
            // If new order is empty or not a number, do nothing
            return;
        }

        // Create a new array with updated order value
        const updatedSortedEntries = sortedEntries.map(([key, device], i) => {
            if (i === index) {
                return [key, { ...device, order: parseInt(newOrder) }];
            }
            return [key, device];
        });

        // Update the state with the new array
        setSortedEntries(updatedSortedEntries);
    };

    const handleEditCard = (index) => {
        setEditCardIndex(index);
        setEditMode(true);
        const [_, cardData] = sortedEntries[index]; // Extract the card data from sortedEntries
        setEditedCardData(cardData);
    };

    // Function to update the edited card data in the database
    const handleSaveEditedCard = async () => {
        try {
            await update(ref(db, `MedicalDevices/${editCardIndex}`), editedCardData);
            setEditMode(false);
            setEditCardIndex(null);
            setEditedCardData({});
            fetchData(); // Refresh data after saving changes
        } catch (error) {
            console.error('Error saving edited card:', error);
        }
    };

    const generateUID = () => {
        return '-' + Math.random().toString(36).substr(2, 9);
    };

    return (
        <div className="p-8">
            <div className='flex justify-between'>
                <h1 className="text-4xl font-bold mb-6">Medical Devices</h1>
                <div>
                    {newMode && (
                        <div className="mt-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                            <form>
                                <div className='flex flex-col mb-4'>
                                    <h3 className="text-xl font-bold">Add New Card </h3>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        accept=".png, .jpg, .jpeg, .svg"
                                        onChange={handleImageChange}
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Heading
                                    </label>
                                    <input
                                        type="text"
                                        value={newCardData.heading}
                                        onChange={(e) => handleInputChange('heading', e.target.value)}
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Content
                                    </label>
                                    <textarea
                                        value={newCardData.content}
                                        onChange={(e) => handleInputChange('content', e.target.value)}
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Order
                                    </label>
                                    <input
                                        type="number"
                                        value={newCardData.order}
                                        onChange={(e) => handleInputChange('order', e.target.value)}
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSaveNewCard}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Save New Card
                                </button>
                                <button
                                    onClick={() => setNewMode(false)}
                                    className="mt-8 bg-green-500 text-white px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    )}
                    {editMode && (
                        <div className="mt-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                            <form>
                                <div className='flex flex-col mb-4'>
                                    <h3 className="text-xl font-bold">Edit Card </h3>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        accept=".png, .jpg, .jpeg, .svg"
                                        onChange={handleImageChange}
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Heading
                                    </label>
                                    <input
                                        type="text"
                                        value={editedCardData.heading}
                                        onChange={(e) => setEditedCardData({ ...editedCardData, heading: e.target.value })}
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Content
                                    </label>
                                    <textarea
                                        value={editedCardData.content}
                                        onChange={(e) => setEditedCardData({ ...editedCardData, content: e.target.value })}
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Order
                                    </label>
                                    <input
                                        type="number"
                                        value={editedCardData.order}
                                        onChange={(e) => setEditedCardData({ ...editedCardData, order: e.target.value })}
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSaveEditedCard}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Save Edited Card
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="mt-8 bg-green-500 text-white px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    )}
                    {!newMode && (
                        <div>
                            <button
                                onClick={handleAddNewCard}
                                className="mt-8 bg-green-500 text-white px-4 py-2 rounded-md"
                            >
                                Add New Card
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap gap-6">
                {sortedEntries.map(([index, device]) => (
                    <MedicalDevicesCard
                        key={index}
                        index={index}
                        isOpen={openCardIndex === index}
                        onToggle={handleCardToggle}
                        heading={device.heading}
                        content={device.content}
                        img={device.img}
                        onEdit={() => handleEditCard(index, device)} // Pass the index and device data to the card component
                    />
                ))}
            </div>

            {orderNewMode ? (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                    <div className="flex justify-between place-items-start mb-4">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold mb-2">Change Cards Order</h2>
                            <p className="text-sm text-primary">
                                (Enter new numeric orders for each card. The cards will be ordered in ascending order based on the entered numbers.)
                            </p>
                        </div>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setOrderNewMode(false)}
                        >
                            Close
                        </button>
                    </div>
                    <div className='h-[300px] overflow-y-scroll py-5'>
                        {sortedEntries.map(([index, device]) => (
                            <div key={index} className="flex items-center mb-4">
                                <span className="mr-4 text-gray-600">
                                    {device.heading}
                                </span>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        className="px-3 py-1 border border-gray-300 rounded-md"
                                        value={device.order}
                                        onChange={(e) => {
                                            const newOrder = e.target.value;
                                            handleOrderChange(index, newOrder); // Pass the index, not the cardId[0]
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="bg-primary text-white py-2 px-4 rounded-md mt-3"
                        onClick={handleOrderSave}
                    >
                        Save Changes
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleOrderEditToggle}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Edit Order
                </button>
            )}
        </div>
    );
};

export default MedicalDevices;
