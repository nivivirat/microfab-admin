import React, { useState, useEffect } from 'react';
import GraphPreview from "./GraphComponents/GraphPreview";
import { db } from '../../../../../firebase'
import { ref, get, update, set } from 'firebase/database';

export default function Graph() {
  const [yearsData, setYearsData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newYear, setNewYear] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const snapshot = await get(ref(db, 'Home/SoldGraph'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const yearsDataArray = Object.keys(data).map(year => ({
          year: parseInt(year),
          value: parseInt(data[year].value),
        }));
        setYearsData(yearsDataArray);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
    }
  };

  const handleSaveEdit = async () => {
    const parsedYear = parseInt(newYear);
    if (isNaN(parsedYear)) {
      console.error('Invalid year. Please enter a valid number.');
      return;
    }

    const updatedData = yearsData.map((entry, index) => {
      if (index === editIndex) {
        return { year: parsedYear, value: parseInt(newValue) };
      }
      return entry;
    });

    try {
      const updates = {};
      updatedData.forEach(entry => {
        updates[entry.year] = { value: entry.value };
      });
      await update(ref(db, 'Home/SoldGraph'), updates);

      setYearsData(updatedData);
      setEditIndex(null);
      setIsEdit(false);
      setNewYear('');
      setNewValue('');
    } catch (error) {
      console.error('Error updating data in Firebase:', error);
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setIsEdit(true);

    // Set the current values to the state
    setNewYear(yearsData[index].year.toString());
    setNewValue(yearsData[index].value.toString());
  };

  const MIN_YEARS = 3;
  const MAX_YEARS = 7;

  // ... (other functions)

  const handleDeleteClick = async (yearToDelete) => {
    if (yearsData.length > MIN_YEARS) {
      if (window.confirm(`Are you sure you want to delete data for the year ${yearToDelete}?`)) {
        try {
          const updatedData = yearsData.filter((entry) => entry.year !== yearToDelete);

          // Create a new object with updated data
          const newData = {};
          updatedData.forEach((entry) => {
            newData[entry.year] = { value: entry.value };
          });

          // Set the new data in Firebase
          await set(ref(db, 'Home/SoldGraph'), newData);

          // If the year being deleted is the one being edited, clear the edit state
          if (editIndex !== null && yearsData[editIndex].year === yearToDelete) {
            setEditIndex(null);
            setIsEdit(false);
            setNewYear('');
            setNewValue('');
          }

          setYearsData(updatedData);
        } catch (error) {
          console.error('Error deleting data from Firebase:', error);
        }
      }
    } else {
      alert('Minimum of 3 years must be maintained.');
    }
  };

  const handleAddClick = () => {
    if (yearsData.length < MAX_YEARS) {
      // Add a new empty row for editing
      setYearsData([...yearsData, { year: '', value: '' }]);
      setEditIndex(yearsData.length); // Set the index of the newly added row for editing
      setIsEdit(true);
    } else {
      alert('Maximum of 7 years allowed.');
    }
  };

  return (
    <div className="h-[90vh] px-10 border border-primary rounded-lg p-10 flex flex-row relative">
      <div>
        <span className="font-extrabold text-3xl hover:text-primary">Sold Graph</span>
        <div className="w-[280px] h-[300px] mt-10">
          <GraphPreview />
        </div>
      </div>
      <div className='pl-10'>
        {/* Display years and values in a table */}
        <p className='font-semibold'>Maximum 7 bars for the graph with values for optimal look</p>
        <table className="table-auto border border-black w-full mb-4">
          <thead>
            <tr>
              <th className="border p-2 w-[150px]">Year</th>
              <th className="border p-2 w-[200px]">Value</th>
              <th className="border p-2 w-[400px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {yearsData.map((year, index) => (
              <tr key={index} className="mb-4">
                <td className="border p-2">
                  {editIndex === index && isEdit ? (
                    <input
                      type="text"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      placeholder="Edit Year"
                      className="p-2 border rounded-md w-full"
                    />
                  ) : (
                    year.year
                  )}
                </td>
                <td className="border p-2">
                  {editIndex === index && isEdit ? (
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Edit Value"
                      className="p-2 border rounded-md w-full"
                    />
                  ) : (
                    year.value
                  )}
                </td>
                <td className="border p-2">
                  {editIndex === index && isEdit ? (
                    <div className='flex'>
                      <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Save</button>
                      <button onClick={() => setEditIndex(null)} className="bg-gray-300 text-white px-4 py-2 rounded-md">Cancel</button>
                    </div>
                  ) : (
                    <div className='flex'>
                      <button onClick={() => handleEditClick(index)} className="bg-gray-300 p-2 rounded-md mr-2">Edit</button>
                      <button onClick={() => handleDeleteClick(year.year)} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddClick} className="bg-green-500 text-white px-4 py-2 rounded-md">Add New Data</button>
      </div>
    </div>
  );
}
