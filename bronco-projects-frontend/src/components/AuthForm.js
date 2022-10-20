import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import AuthService from "../services/AuthService";
import VerificationForm from "./VerificationForm";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const AuthForm = ({email, setEmail, shouldShowLoginForm, closeLoginForm}) => {
    const [signUpVerificationFormVisible, setSignUpVerificationFormVisible] = useState(false)
    const [signUpModalVisible, setSignUpModalVisible] = useState(false)

    const showSignUpVerificationForm = () => {
        closeLoginForm()
        setSignUpVerificationFormVisible(true)
    }

    let signupModal = <SignUpForm email={email} showSignUpModal={signUpModalVisible} closeSignUpModal={() => setSignUpModalVisible(false)}/>
    let signupVerificationForm =  <VerificationForm setEmail={setEmail}
                                                    shouldShowVerificationForm={signUpVerificationFormVisible}
                                                    closeVerificationForm={() => {setSignUpVerificationFormVisible(false)}}
                                                    showNextModal={() => setSignUpModalVisible(true)}/>

    let loginForm = <LoginForm shouldShowLoginForm={shouldShowLoginForm} closeLoginForm={closeLoginForm}
                                setEmail={setEmail} showSignUpVerificationForm={showSignUpVerificationForm}/>

    return (
        <div>
            {loginForm}
            {signupVerificationForm}
            {signupModal}
        </div>
    );
}

export default AuthForm;