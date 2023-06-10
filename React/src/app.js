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
import Login,{action as loginAction} from "./pages/login";
import Signup,{action as signupAction} from "./pages/signup";

export default function App () {
    const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Homenav />}>
            <Route index element={<Homepage />}/>
            <Route path=":movieId" element={<MoviePage />}/>
            <Route path="login" element={<Login />} action={loginAction}/>
            <Route path="signup" element={<Signup />} action={signupAction}/>
        </Route>
    ))
    return(
        <RouterProvider router={router}/>
    )
}