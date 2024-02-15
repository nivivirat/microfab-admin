import { useState, useEffect } from "react";
import MouldSlide from "../MouldSlide";
import { onValue, ref, set } from "firebase/database";
import { db } from "../../../../../../firebase";
import { Icon } from "@iconify/react";

export default function MouldSlidePreview() {
    const [data, setData] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
    const [newItemData, setNewItemData] = useState({
        line1: "",
        line2: "",
        order: 0, // Initialize order value for new items
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataRef = ref(db, 'Home/MouldSlide');
                onValue(dataRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const dataObject = snapshot.val();
                        const dataArray = Object.values(dataObject);
                        // Sort the array based on the 'order' value in ascending order
                        const sortedData = dataArray.sort((a, b) => a.order - b.order);
                        setData(sortedData);
                    }
                });
            } catch (error) {
                console.error('Error fetching data from Firebase:', error.message);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditedData(data[index]);
    };

    const handleSaveChanges = () => {
        if (editIndex !== null) {
            const newData = [...data];
            newData[editIndex] = editedData;

            set(ref(db, 'Home/MouldSlide'), newData)
                .then(() => {
                    console.log('Data updated successfully!');
                    setEditIndex(null);
                })
                .catch((error) => {
                    console.error('Error updating data:', error.message);
                });
        }
    };

    const handleAddNewItem = () => {
        setIsNewItemModalOpen(true);
    };

    const handleSaveNewItem = () => {
        // Increment the order value for new items
        newItemData.order = data.length > 0 ? data[data.length - 1].order + 1 : 0;
        set(ref(db, 'Home/MouldSlide'), [...data, newItemData])
            .then(() => {
                console.log('New item added successfully!');
                setNewItemData({
                    line1: "",
                    line2: "",
                    order: 0,
                });
                setIsNewItemModalOpen(false);
            })
            .catch((error) => {
                console.error('Error adding new item:', error.message);
            });
    };

    return (
        <div className="h-[60vh] px-10 border border-primary rounded-lg p-10 flex-row">
            <div className="h-full">
                <span className="font-extrabold text-3xl hover:text-primary">Mould Card Scroll</span>
                <div className="md:w-full md:h-full w-full h-[1350px] flex md:flex-row flex-col">
                    {/* right */}
                    <div className="md:w-3/12 w-full md:mt-[10px] md:h-full">
                        <div className="w-full md:h-[40%] h-[200px] md:m-0 m-4 mt-0 flex flex-row gap-3">
                            <div className="w-[50%] h-[200%] md:mr-0 mr-3">
                                <MouldSlide data={data} />
                            </div>
                        </div>
                    </div>
                    {/* <div> */}
                    <div className="flex flex-wrap gap-x-12">

                        {/* Display the data */}
                        {data.map((item, index) => (
                            <div key={item.order} className={`relative leading-5 h-[65px] w-[110px] px-5 rounded-[20px] flex flex-col justify-center place-items-center font-bold ${index % 2 === 0 ? 'bg-[#e9e9e9]' : 'bg-primary'}`}>
                                <div className={`h-[20px] w-[60px] place-items-center justify-center flex text-center ${index % 2 === 0 ? 'text-primary' : 'text-white'}`} >
                                    <Icon icon={item.img} className='' />
                                </div>
                                <p className="text-[14px] font-['ClashDisplay']">{item.line1}</p>
                                <p className="text-[14px] font-['ClashDisplay']">{item.line2}</p>
                                <p onClick={() => handleEdit(index)} className="cursor-pointer text-[20px] absolute -right-6 top-3"><Icon icon="typcn:edit" /></p>
                            </div>
                        ))}

                        {/* Button to add a new item */}
                        <button onClick={handleAddNewItem} className="bg-primary h-[65px] w-[110px] text-white p-2 rounded-[20px] hover:bg-opacity-80">
                            Add New Item
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for editing */}
            {editIndex !== null && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded relative">
                        <button
                            onClick={() => {
                                setEditIndex(null);
                                setEditedData({});
                            }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                        >
                            X
                        </button>
                        <label htmlFor="editedLine1">Line 1:</label>
                        <input
                            type="text"
                            id="editedLine1"
                            value={editedData.line1}
                            onChange={(e) => setEditedData({ ...editedData, line1: e.target.value })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="editedLine2">Line 2:</label>
                        <input
                            type="text"
                            id="editedLine2"
                            value={editedData.line2}
                            onChange={(e) => setEditedData({ ...editedData, line2: e.target.value })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="editedOrder">Order:</label>
                        <input
                            type="number"
                            id="editedOrder"
                            value={editedData.order}
                            onChange={(e) => setEditedData({ ...editedData, order: parseInt(e.target.value, 10) })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <button
                            onClick={handleSaveChanges}
                            className="bg-primary text-white p-2 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:border-primary"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for adding a new item */}
            {isNewItemModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded relative">
                        <button
                            onClick={() => {
                                setNewItemData({
                                    line1: "",
                                    line2: "",
                                    order: 0,
                                });
                                setIsNewItemModalOpen(false);
                            }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                        >
                            X
                        </button>
                        <label htmlFor="newItemLine1">Line 1:</label>
                        <input
                            type="text"
                            id="newItemLine1"
                            value={newItemData.line1}
                            onChange={(e) => setNewItemData({ ...newItemData, line1: e.target.value })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="newItemLine2">Line 2:</label>
                        <input
                            type="text"
                            id="newItemLine2"
                            value={newItemData.line2}
                            onChange={(e) => setNewItemData({ ...newItemData, line2: e.target.value })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="newItemOrder">Order:</label>
                        <input
                            type="number"
                            id="newItemOrder"
                            value={newItemData.order}
                            onChange={(e) => setNewItemData({ ...newItemData, order: parseInt(e.target.value, 10) })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <button
                            onClick={handleSaveNewItem}
                            className="bg-primary text-white p-2 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:border-primary"
                        >
                            Save New Item
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
