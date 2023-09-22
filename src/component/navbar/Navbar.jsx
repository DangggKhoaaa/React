/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {

    return (
        <nav className="custom-navbar navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
                <NavLink className="navbar-brand fs-4 h3" to={"/"}>
                    Home
                </NavLink>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item h5">
                            <NavLink className="nav-link fs-5" to={"/student/list"}>
                                Student
                            </NavLink>
                        </li>
                        <li className="nav-item h5">
                            <NavLink className="nav-link fs-5" to={"/post/list"}>
                                Post
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>


    )
}

export default Navbar;