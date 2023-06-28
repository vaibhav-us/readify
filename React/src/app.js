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

export default function App () {
    const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Homenav />}>
            <Route index element={<Homepage />}/>
            <Route path="book/:bookId" element={<BookPage />}/>
            <Route path="login" element={<Login />} action={loginAction}/>
            <Route path="signup" element={<Signup />} action={signupAction}/>
            <Route path="search" element={<SearchPage />} loader={searchLoader}/>
            <Route path="review" element={<ReviewPage />} action={reviewAction}/>
        </Route>
    ))
    return(
        <RouterProvider router={router}/>
    )
}