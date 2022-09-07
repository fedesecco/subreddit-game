import main from "../assets/images/main.svg"
import Wrapper from "../assets/wrappers/LandingPage"
import {Logo } from "../components/"

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
                    <button className="btn btn-hero">Login/register</button>
                </div>
                <img src={main} alt="Landing page inspiration" className="img main-img"/>
            </div>
        </Wrapper>
    )
}

export default landing