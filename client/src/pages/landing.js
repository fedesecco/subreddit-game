import main from "../assets/images/main.svg"
import Wrapper from "../assets/wrappers/LandingPage"
import {Logo } from "../components/"
import { Link } from "react-router-dom"

const landing = () => {
    return (
        <Wrapper>
            <nav>
                <Logo/>
            </nav>
            <div className="container page">
                <div className="info">
                    <h1>Job <span>tracking</span> app</h1>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil in voluptatibus corrupti nobis porro nostrum, explicabo tempore, blanditiis beatae animi nulla fuga soluta minus officia culpa illum? Cum, quae enim.
                    </p>
                    <Link to='/register' className='btn btn-hero'>Login/Register</Link>
                </div>
                <img src={main} alt="Landing page inspiration" className="img main-img"/>
            </div>
        </Wrapper>
    )
}

export default landing