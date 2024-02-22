import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    getDatabase,
    ref,
    onValue,
    push,
    remove,
    set as setDatabaseData,
} from "firebase/database";

import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";

const storageInstance = getStorage();
const industriesRef = ref(getDatabase(), "AboutUs/Industries");

const Industries = () => {
    const [categories, setCategories] = useState([]);
    const [fileInput, setFileInput] = useState(null);
    const [titleInput, setTitleInput] = useState("");
    const [linkInput, setLinkInput] = useState("");
    const [orderInput, setOrderInput] = useState(0);
    const [isAddingNewCard, setIsAddingNewCard] = useState(false);
    const [editingCard, setEditingCard] = useState(null);

    useEffect(() => {
        const unsubscribe = onValue(industriesRef, (snapshot) => {
            const categoriesData = snapshot.val();
            if (categoriesData) {
                const categoriesArray = Object.entries(categoriesData).map(
                    ([id, data]) => ({
                        id,
                        ...data,
                    })
                );
                setCategories(categoriesArray);
            }
        });

        return () => unsubscribe();
    }, []);

    const clearInputFields = () => {
        setFileInput(null);
        setTitleInput("");
        setLinkInput("");
        setOrderInput(0);
        setIsAddingNewCard(false);
        setEditingCard(null);
    };

    const handleFileChange = (e) => {
        if (!editingCard) {
            setFileInput(e.target.files[0]);
        }
    };

    const handleFileUpload = async (file, categoryId) => {
        let imageUrl = '';

        if (file) {
            const fileRef = storageRef(storageInstance, `AboutUs/Industries/${categoryId}/image`);
            await uploadBytes(fileRef, file);
            imageUrl = await getDownloadURL(fileRef);
        } else if (editingCard && editingCard.image) {
            imageUrl = editingCard.image;
        } else {
            console.error("No file selected");
            return;
        }

        if (categoryId) {
            await setDatabaseData(ref(getDatabase(), `AboutUs/Industries/${categoryId}`), {
                title: titleInput || "New Category",
                image: imageUrl,
                link: linkInput || "/new-category",
                order: orderInput || 0,
            });
        } else {
            push(industriesRef, {
                title: titleInput || "New Category",
                image: imageUrl,
                link: linkInput || "/new-category",
                order: orderInput || 0,
            });
        }

        clearInputFields();
    };

    const handleAddNewCard = () => {
        if (fileInput) {
            if (editingCard) {
                handleFileUpload(fileInput, editingCard.id);
            } else {
                handleFileUpload(fileInput);
            }
        } else {
            if (editingCard) {
                handleFileUpload(editingCard.image, editingCard.id);
            } else {
                console.error("No file selected");
            }
        }
    };

    const handleDeleteCard = async (categoryId) => {
        try {
            const isConfirmed = window.confirm("Are you sure you want to delete this card?");

            if (isConfirmed) {
                await remove(ref(getDatabase(), `AboutUs/Industries/${categoryId}`));
                console.log(`Deleting content for ${categoryId}`);
                clearInputFields();
            } else {
                console.log("Deletion canceled.");
            }
        } catch (error) {
            console.error('Error deleting data:', error.message);
        }
    };

    const handleEditCard = (categoryId) => {
        const editingCategory = categories.find((category) => category.id === categoryId);
        setEditingCard(editingCategory);
        setIsAddingNewCard(true);

        setTitleInput(editingCategory.title);
        setLinkInput(editingCategory.link);
        setOrderInput(editingCategory.order);
    };

    return (
        <div className="relative px-10 border border-primary rounded-lg p-10 flex-row">
            <div className="absolute top-0 right-5">
                <button
                    type="button"
                    onClick={() => setIsAddingNewCard(true)}
                    className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md"
                >
                    Add New Card
                </button>
            </div>
            <center>
                <div className="flex flex-col rounded-lg bg-white md:max-w-6xl md:flex-row animate__animated animate__fadeInRight animate__delay-1s">
                    <div className="flex flex-col p-6">
                        <p className="mb-4 text-5xl ddd leading-tight font-['ClashDisplay']  mr-4">
                            <strong>Industries that we serve</strong>
                        </p>
                        <center>
                            <p className="mb-1 text-2xs ddd text-[#8AA6AA] leading-tight mr-4 pp font-['ClashDisplay']">
                                At MicroFab, we have been serving the Pharmaceutical, Cosmetic, Food, and the Chemical industry across the years. Our adept and motivated team of professionals, along with the state-of-the-art engineering facilities, undertake designing, manufacturing, and delivering machinery to meet the requirements of our esteemed clients.
                            </p>
                        </center>
                    </div>
                </div>
            </center>

            <br />

            <div className="lg:flex z-2 flex-rows md:flex flex-cols overflow-x-scroll sm:flex flex-cols sm:-mt-6 animate__animated animate__fadeInRight animate__delay-1s">
                {categories.map((category) => (
                    <div key={category.id} className="relative p-2 m-auto mb-10">
                        <div className="md:w-[230px] w-full flex flex-col shadow-lg rounded-[20px]">
                            <div className="flex flex-col items-center md:h-[190px] w-full">
                                <button
                                    type="button"
                                    onClick={() => handleEditCard(category.id)}
                                    className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteCard(category.id)}
                                    className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
                                >
                                    Delete
                                </button>
                                <Link to={category.link}>
                                    <img
                                        className="w-48 h-40 p-2 object-cover"
                                        src={category.image}
                                        alt=""
                                    />
                                    <p className="text-center text-[#8AA6AA]">{category.title}</p>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingCard(category);
                                        setIsAddingNewCard(true);
                                    }}
                                    className="bg-blue-500 text-white px-2 py-1 mt-2 rounded-md hover:bg-blue-600"
                                >
                                    Change Image
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isAddingNewCard && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                    <form className="relative space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border p-2 w-full"
                        />

                        <input
                            type="text"
                            placeholder="Title"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            className="border p-2 w-full"
                        />

                        <input
                            type="text"
                            placeholder="Link"
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            className="border p-2 w-full"
                        />

                        <input
                            type="number"
                            placeholder="Order"
                            value={orderInput}
                            onChange={(e) => setOrderInput(e.target.value)}
                            className="border p-2 w-full"
                        />

                        <button
                            type="button"
                            onClick={handleAddNewCard}
                            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600"
                        >
                            {editingCard ? 'Save Changes' : 'Add New Card'}
                        </button>
                    </form>
                </div>
            )}

            {editingCard && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                    <form className="relative space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border p-2 w-full"
                        />

                        <input
                            type="text"
                            placeholder="Title"
                            value={titleInput || editingCard.title}
                            onChange={(e) => setTitleInput(e.target.value)}
                            className="border p-2 w-full"
                        />

                        <input
                            type="text"
                            placeholder="Link"
                            value={linkInput || editingCard.link}
                            onChange={(e) => setLinkInput(e.target.value)}
                            className="border p-2 w-full"
                        />

                        <input
                            type="number"
                            placeholder="Order"
                            value={orderInput || editingCard.order}
                            onChange={(e) => setOrderInput(e.target.value)}
                            className="border p-2 w-full"
                        />

                        <button
                            type="button"
                            onClick={() => handleAddNewCard(editingCard.id)}
                            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Industries;
