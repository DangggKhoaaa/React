import React from "react";

const Spinner = () => {
    return (
        <div className="spinner">
            <>
                <div className="spinner-grow text-primary me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow text-secondary me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow text-success me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow text-danger me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow text-warning me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </>

        </div>

    )
}

export default Spinner;