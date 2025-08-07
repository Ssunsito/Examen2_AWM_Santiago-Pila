import React from 'react';
import Login from '../Login';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    return (
        <div className="login-page">
            <Login onLogin={onLogin} />
        </div>
    );
};

export default LoginPage;
