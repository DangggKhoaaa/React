/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const createPostSchema = yup.object({
    title: yup.string().required("Title can't be empty").min(5).max(100),
    description: yup.string().required("Description can't be empty").min(10),
    author: yup.string().required("Author can't be empty").max(30),
    imageUrl: yup.string(),
});

const CreatePost = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(createPostSchema),
    });
    const [loading, setLoading] = useState(false);
    const [create, setCreate] = useState({});
    const navigate = useNavigate();

    const handleCreate = async (value) => {
        try {
            setLoading(true);

            const response = await axios.post("https://js-post-api.herokuapp.com/api/posts", value)

            if (response) {
                setCreate(value);
                swal("Good job!", "Tạo bài đăng thành công !!!", "success");
                reset();
                setLoading(false);
                navigate("/post/list")
            } else {
                throw new Error("Failed to create post");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="d-flex justify-content-center mt-3">
            <div className="row col-sm-4 rounded-3 border p-3 mb-2 bg-light text-dark mt-3">
                <form className="" onSubmit={handleSubmit(handleCreate)}>
                    <h3 className="text-success text-center my-3">Create Post</h3>
                    <div className="form-group mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" name="title" className="form-control" {...register("title")} placeholder="Tiêu đề" />
                        {errors.title && <span className="text-danger">{errors.title.message}</span>}
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-control" rows="5" cols="50" {...register("description")} placeholder="Nội dung" />
                        {errors.description && <span className="text-danger">{errors.description.message}</span>}
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Author</label>
                        <input type="text" name="author" className="form-control" {...register("author")} placeholder="Tên tác giả" />
                        {errors.author && <span className="text-danger">{errors.author.message}</span>}
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Image</label>
                        <input type="text" name="imageUrl" className="form-control" {...register("imageUrl")} placeholder="Hình ảnh (có thể trống)" />
                        {errors.imageUrl && <span className="text-danger">{errors.imageUrl.message}</span>}
                    </div>
                    <div className="form-group mb-3 text-end">
                        <button type="submit" className="btn btn-success me-2" disabled={loading}>
                            {loading ? "Creating" : "Create"}
                        </button>
                        <button type="button" className="btn btn-danger me-2" disabled={loading} onClick={() => reset()}>
                            {loading ? "Creating" : "Reset"}
                        </button>
                        <Link className={`btn btn-primary ${loading ? "disabled" : ""}`}
                            to={loading ? null : "/post/list"}>
                            {loading ? "Creating" : "Back"}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;