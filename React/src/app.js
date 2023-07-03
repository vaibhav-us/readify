import React from "react";
import { 
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route
} from "react-router-dom";
import Homepage from "./pages/homepage";
import Homenav from "./pages/homenav";
import BookPage from "./pages/bookpage";
import Login,{action as loginAction} from "./pages/login";
import Signup,{action as signupAction} from "./pages/signup";
import SearchPage,{loader as searchLoader} from "./pages/searchpage";
import ReviewPage,{action as reviewAction} from "./pages/reviewpage";
import ReviewSection,{action as reviewSectionAction} from "./pages/reviewsection";
import ProfileNav from "./pages/profile/profilenav";
import ProfileIndex from "./pages/profile";
import Recent from "./pages/profile/recent";
import Preference from "./pages/profile/preference";
import Recommendations from "./pages/profile/recommendation";

export default function App () {
    const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Homenav />}>
            <Route index element={<Homepage />}/>
            <Route path="book/:bookId" element={<BookPage />}/>
            <Route path="book/:bookId/review/:reviewId" element={<ReviewSection />} action={reviewSectionAction}/>
            <Route path="login" element={<Login />} action={loginAction}/>
            <Route path="signup" element={<Signup />} action={signupAction}/>
            <Route path="search" element={<SearchPage />} loader={searchLoader}/>
            <Route path="review" element={<ReviewPage />} action={reviewAction}/>
            <Route path="profile" element={<ProfileNav />} >
                <Route index element={<ProfileIndex/>} /> 
                <Route path="recent" element={<Recent/>} />
                <Route path="preference" element={<Preference/>} />
                <Route path="recommendations" element={<Recommendations/>} />
            </Route>
        </Route>
    ))
    return(
        <RouterProvider router={router}/>
    )
}