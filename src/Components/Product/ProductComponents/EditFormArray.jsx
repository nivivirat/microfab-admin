import { useState } from "react";
import { storageFunctions } from '../firebase';

const EditFormArray = ({ section, index, heading, content, onSave, onCancel }) => {
    const [editedContent, setEditedContent] = useState(content);
    const [editedHeading, setEditedHeading] = useState(heading);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const handleSave = () => {

        if (section === "applications") {
            console.log("indesssss");
            onSave(section, index, editedContent, editedHeading, imageFile);
        }
        else {
            console.log("puuut");
            onSave(section, index, editedContent, editedHeading);
        }
    };


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        // Check if a file is selected
        if (!file) {
            return;
        }

        // Show loading screen
        setLoading(true);

        try {
            const storageRef = storageFunctions.ref(`images/${file.name}`);
            await storageFunctions.uploadBytes(storageRef, file);
            const imgURL = await storageFunctions.getDownloadURL(storageRef);

            console.log(imgURL);

            setImageFile(imgURL);

            console.log("Data successfully saved to the database");

            alert("img uploaded")
            // alert("Success");
        } catch (error) {
            console.error("Error saving data to the database:", error);
            alert("Error uploading image");
        } finally {
            // Hide loading screen
            setLoading(false);
        }
    };

    if (loading) {
        return (<div>
            Loading
        </div>)
    }

    return (
        <div className="fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto">
            <div className="bg-white p-6 rounded-md shadow-md w-[700px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Heading:</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:border-blue-500"
                    value={editedHeading}
                    onChange={(e) => setEditedHeading(e.target.value)}
                />

                <label className="block text-sm font-semibold text-gray-700 mb-2">Content:</label>
                <textarea
                    className="w-full p-2 border rounded-md mb-4 focus:outline-none h-[200px] focus:border-blue-500"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />

                {section === "applications" && (
                    <>
                        <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                            Image
                        </label>

                        <div className="flex flex-row">
                            <div className="mr-10">
                                <h6>Please provide the same dimension for all images in this section, preferably (500 * 500)</h6>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditFormArray;
