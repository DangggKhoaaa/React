/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../navbar/Spinner";
import { Link, useLocation } from "react-router-dom";
import swal from "sweetalert";
import { NavLink } from "react-router-dom";

const PostList = () => {

    const id = useLocation().state?.id;
    const page = +useLocation().state?.page;
    const [post, setPost] = useState([]);
    const [currentPage, setCurrentPage] = useState(page || 1);
    const [background, setBackground] = useState('lightgreen')
    const [totalPage, setTotalPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setBackground('white');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        const getPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `https://js-post-api.herokuapp.com/api/posts?_page=${currentPage}&_limit=${9}
                    ${search ? `&q=${encodeURIComponent(search)}` : ''}`
                );
                setPost(response.data.data);
                setTotalPage(
                    Math.ceil(
                        Number(response.data.pagination._totalRows) /
                        Number(response.data.pagination._limit)
                    )
                );
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        const timeout = setTimeout(() => {
            getPosts();
        }, 1000);

        return () => clearTimeout(timeout);
    }, [currentPage, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    }

    const handleInput = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);
    }

    const handleDelete = async (postId) => {
        swal({
            title: "Bạn chắc chắn?",
            text: "Khi xóa, bạn sẽ không thể khôi phục lại thông tin !",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    setLoading(true);
                    const response = await axios.delete(`https://js-post-api.herokuapp.com/api/posts/${postId}`);

                    if (response) {
                        swal("Good job!", "Xóa thành công!", "success");
                        setPost((prevStudentList) => prevStudentList.filter((post) => post.id !== postId));
                        setLoading(false);
                    } else {
                        throw new Error("Failed to delete student");
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                swal("Bài viết được giữ an toàn!");
            }
        });
    };

    function scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }

    setTimeout(() => {
        if (id && post.length > 0) {
            scrollToElement(id);
        }
    }, 1000);

    const onPageChange = (pageChange) => {
        if (pageChange < 1 || pageChange > totalPage || pageChange === currentPage) {
            return;
        }
        setCurrentPage(pageChange);
    };

    const onPageStart = () => {
        setCurrentPage(1);
    };

    const onPageEnd = () => {
        if (currentPage !== totalPage) {
            setCurrentPage(totalPage);
        }
    };

    const renderPagination = () => {
        const pagination = [];

        pagination.push(
            <li
                onClick={() => onPageStart()}
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
            >
                <a
                    className="page-link"
                    href="#"
                    tabIndex="-1"
                    aria-disabled={currentPage === 1}
                >
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        );

        pagination.push(
            <li
                onClick={() => onPageChange(currentPage - 1)}
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                key="prev"
            >
                <a
                    className="page-link"
                    href="#"
                    tabIndex="-1"
                    aria-disabled={currentPage === 1}
                >
                    <span aria-hidden="true">&lt;</span>
                </a>
            </li>
        );

        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPage, currentPage + 1);

        if (startPage > 1) {
            pagination.push(
                <li className="page-item" key="startDots">
                    <a className="page-link" href="#" tabIndex="-1">
                        ...
                    </a>
                </li>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination.push(
                <li
                    className={`page-item ${currentPage === i ? "active" : ""}`}
                    onClick={() => onPageChange(i)}
                    key={i}
                >
                    <a className="page-link" href="#">
                        {i}
                    </a>
                </li>
            );
        }

        if (endPage < totalPage) {
            pagination.push(
                <li className="page-item" key="endDots">
                    <a className="page-link" href="#" tabIndex="-1">
                        ...
                    </a>
                </li>
            );
        }

        pagination.push(
            <li
                onClick={() => onPageChange(currentPage + 1)}
                className={`page-item ${currentPage === totalPage ? "disabled" : ""
                    }`}
                key="next"
            >
                <a
                    className="page-link"
                    href="#"
                    tabIndex="-1"
                    aria-disabled={currentPage === totalPage}
                >
                    <span aria-hidden="true">&gt;</span>
                </a>
            </li>
        );

        pagination.push(
            <li
                onClick={() => onPageEnd()}
                className={`page-item ${currentPage === totalPage ? "disabled" : ""
                    }`}
            >
                <a
                    className="page-link"
                    href="#"
                    tabIndex="-1"
                    aria-disabled={currentPage === totalPage}
                >
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        );

        return pagination;
    };

    return (
        <div className="container mt-3">
            <h1 className="text-primary my-3 text-center">List Post</h1>
            <div className="d-flex justify-content-between my-3" style={{ height: "40px" }}>
                <Link className='btn btn-success float-start' to={"/post/create"}><i className='fa fa-plus me-2' />Create</Link>
                <form className="d-flex" role="search" onSubmit={handleSearch}>
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={search}
                        onChange={(e) => handleInput(e)}
                    />
                    <button className="btn btn-danger" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                </form>
            </div>
            {loading ? <Spinner /> :
                <div className="row">
                    {post.map((ps) =>
                        <div className="col-md-4 mb-3" key={ps.id} id={ps.id}>
                            <div className="card background-transition" style={{ height: "500px", background: ps.id === id ? background : 'bg-white' }}>
                                <img
                                    src={ps.imageUrl}
                                    className="card-img-top"
                                    alt=""
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/1368x400?text=Error';
                                    }}
                                    onEmptied={(e) => {
                                        e.target.src = 'https://via.placeholder.com/1368x400?text=Error';
                                    }}
                                />
                                <div className="card-body">
                                    <p className="card-title h4">
                                        {ps.title}
                                    </p>
                                    <p className="cart-text">
                                        {ps.description}
                                    </p>
                                    <p className="fst-italic text-end">
                                        Author: {ps.author}
                                    </p>
                                </div>
                                <div className="position-absolute d-flex justify-content-end bottom-0 end-0">
                                    <NavLink className="btn btn-primary me-3" to={`/post/update/${currentPage}/${ps.id}`}>
                                        <i className="far fa-edit" />
                                    </NavLink>
                                    <button className="btn btn-danger"
                                        onClick={() => handleDelete(ps.id)}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }
            <ul className="pagination justify-content-end">{renderPagination()}</ul>
        </div>
    )
}

export default PostList;