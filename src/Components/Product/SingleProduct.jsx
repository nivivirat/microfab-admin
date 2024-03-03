import { useParams } from 'react-router-dom';
import { db } from '../../../firebase';
import { ref, get, push, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import EditForm from './ProductComponents/EditForm'
import EditFormArray from './ProductComponents/EditFormArray'

export default function SingleProduct() {

    const [data, setData] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const { id } = useParams();

    const initialData = {
        advantages: [
            { heading: "", content: "" },
            { heading: "", content: "" },
            { heading: "", content: "" },
            { heading: "", content: "" },
            // Add more empty entries as needed
        ],
        applications: [
            { heading: "", content: "", img: "" },
            { heading: "", content: "", img: "" },
            { heading: "", content: "", img: "" },
            { heading: "", content: "", img: "" },
            // Add more empty entries as needed
        ],
        bannerImg: "",
        introduction: {
            content: "",
            intro: "Introducing the Technology",
        },
        process: [
            { heading: "", content: "" },
            { heading: "", content: "" },
            { heading: "", content: "" },
        ],
        top: {
            topl: "",
            topr: "",
        },
    };

    const createNewChild = () => {
        // Generate a new unique key using push
        const newChildRef = push(ref(db, 'ProductContent'));
        const newChildKey = newChildRef.key;

        // Log the newly generated key
        console.log("New Child Key:", newChildKey);

        // Set the initial data for the new child
        set(ref(db, `ProductContent/${newChildKey}`), initialData);
    };

    useEffect(() => {
        const productRef = ref(db, `ProductContent/${id}`);

        get(productRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setData(snapshot.val());
                } else {
                    console.error(`Product with ID ${id} not found. Creating a new one.`);

                    set(ref(db, `ProductContent/${id}`), initialData);
                    setData(initialData);
                }
            })
            .catch((error) => {
                console.error("Error fetching product:", error);
            });
    }, [id]);

    console.log(data);

    const handleEdit = (section, index) => {
        setEditingIndex({ section, index });
    };

    const handleUpdate = (section, index, updatedContent, updatedHeading) => {
        // Create a shallow copy of the data
        const newData = { ...data };

        // Ensure that the nested structures are initialized
        newData[section] = newData[section] || [];

        if (Array.isArray(newData[section])) {
            // For arrays (advantages, applications, process)
            newData[section][index] = newData[section][index] || {};
            newData[section][index].heading = updatedHeading !== undefined ? updatedHeading : newData[section][index].heading;
            newData[section][index].content = updatedContent !== undefined ? updatedContent : newData[section][index].content;
        }

        else if (typeof newData[section] === 'object') {

            if (section === "introduction") {
                if (index === 0) {
                    newData[section].intro = updatedContent !== undefined ? updatedContent : newData[section].intro;
                } else if (index === 1) {
                    newData[section].content = updatedContent !== undefined ? updatedContent : newData[section].content;
                }
            }
            else {
                if (index === 0) {
                    newData[section].topl = updatedContent !== undefined ? updatedContent : newData[section].topl;
                } else if (index === 1) {
                    newData[section].topr = updatedContent !== undefined ? updatedContent : newData[section].topr;
                }
            }

        }

        // Update the data state
        setData(newData);
        setEditingIndex(null);

        // Update the data in the database
        const databaseRef = ref(db, `ProductContent/${id}`);

        // Use set to update the entire data in the database
        set(databaseRef, newData)
            .then(() => console.log("Data successfully saved to the database"))
            .catch((error) => console.error("Error saving data to the database:", error));
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
    };

    const handleAddProcess = () => {
        // Create a shallow copy of the data
        const newData = { ...data };

        // Ensure that the nested structure is initialized
        newData.process = newData.process || [];

        // Add a new empty process entry
        newData.process.push({ heading: "", content: "" });

        // Update the data state
        setData(newData);
    };

    return (
        <div className="container mx-auto p-4 mb-10">

            {data ? (
                <div className="mt-4">

                    <h4 className="mt-8 mb-4 text-2xl font-semibold text-primary border-b-2 border-primary pb-2">
                        Top
                    </h4>

                    {editingIndex && editingIndex.section === 'top' ? (
                        <>
                            <EditForm
                                section="top"
                                index={0}
                                content={data.top.topl}
                                heading={"Top Left Content"}
                                onSave={handleUpdate}
                                onCancel={handleCancelEdit}
                            />
                            <EditForm
                                section="top"
                                index={1}
                                content={data.top.topr}
                                heading={"Top Right Content"}
                                onSave={handleUpdate}
                                onCancel={handleCancelEdit}
                            />
                        </>
                    ) : (
                        <>
                            <div className="mb-2"><strong className="text-black">Top Left:</strong> {data.top.topl}</div>
                            <div className="mb-4"><strong className="text-black">Top Right:</strong> {data.top.topr}</div>
                            <div className="flex">
                                <button
                                    className="bg-primary  text-white font-bold py-1 px-2 rounded mr-2"
                                    onClick={() => handleEdit('top', 0)}
                                >
                                    Edit Top
                                </button>
                            </div>
                        </>
                    )}

                    <h4 className="mt-12 mb-4 text-2xl font-semibold text-primary border-b-2 border-primary pb-2">
                        Introduction
                    </h4>
                    {editingIndex && editingIndex.section === 'introduction' ? (
                        <EditForm
                            section="introduction"
                            index={0} // Assuming there is only one introduction
                            content={data.introduction.intro}
                            heading={"Introduction data heading"}
                            onSave={handleUpdate}
                            onCancel={handleCancelEdit}
                        />
                    ) : (
                        <div className="flex items-center mb-2">
                            <p className="mr-2"><strong>Intro:</strong> {data.introduction.intro}</p>
                            <button
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-1 px-2 rounded"
                                onClick={() => handleEdit('introduction', 0)}
                            >
                                Edit
                            </button>
                        </div>
                    )}
                    {editingIndex && editingIndex.section === 'introduction' ? (
                        <EditForm
                            section="introduction"
                            index={1} // Assuming there is only one introduction
                            content={data.introduction.content}
                            heading={"Introduction data"}
                            onSave={handleUpdate}
                            onCancel={handleCancelEdit}
                        />
                    ) : (
                        <div className="flex items-center mb-4">
                            <p className="mr-2"><strong>Content:</strong> {data.introduction.content}</p>
                            <button
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-1 px-2 rounded"
                                onClick={() => handleEdit('introduction', 1)}
                            >
                                Edit
                            </button>
                        </div>
                    )}

                    <div>
                        <h4 className="mt-12 mb-4 text-2xl font-semibold text-primary border-b-2 border-primary pb-2">
                            Process
                        </h4>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th className="py-2 px-4">Heading</th>
                                    <th className="py-2 px-4">Content</th>
                                    <th className="py-2 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.process.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-2 px-4">{item.heading}</td>
                                        <td className="py-2 px-4">{item.content}</td>
                                        <td className="py-2 px-4">
                                            {editingIndex && editingIndex.section === 'process' && editingIndex.index === index ? (
                                                <EditFormArray
                                                    section="process"
                                                    index={index}
                                                    heading={item.heading}
                                                    content={item.content}
                                                    onSave={handleUpdate}
                                                    onCancel={handleCancelEdit}
                                                />

                                            ) : (
                                                <button
                                                    className="bg-primary  text-white font-bold py-1 px-2 ml-2 rounded"
                                                    onClick={() => handleEdit('process', index)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Button to add a new process entry */}
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                            onClick={handleAddProcess}
                        >
                            Add New Process
                        </button>
                    </div>


                    <div>
                        <h4 className="mt-12 mb-4 text-2xl font-semibold text-primary border-b-2 border-primary pb-2">
                            Advantages
                        </h4>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th className="py-2 px-4">#</th>
                                    <th className="py-2 px-4">Heading</th>
                                    <th className="py-2 px-4">Content</th>
                                    <th className="py-2 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.advantages.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-2 px-4">{index + 1}</td>
                                        <td className="py-2 px-4">{item.heading}</td>
                                        <td className="py-2 px-4">{item.content}</td>
                                        <td className="py-2 px-4">
                                            {editingIndex && editingIndex.section === 'advantages' && editingIndex.index === index ? (
                                                <EditFormArray
                                                    heading={item.heading}
                                                    section="advantages"
                                                    index={index}
                                                    content={item.content}
                                                    onSave={handleUpdate}
                                                    onCancel={handleCancelEdit}
                                                ></EditFormArray>
                                            ) :
                                                <button
                                                    className="bg-primary hover:bg-primary-dark text-white font-bold py-1 px-2 rounded"
                                                    onClick={() => handleEdit('advantages', index)}
                                                >
                                                    Edit
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <div>
                            <h4 className="mt-12 mb-4 text-2xl font-semibold text-primary border-b-2 border-primary pb-2">
                                Applications
                            </h4>
                            <table className="w-full border-collapse mt-4">
                                <thead>
                                    <tr className="bg-primary text-white">
                                        <th className="py-2 px-4">#</th>
                                        <th className="py-2 px-4">Heading</th>
                                        <th className="py-2 px-4">Content</th>
                                        <th className="py-2 px-4">Image</th>
                                        <th className="py-2 px-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.applications.map((item, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="py-2 px-4">{index + 1}</td>
                                            <td className="py-2 px-4">{item.heading}</td>
                                            <td className="py-2 px-4">{item.content}</td>
                                            <td className="py-2 px-4">{item.img && <img src={item.img} alt={item.heading} className="max-h-12" />}</td>
                                            <td className="py-2 px-4">
                                                {editingIndex && editingIndex.section === 'applications' && editingIndex.index === index ? (
                                                    <EditFormArray
                                                        section="applications"
                                                        index={index}
                                                        heading={item.heading}
                                                        content={item.content}
                                                        onSave={handleUpdate}
                                                        onCancel={handleCancelEdit}
                                                    />
                                                ) : (
                                                    <button
                                                        className="bg-primary hover:bg-primary-dark text-white font-bold py-1 px-2 rounded"
                                                        onClick={() => handleEdit('applications', index)}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            ) : (
                <div></div>
            )
            }
        </div >
    );


}
