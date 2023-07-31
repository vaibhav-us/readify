import React from "react";
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    // Extracts pathname property(key) from an object
    const { pathname } = useLocation();
  
    
    // Automatically scrolls to top whenever pathname changes
    React.useEffect(() => {
      window.scrollTo({top: 0, left: 0, behavior:"instant" });
    }, [pathname]);
  
  }
  
  export default ScrollToTop;