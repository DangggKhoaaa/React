import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Spinner from "../navbar/Spinner";
import swal from "sweetalert";

const updateStudentSchema = yup.object({
    name: yup.string()
        .required("Name can't be empty")
        .min(5)
        .max(30),
    age: yup.number()
        .required("Age can't be empty")
        .min(16)
        .max(69)
        .typeError("Invalid Age"),
    mark: yup
        .mixed()
        .required("Mark can't be empty")
        .test("valid-mark", "An integer or a decimal with one decimal place", function (value) {
            if (value === undefined || value === null) return false;
            return /^-?\d+(\.\d{1})?$/.test(value);
        })
        .test("valid-range", "Mark must be between 0 and 10", function (value) {
            if (value === undefined || value === null) return false;
            const parsedValue = parseFloat(value);
            return parsedValue >= 0 && parsedValue <= 10;
        }),
    gender: yup.string()
        .required("Gender can't be empty"),
    city: yup.string()
        .required("City can't be empty")
});

const UpdateFormModal = ({ isOpen, onClose, studentList, setStudentList, selectedStudent }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(updateStudentSchema)
    });
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (values) => {
        try {
            setLoading(true);
            const response = await fetch(`https://js-post-api.herokuapp.com/api/students/${selectedStudent.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                const updatedStudent = { ...selectedStudent, ...values };
                const updatedStudentList = studentList.map((student) => {
                    if (student.id === updatedStudent.id) {
                        return updatedStudent;
                    }
                    return student;
                });
                setStudentList(updatedStudentList);
                swal("Good job!", "Cập nhật thành công !!!", "success");
                reset();
                onClose();
                setLoading(false);
            } else {
                throw new Error("Failed to update student");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        loading ? <Spinner /> :
            <div className={`modal ${isOpen ? "d-block" : ""}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-success">Update Student</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(handleUpdate)}>
                                <div className="form-group mb-3 d-flex">
                                    <label htmlFor="name" className="form-label col-3">Name</label>
                                    <div className="col-9">
                                        <input type="text" id="name" className={`form-control ${errors?.name ? "is-invalid" : ""}`} {...register("name")} defaultValue={selectedStudent.name} />
                                        {errors?.name && <span className="invalid-feedback">{errors.name.message}</span>}
                                    </div>
                                </div>
                                <div className="form-group mb-3 d-flex">
                                    <label htmlFor="age" className="form-label col-3">Age</label>
                                    <div className="col-9">
                                        <input type="number" id="age" className={`form-control ${errors?.age ? "is-invalid" : ""}`} {...register("age")} defaultValue={selectedStudent.age} />
                                        {errors?.age && <span className="invalid-feedback">{errors.age.message}</span>}
                                    </div>
                                </div>
                                <div className="form-group mb-3 d-flex">
                                    <label htmlFor="mark" className="form-label col-3">Mark</label>
                                    <div className="col-9">
                                        <input type="number" step={0.1} id="mark" className={`form-control ${errors?.mark ? "is-invalid" : ""}`} {...register("mark")} defaultValue={selectedStudent.mark} />
                                        {errors?.mark && <span className="invalid-feedback">{errors.mark.message}</span>}
                                    </div>
                                </div>
                                <div className="form-group mb-3 d-flex">
                                    <label htmlFor="gender" className="form-label col-3">Gender</label>
                                    <div className="col-9">
                                        <select name="gender" id="gender" className={`form-select ${errors?.gender ? "is-invalid" : ""}`} {...register("gender")} defaultValue={selectedStudent.gender}>
                                            <option value="male">male</option>
                                            <option value="female">female</option>
                                        </select>
                                        {errors?.gender && <span className="invalid-feedback">{errors.gender.message}</span>}
                                    </div>
                                </div>
                                <div className="form-group mb-3 d-flex">
                                    <label htmlFor="city" className="form-label col-3">City</label>
                                    <div className="col-9">
                                        <input type="text" id="city" className={`form-control ${errors?.city ? "is-invalid" : ""}`} {...register("city")} defaultValue={selectedStudent.city} />
                                        {errors?.city && <span className="invalid-feedback">{errors.city.message}</span>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-success">Update</button>
                                    <button type="button" className="btn btn-danger" onClick={onClose}>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default UpdateFormModal;