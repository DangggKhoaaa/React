import React, { useState } from "react";
function RegisterForm() {
    const [state, setState] = useState({
        email: '',
        username: '',
        password: ''
    })

    const handleInputValue = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })

    }
    const handleSubmitRegister = (e) => {
        e.preventDefault();
        alert(JSON.stringify(state))
    }
    const { email, username, password } = state
    return (
        <form onSubmit={handleSubmitRegister} className="row col-sm-4">
            <h3 className="text-success">Register Form</h3>
            <div className="form-group mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control"
                    onInput={handleInputValue}
                    value={email}
                />
            </div>
            <div className="form-group mb-3">
                <label className="form-label">Username</label>
                <input type="text" name="username" className="form-control"
                    onInput={handleInputValue}
                    value={username}
                />
            </div>
            <div className="form-group mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control"
                    onInput={handleInputValue}
                    value={password}
                />
            </div>
            <div className="form-group mb-3">
                <button type="submit" className="btn btn-danger btn-sm me-2">Register</button>
            </div>
        </form>
    )
}

export default RegisterForm;