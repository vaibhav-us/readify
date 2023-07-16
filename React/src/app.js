import React from "react";
import { 
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route
} from "react-router-dom";
import Homepage,{loader as homepageLoader} from "./pages/homepage";
import Homenav,{action as searchAction} from "./pages/homenav";
import BookPage,{loader as bookpageLoader} from "./pages/bookpage";
import Login,{action as loginAction} from "./pages/login";
import Signup,{action as signupAction} from "./pages/signup";
import SearchPage,{loader as searchLoader} from "./pages/searchpage";
import ReviewPage,{loader as reviewLoader ,action as reviewAction} from "./pages/reviewpage";
import ReviewSection,{action as reviewSectionAction} from "./pages/reviewsection";
import ProfileNav from "./pages/profile/profilenav";
import ProfileIndex from "./pages/profile";
import Activity,{loader as activityLoader} from "./pages/profile/activity";
import Preference from "./pages/profile/preference";
import Recommendations from "./pages/profile/recommendation";
import Bookshelf from "./pages/profile/bookshelf";
import { Error404 } from "./components/sadpath";
import Contribute,{action as contributeAction} from "./pages/contribute";

export default function App () {
    const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Homenav />} action={searchAction}>
            <Route path='*' element={<Error404/>} />
            <Route index element={<Homepage />} loader={homepageLoader}/>
            <Route path="book/:bookId" element={<BookPage />} loader={bookpageLoader}/>
            <Route path="book/:bookId/review/:reviewId" element={<ReviewSection />} action={reviewSectionAction}/>
            <Route path="login" element={<Login />} action={loginAction}/>
            <Route path="signup" element={<Signup />} action={signupAction}/>
            <Route path="search" element={<SearchPage />} loader={searchLoader}/>
            <Route path="book/:bookId/review" element={<ReviewPage />} loader={reviewLoader} action={reviewAction}/>
            <Route path="/contribute" element={<Contribute/>} action={contributeAction}/>
            <Route path="profile" element={<ProfileNav />} >
                <Route index element={<ProfileIndex/>} /> 
                <Route path="activity" element={<Activity/>} loader={activityLoader} />
                <Route path="preference" element={<Preference/>} />
                <Route path="recommendations" element={<Recommendations/>} />
                <Route path="bookshelf" element={<Bookshelf/>}/>
            </Route>
        </Route>
    ))
    return(
        <RouterProvider router={router}/>
    )
}