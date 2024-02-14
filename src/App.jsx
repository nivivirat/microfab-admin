import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './Components/Sidebar/Sidebar';
import Home from './Components/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="font-poppins w-screen overflow-clip no-vertical-scroll">

        <SideBar />

        <div className="ml-[50px] mt-[80px]">
          <Routes>
            {/* <Route path="/media/:id/:heading" element={<SingleFileUpload />} /> */}
            <Route path="/" element={<Home />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;