import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

/* Css*/
import "./assets/css/index.css";

/*Components */
import Navbar from './components/Navbar'
import Footer from './components/Footer'

/*Pages */
import Home from './pages/home'
import Pricing from './pages/pricing'
import Blogs from './pages/blogs'
import ViewSingleBlog from './pages/blogs/ViewSingleBlog'
import TermsConditions from './pages/terms'
import PrivacyPolicy from './pages/privacypolicy'

const App = () => {

  return (
    <div className="main-container">
      <Navbar />
      <div className="main-container-content">
        <Routes>
          <Route exact path={`/*`} element={<Home />}></Route>
          <Route exact path={`/pricing/*`} element={<Pricing />}></Route>
          <Route exact path={`/blog/*`} element={<Blogs />}></Route>
          <Route exact path={`/blog/:blog_id/*`} element={<ViewSingleBlog />}></Route>
          <Route exact path={`/terms-of-use/*`} element={<TermsConditions />}></Route>
          <Route exact path={`/privacy-policy/*`} element={<PrivacyPolicy />}></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
