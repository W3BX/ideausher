import React from 'react'
import { useNavigate, } from "react-router-dom"

const Error = () => {
    const navigate = useNavigate()
    return (
        <div className='container error_div'>
            <div class="position-absolute top-50 start-50 translate-middle">
                <p className='error_no'>404</p>
                <h3 className='error_text'>No such page found!</h3>
                <h4 className='btn btn-link mt-1' onClick={() => navigate("/", { replace: true })}>Redirect to Home Page</h4>
            </div>
        </div>
    )
}

export default Error