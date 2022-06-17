import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Create from "./pages/Create/Create";
import Details from "./pages/Details/Details";
import Edit from './pages/Edit/Edit'
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";

const App = () => {
    return (
        <BrowserRouter>
            <div className='App'>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path='/create' element={<Create />} />
                    <Route path='/edit/:id' element={<Edit />} />
                    <Route path='/:id' element={<Details />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    )
}

export default App;