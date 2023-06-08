import React from "react";
import { 
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route
} from "react-router-dom";
import Homepage from "./pages/homepage";
import Homenav from "./pages/homenav";
import MoviePage from "./pages/moviepage";
import Login from "./pages/login";
import Signup from "./pages/signup";

export default function App () {
    const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Homenav />}>
            <Route index element={<Homepage />}/>
            <Route path=":movieId" element={<MoviePage />}/>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
        </Route>
    ))
    return(
        <RouterProvider router={router}/>
    )
}