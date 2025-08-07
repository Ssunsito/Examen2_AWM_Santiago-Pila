import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Login.css';

const AuthContainer = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);

    const switchToRegister = () => {
        setIsLogin(false);
    };

    const switchToLogin = () => {
        setIsLogin(true);
    };

    return (
        <div className="auth-container">
            {isLogin ? (
                <Login 
                    onLogin={onLogin} 
                    onSwitchToRegister={switchToRegister}
                />
            ) : (
                <Register 
                    onSwitchToLogin={switchToLogin}
                />
            )}
        </div>
    );
};

export default AuthContainer;
