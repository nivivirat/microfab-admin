import React, { useState, useEffect, lazy } from 'react';
import { database, storageFunctions, ref, getDatabase, } from './firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [ProductData, setProductData] = useState([]);
  const [ProductData1, setProductData1] = useState([]);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    img: '',
    heading: '',
    description: '',
    routerlink: '',
    date: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingUid, setEditingUid] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [ProductCardData, setProductCardData] = useState([]);
  const [formData1, setFormData1] = useState({
    img: '',
    title: '',
  });
  const [imageFile1, setImageFile1] = useState(null);
  const [editingUid1, setEditingUid1] = useState(null);
  const [showAddForm1, setShowAddForm1] = useState(false);
  const [showEditForm1, setShowEditForm1] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ProductSnapshot = await database.get('Product');
        const ProductData = ProductSnapshot.val();

        if (ProductData) {
          const dataArray = Object.entries(ProductData).map(([uid, data]) => ({ uid, ...data }));
          setProductData(dataArray);
        }
      } catch (error) {
        console.error('Error fetching Product data from Firebase:', error);
      }
    };

    const fetchProductCardData = async () => {
      try {
        const ProductCardSnapshot = await database.get('Productcard');
        const ProductCardData = ProductCardSnapshot.val();

        if (ProductCardData) {
          const dataArray = Object.entries(ProductCardData).map(([uid, data]) => ({ uid, ...data }));
          setProductCardData(dataArray);
        }
      } catch (error) {
        console.error('Error fetching Product card data from Firebase:', error);
      }
    };

    fetchData();
    fetchProductCardData();
  }, []);

  const handleAddNew = () => {
    setFormData({ img: '', heading: '', description: '', routerlink: '', date: '' });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleEdit = (uid) => {
    const selectedProduct = ProductData.find((Product) => Product.uid === uid);
    setFormData(selectedProduct);
    setEditingUid(uid);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingUid(null);
    setFormData({
      img: '',
      heading: '',
      description: '',
      routerlink: '',
      date: '',
    });
    setImageFile(null);
    setShowAddForm(false);
    setShowEditForm(false);
  };



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if heading is empty or contains only whitespace
      if (!formData.heading.trim()) {
        alert('Please enter a heading.'); // You can replace this with a more user-friendly UI feedback
        return;
      }

      let imgURL = formData.img;

      if (imageFile) {
        const storageRef = storageFunctions.ref(`images/${imageFile.name}`);
        await storageFunctions.uploadBytes(storageRef, imageFile);
        imgURL = await storageFunctions.getDownloadURL(storageRef);
      }

      const timestamp  = Date.now(); // Get the server timestamp

      if (editingUid) {
        await database.set(`Product/${editingUid}`, {
          bannerimg: imgURL,
          routerName: formData.heading,
          timestamp: timestamp, // Include the timestamp
        });
      } else {
        await database.push('Product', {
          bannerimg: imgURL,
          routerName: formData.heading,
          timestamp: timestamp, // Include the timestamp
        });
      }

      alert('Product updated successfully! Please Refresh the page');
      setFormData({
        bannerimg: '',
        routerName: '',
        timestamp: '',
      });
      setImageFile(null);
      setEditingUid(null);
      setShowAddForm(false);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating Product:', error);
    }
  };

  const handleCancelEdit1 = () => {
    setEditingUid1(null);
    setFormData1({
      img: '',
      title: '',
    });
    setImageFile1(null);
    setShowAddForm1(false);
    setShowEditForm1(false);
  };

  const handleDelete = async (uid) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Product?');
    if (!confirmDelete) {
      return;
    }

    try {
      await database.remove(`Product/${uid}`);
      alert('Product deleted successfully! Please Refresh the page');
      setProductData((prevData) => prevData.filter((Product) => Product.uid !== uid));
    } catch (error) {
      console.error('Error deleting Product:', error);
    }
  };
  const generateRoute = (Product) => {
    if (Product && Product.uid) {
      const sanitizedHeading = Product.routerName.replace(/\s+/g, '-');
      return `/Product/${Product.uid}/${sanitizedHeading}`;
    } else {
      // Handle the case where uid is undefined
      console.error('Invalid Product object:', Product);
      return '/error'; // or any other fallback route
    }
  };

  const handleImageChange1 = (e) => {
    const file = e.target.files[0];
    setImageFile1(file);
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit1 = async (e) => {
    e.preventDefault();

    try {
      let imgURL1 = formData1.img;

      if (imageFile1) {
        const storageRef1 = storageFunctions.ref(`images/${imageFile1.name}`);
        await storageFunctions.uploadBytes(storageRef1, imageFile1);
        imgURL1 = await storageFunctions.getDownloadURL(storageRef1);
      }

      if (editingUid1) {
        await database.set(`Productcard/${editingUid1}`, {
          img: imgURL1,
          title: formData1.title,
        });
      } else {
        await database.push('Productcard', {
          img: imgURL1,
          title: formData1.title,
        });
      }

      alert('Product card updated successfully! Please Refresh the page');
      setFormData1({
        img: '',
        title: '',
      });
      setImageFile1(null);
      setEditingUid1(null);
      setShowAddForm1(false);
      setShowEditForm1(false);
    } catch (error) {
      console.error('Error updating Product card:', error);
    }
  };

  return (
    <>

      <div style={{ textAlign: 'center', margin: 'auto', width: '80%', padding: '20px' }} className='relative'>
        {/* <h2 style={{ fontSize: '32px', color: 'primary' }} className='text-primary'>Admin Panel</h2> */}

        <button
          style={{
            fontSize: '20px',
            padding: '10px',
            color: 'white',
            borderRadius: '5px',
            marginBottom: '20px',
          }}
          className='bg-primary'
          onClick={handleAddNew}
        >
          Add New Product Page
        </button>

        {showAddForm && (
          <div className='fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto'>
            <form onSubmit={handleFormSubmit} className="mt-8 p-8 bg-white rounded-lg shadow-md w-96 mx-auto">
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                  Banner Image
                </label>
                <br></br>
                <h6>Please provide same dimension of all images in this section preferrably (500 * 500)</h6>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="heading" className="block text-gray-700 text-sm font-bold mb-2">
                  Router Name (Example : BFS)
                </label>
                <input
                  type="text"
                  id="heading"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                  Domain:
                </label>
                <textarea
                  id="Domain"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div> */}

              {/* <div className="mb-4">
                <label htmlFor="routerlink" className="block text-gray-700 text-sm font-bold mb-2">
                  Router Link:
                </label>
                <input
                  type="text"
                  id="routerlink"
                  name="routerlink"
                  value={formData.routerlink}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div> */}
              {/* <div className="mb-4">
                <label htmlFor="routerlink" className="block text-gray-700 text-sm font-bold mb-2">
                  Date:
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div> */}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Save New Product Page
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}


        {showEditForm && (
          <div className='fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto'>
            <form onSubmit={handleFormSubmit} className="mt-8 p-8 bg-white rounded-lg shadow-md w-96 mx-auto">
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                  Banner img
                </label><br></br>
                <h6>Please provide same dimension of all images in this section preferrably (500 * 500)</h6>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="heading" className="block text-gray-700 text-sm font-bold mb-2">
                  Router Name (Example : BFS)
                </label>
                <input
                  type="text"
                  id="heading"
                  name="heading"
                  value={formData.bannerimg}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                  Domain:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div> */}

              {/* <div className="mb-4">
                <label htmlFor="routerlink" className="block text-gray-700 text-sm font-bold mb-2">
                  Router Link:
                </label>
                <input
                  type="text"
                  id="routerlink"
                  name="routerlink"
                  value={formData.routerlink}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div> */}
              {/* <div className="mb-4">
                <label htmlFor="routerlink" className="block text-gray-700 text-sm font-bold mb-2">
                  Date:
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div> */}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel Edit
                </button>
              </div>
            </form>
          </div>
        )}


        <div>
          {ProductData.slice().reverse().map((Product) => (
            <div key={Product.uid} style={{ border: '1px solid #013A98', padding: '20px', marginBottom: '20px', borderRadius: '10px', textAlign: 'left' }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Product : {Product.routerName}</p>
              <img src={Product.bannerimg} alt={`Product ${Product.uid}`} className='w-full h-[200px] object-contain' style={{ maxWidth: '100%', marginBottom: '10px', borderRadius: '5px' }} />
              <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Heading: {Product.routerName}</p>
              {/* <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Domain: {Product.description}</p>
              <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Router Link: {Product.routerlink}</p>
              <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Date: {Product.date}</p> */}
              <button style={{ fontSize: '18px', backgroundColor: '#013A98', color: 'white', padding: '5px', borderRadius: '5px', marginRight: '5px' }} onClick={() => handleEdit(Product.uid)}>
                Edit
              </button>
              <button style={{ fontSize: '18px', backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '5px' }} onClick={() => handleDelete(Product.uid)}>
                Delete
              </button>
              {/* Gulshan Start */}
              <div>
                <button
                  style={{
                    fontSize: '18px',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                >
                  <Link to={generateRoute(Product)}>Go to Your Route</Link>


                </button>
              </div>
              <div>
                <button
                  style={{
                    fontSize: '18px',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                >
                  <a
                    href={`https://reifenhauser.onrender.com${generateRoute(Product)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </a>

                </button>
              </div>

              {/* Gulshan End */}

            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', margin: 'auto', width: '80%', padding: '20px' }}>
        {/* <h2 style={{ fontSize: '32px', color: '#013A98' }}>Admin Panel</h2> */}

        {showAddForm1 && (
          <div className='fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto'>

            <form onSubmit={handleFormSubmit1} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label>
                Image  (please provide same dimension of all images in this section preferrably (500 * 500)):
                <input type="file" accept="image/*" onChange={handleImageChange1} />
              </label>
              <label>
                Title:
                <input type="text" name="title" value={formData1.title} onChange={handleInputChange1} />
              </label>

              <button type="submit" style={{ fontSize: '20px', padding: '10px', backgroundColor: '#013A98', color: 'white', borderRadius: '5px', marginTop: '10px' }}>
                Save New Product Card
              </button>
              <button
                type="button"
                onClick={handleCancelEdit1}
                style={{ fontSize: '20px', padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '5px', marginTop: '10px', marginLeft: '10px' }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {showEditForm1 && (
          <div className='fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto'>

            <form onSubmit={handleFormSubmit1} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label>
                Image (please provide same dimension of all images in this section preferrably (500 * 500)):
                <input type="file" accept="image/*" onChange={handleImageChange1} />
              </label>
              <label>
                Title:
                <input type="text" name="title" value={formData1.title} onChange={handleInputChange1} />
              </label>

              <button type="submit" style={{ fontSize: '20px', padding: '10px', backgroundColor: '#013A98', color: 'white', borderRadius: '5px', marginTop: '10px' }}>
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit1}
                style={{ fontSize: '20px', padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '5px', marginTop: '10px', marginLeft: '10px' }}
              >
                Cancel Edit
              </button>
            </form>
          </div>
        )}

        <div>
          {/* {ProductData1.map((Product) => (
          <div key={Product.uid} style={{ border: '1px solid #013A98', padding: '20px', marginBottom: '20px', borderRadius: '10px', textAlign: 'left' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Product Card {Product.uid}</p>
            <img src={Product.img} alt={`Product Card ${Product.uid}`} style={{ maxWidth: '100%', marginBottom: '10px', borderRadius: '5px' }} />
            <p style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Title: {Product.title}</p>

            <button style={{ fontSize: '18px', backgroundColor: '#013A98', color: 'white', padding: '5px', borderRadius: '5px', marginRight: '5px' }} onClick={() => handleEdit1(Product.uid)}>
              Edit
            </button>
            <button style={{ fontSize: '18px', backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '5px' }} onClick={() => handleDelete1(Product.uid)}>
              Delete
            </button>
          </div>
        ))} */}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
