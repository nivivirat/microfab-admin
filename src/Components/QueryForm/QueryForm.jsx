import React, { useState, useEffect } from "react";
import { ref, onValue, update } from 'firebase/database';
import { db } from "../../../firebase";
import * as XLSX from 'xlsx';

const QueryForm = () => {
    const [contactData, setContactData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataRef = ref(db, 'QueryForm');
                onValue(dataRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const dataArray = Object.entries(data)
                            .map(([id, values]) => ({ id, ...values }))
                            .sort((a, b) => {
                                const timestampA = new Date(a.timestamp);
                                const timestampB = new Date(b.timestamp);
                                return timestampB - timestampA; // Sort in order
                            });

                        setContactData(dataArray);
                    }
                });
            } catch (error) {
                console.error('Error fetching data from Firebase:', error.message);
            }
        };

        fetchData();
    }, []);

    const convertToIST = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
        });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = contactData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDeleteClick = (contactId) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                const updatedContactData = contactData.filter(contact => contact.id !== contactId);
                setContactData(updatedContactData);

                // Update the database after removing the contact
                const dataRef = ref(db, 'ContactUs');
                update(dataRef, {
                    [contactId]: null,
                });

                console.log('Contact deleted successfully');
            } catch (error) {
                console.error('Error deleting contact:', error.message);
                // Handle errors or show error messages
            }
        }
    };

    const handleDownloadClick = () => {
        try {
            const workbook = XLSX.utils.book_new();
            const sheet = XLSX.utils.json_to_sheet(
                contactData.map((contact, index) => ({
                    'S.no': index + 1,
                    'Name': contact.name,
                    'Email': contact.email,
                    'Query': contact.query,
                    'Timestamp (IST)': convertToIST(contact.timestamp),
                }))
            );

            // Add the sheet to the workbook
            XLSX.utils.book_append_sheet(workbook, sheet, 'QueryData');

            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;


            // Save the workbook to a file with the specified name
            const fileName = `MicroFab-QueryData-${formattedDate}.xlsx`;
            XLSX.writeFile(workbook, fileName);

            console.log('Data downloaded successfully');
        } catch (error) {
            console.error('Error downloading data:', error.message);
            // Handle errors or show error messages
        }
    };

    return (
        <div className="my-8 mr-7">
            <div className="flex flex-row justify-between my-5 place-items-center">
                <h2 className="text-2xl font-bold mb-4 mt-4">Contact Us Data</h2>
                <button
                    onClick={handleDownloadClick}
                    className="bg-green-500 text-white px-2 rounded mr-2 py-2"
                >
                    Download Excel
                </button>
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border border-gray-300 py-2 px-4">S.no</th>
                        <th className="border border-gray-300 py-2 px-4">Name</th>
                        <th className="border border-gray-300 py-2 px-4">Email</th>
                        <th className="border border-gray-300 py-2 px-4">Query</th>
                        <th className="border border-gray-300 py-2 px-4">Timestamp (IST)</th>
                        <th className="border border-gray-300 py-2 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((contact, index) => (
                        <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                            <td className="border border-gray-300 py-2 px-4">{indexOfFirstItem + index + 1}</td>
                            <td className="border border-gray-300 py-2 px-4">{contact.name}</td>
                            <td className="border border-gray-300 py-2 px-4">{contact.email}</td>
                            <td className="border border-gray-300 py-2 px-4">{contact.query}</td>
                            <td className="border border-gray-300 py-2 px-4">{convertToIST(contact.timestamp)}</td>
                            <td className="border border-gray-300 py-2 px-4">
                                <button
                                    onClick={() => handleDeleteClick(contact.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex items-center mb-4 mt-10">
                <span className="mr-2">Items per page:</span>
                <select
                    className="cursor-pointer px-3 py-1 bg-gray-200 rounded-md"
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                    value={itemsPerPage}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select>
            </div>

            <nav className="flex items-center mt-10">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="cursor-pointer bg-primary text-white px-3 py-1 rounded-md mr-2"
                >
                    Previous
                </button>
                <div className="px-3 py-1">
                    Page {currentPage} of {Math.ceil(contactData.length / itemsPerPage)}
                </div>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastItem >= contactData.length}
                    className="cursor-pointer px-3 py-1 bg-primary text-white rounded-md ml-2"
                >
                    Next
                </button>
            </nav>
        </div>
    );
};

export default QueryForm;
