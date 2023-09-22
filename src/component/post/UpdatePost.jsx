/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const updatePostSchema = yup.object({
    title: yup.string().required("Title can't be empty").min(5).max(100),
    description: yup.string().required("Description can't be empty").min(10),
    author: yup.string().required("Author can't be empty").max(30),
    imageUrl: yup.string(),
});

const UpdatePost = () => {
    const { postId, page } = useParams();
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState({});
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(updatePostSchema),
        values: update,
    });

    useEffect(() => {
        try {
            async function getPost() {
                const response = await axios.get(`https://js-post-api.herokuapp.com/api/posts/${postId}`)
                setUpdate(response.data)
            }
            getPost();
        } catch (error) {
            console.error(error);
        }
    }, [postId])

    const handleUpdate = async (value) => {
        try {
            setLoading(true);

            await axios.patch(`https://js-post-api.herokuapp.com/api/posts/${postId}`, value);

            setUpdate(value);

            swal({
                title: 'Good job!',
                text: 'Sửa bài đăng thành công!',
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                didOpen: () => {
                    setTimeout(() => {
                        swal();
                    }, 1000);
                }
            });

            setLoading(false);

            navigate("/post/list", {
                state: {
                    id: postId,
                    page
                }
            })
        } catch (error) {
            console.error(error);
        }
    }
    const handleClick = () => {
        if (!loading) {
            navigate('/post/list', {
                state: {
                    page
                }
            });
        }
    };


    return (
        <div className="d-flex justify-content-center mt-3">
            <div className="row col-sm-4 rounded-3 border p-3 mb-2 bg-light text-dark mt-3">
                <form className="" onSubmit={handleSubmit(handleUpdate)}>
                    <h3 className="text-primary text-center my-3">Update Post</h3>
                    <div className="form-group mb-3">
                        <label className="form-label">Image</label>
                        <input type="text" name="imageUrl" className="form-control" {...register("imageUrl")} />
                        {errors.imageUrl && <span className="text-danger">{errors.imageUrl.message}</span>}
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" name="title" className="form-control" {...register("title")} />
                        {errors.title && <span className="text-danger">{errors.title.message}</span>}
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-control" rows="5" cols="55" {...register("description")} />
                        {errors.description && <span className="text-danger">{errors.description.message}</span>}
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Author</label>
                        <input type="text" name="author" className="form-control" {...register("author")} />
                        {errors.author && <span className="text-danger">{errors.author.message}</span>}
                    </div>

                    <div className="form-group mb-3 text-end">
                        <button type="submit" className="btn btn-success me-2" disabled={loading}>
                            {loading ? "Updating" : "Update"}
                        </button>
                        <button type="reset" className="btn btn-danger me-2" disabled={loading} onClick={() => reset()}>
                            {loading ? "Updating" : "Reset"}
                        </button>
                        {/* <Link
                            className={`btn btn-primary ${loading ? 'disabled' : ''}`}
                            to={loading ? null : '/post/list'}
                            state={{ page }}
                        >
                            {loading ? 'Updating' : 'Back'}
                        </Link> */}
                        <button className="btn btn-primary" disabled={loading} onClick={handleClick}>
                            {loading ? "Updating" : "Back"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdatePost;