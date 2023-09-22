/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import UpdateFormModal from "./UpdateStudent";
import CreateFormModal from "./CreateStudent";
import Spinner from "../navbar/Spinner";
import swal from "sweetalert";

const ListStudents = ({ studentList, setStudentList }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    // const [searchGender, setSearchGender] = useState("");

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleUpdateClick = (studentId) => {
        const selectedStudent = studentList.find((student) => student.id === studentId);
        setSelectedStudent(selectedStudent);
        setShowUpdateModal(true);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            async function getStudent() {
                setLoading(true);
                // setCurrentPage(1)
                let response = await fetch(
                    `https://js-post-api.herokuapp.com/api/students?_page=${currentPage}
                    ${search ? `&q=${encodeURIComponent(search)}` : ''}
                    `
                );
                let student = await response.json();
                setStudentList(student.data);
                setTotalPage(
                    Math.ceil(
                        Number(student.pagination._totalRows) /
                        Number(student.pagination._limit)
                    )
                );
                setLoading(false);
            }

            getStudent();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, currentPage]);


    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handleInput = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);
    }

    const handleDelete = async (studentId) => {
        swal({
            title: "Bạn chắc chắn?",
            text: "Khi xóa, bạn sẽ không thể khôi phục lại thông tin!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    setLoading(true);
                    const response = await fetch(
                        `https://js-post-api.herokuapp.com/api/students/${studentId}`,
                        {
                            method: "DELETE",
                        }
                    );

                    if (response.ok) {
                        swal("Good job!", "Xóa thành công!", "success");
                        setStudentList((prevStudentList) =>
                            prevStudentList.filter((student) => student.id !== studentId)
                        );
                        setLoading(false);
                    } else {
                        throw new Error("Failed to delete student");
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                swal("Thông tin sinh viên được giữ an toàn!");
            }
        });
    };

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
            <h1 className="text-danger my-3 text-center">List Students</h1>
            <div className="d-flex justify-content-between">
                <button className='btn btn-primary float-start' onClick={openModal}><i className='fa fa-plus me-2' />Create</button>
                <CreateFormModal
                    studentList={studentList}
                    setStudentList={setStudentList}
                    isOpen={isOpen}
                    onClose={closeModal}
                />
                <form className="d-flex" role="search" onSubmit={handleSearch}>
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={search}
                        onChange={(e) => handleInput(e)}
                    />
                    <button className="btn btn-success d-flex" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                </form>
            </div>

            {loading ? <Spinner /> :
                <table className="table table-hover my-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Mark</th>
                            <th>Gender</th>
                            <th>City</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentList.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td style={{ maxHeight: "20px" }}>{student.name}</td>
                                <td>{student.age}</td>
                                <td>{student.mark}</td>
                                <td>{student.gender}</td>
                                <td>{student.city}</td>
                                <td>
                                    <button className="btn btn-success me-2" onClick={() => handleUpdateClick(student.id)}>
                                        <i className="fa fa-edit" />
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(student.id)}>
                                        <i className="fa fa-trash" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            {showUpdateModal && (
                <UpdateFormModal
                    isOpen={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    studentList={studentList}
                    setStudentList={setStudentList}
                    selectedStudent={selectedStudent}
                />
            )}
            <ul className="d-flex position-absolute bottom-0 end-0">{renderPagination()}</ul>
        </div>
    );
};

export default ListStudents;