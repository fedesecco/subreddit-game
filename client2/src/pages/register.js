import { useState, useEffect } from "react"
import {Logo, FormRow, Alert} from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from "../context/appContext"

const initialState = {
    name: '',
    email: '',
    password: '',
    isMember: true,
    showAlert: false,
}



const Register = () => {

    const [values, setValues] = useState(initialState)

    const {alertText, showAlert, isLoading, displayAlert} = useAppContext()

    const toggleMember = () => {
        setValues({...values, isMember:!values.isMember})
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const {name, email, password, isMember} = values
        if(!email || !password || (!isMember && !name)){
            displayAlert()
        }
    }
    
    const handleChange = (e) =>{
        setValues({...values,[e.target.name]:e.target.value})
    }

    return (
        <Wrapper className="full-page">
            <form onSubmit={onSubmit} className="form">
                <Logo/>
                <h3>{values.isMember ? "Login" : "Register"}</h3>
                {showAlert && <Alert text="alert 1"/>}
                {!values.isMember && <FormRow type="text" name="name" value={values.name} handleChange={handleChange}/>}
                <FormRow type="text" name="email" value={values.email} handleChange={handleChange}/>
                <FormRow type="text" name="password" value={values.password} handleChange={handleChange}/>
                <button type="submit" className="btn btn-block" onClick={onSubmit}>Submit</button>
                <p>
                    {values.isMember?"No account yet?":"Already have an account?"}
                    <button type="button" onClick={toggleMember} className="member-btn">{values.isMember?"Register":"Login"}</button>
                </p>
            </form>
        </Wrapper>
    )
}

export default Register