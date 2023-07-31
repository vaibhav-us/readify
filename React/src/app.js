import React from "react";
import { 
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route
} from "react-router-dom";
import Homepage,{loader as homepageLoader} from "./pages/homepage";
import Homenav,{loader as homenavLoader,action as searchAction} from "./pages/homenav";
import BookPage,{loader as bookpageLoader} from "./pages/bookpage";
import SearchPage,{loader as searchLoader} from "./pages/searchpage";
import ReviewPage,{loader as reviewLoader ,action as reviewAction} from "./pages/reviewpage";
import ReviewSection,{loader as reviewSectionLoader,action as reviewSectionAction} from "./pages/reviewsection";
import ProfileNav from "./pages/profile/profilenav";
import ProfileIndex,{loader as profileLoader} from "./pages/profile";
import Activity,{loader as activityLoader} from "./pages/profile/activity";
import Preference from "./pages/profile/preference";
import Recommendations from "./pages/profile/recommendation";
import Bookshelf,{loader as bookshelfLoader} from "./pages/profile/bookshelf";
import { Error404 } from "./components/sadpath";
import Contribute,{action as contributeAction} from "./pages/contribute";
import Authentication,{action as authAction} from "./pages/auth";
import ErrorPage from "./components/sadpath";

export default function App () {
    const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Homenav />} loader={homenavLoader} action={searchAction} errorElement={<ErrorPage/>} >
            <Route path='*' element={<Error404/>} />
            <Route errorElement={<ErrorPage/>}>
            
            <Route index element={<Homepage />} loader={homepageLoader}/>
            <Route path="book/:bookId" element={<BookPage />} loader={bookpageLoader}/>
            <Route path="book/:bookId/review/:reviewId" element={<ReviewSection />} loader={reviewSectionLoader} action={reviewSectionAction}/>
            <Route path="search" element={<SearchPage />} loader={searchLoader}/>
            <Route path="book/:bookId/review" element={<ReviewPage />} loader={reviewLoader} action={reviewAction}/>
            <Route path="/contribute" element={<Contribute/>} action={contributeAction}/>    
            <Route path="/auth" element={<Authentication/>} action={authAction}/>
            
            </Route>            
            
            <Route path="profile" element={<ProfileNav />} >
                <Route errorElement={<ErrorPage/>}>
                
                <Route index element={<ProfileIndex/>} loader={profileLoader}/> 
                <Route path="activity" element={<Activity/>} loader={activityLoader} />
                <Route path="preference" element={<Preference/>} />
                <Route path="recommendations" element={<Recommendations/>} />
                <Route path="bookshelf" loader={bookshelfLoader} element={<Bookshelf/>}/>
            
                </Route>    
            </Route>    
            
        </Route>
    ))
    return(
        <RouterProvider router={router}/>
    )
}