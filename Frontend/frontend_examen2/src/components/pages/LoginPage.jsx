import React from 'react';
import AuthContainer from '../AuthContainer';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    return (
        <div className="login-page">
            <AuthContainer onLogin={onLogin} />
        </div>
    );
};

export default LoginPage;
