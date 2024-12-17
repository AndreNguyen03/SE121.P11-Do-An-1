import React from 'react';

const Header = ({ children, textColor }) => {
    return (
        <h1 className={`${textColor} text-2xl lg:text-4xl font-semibold mb-5 text-center lg:text-start lg:mb-10`}>
            {children}
        </h1>
    );
};

export default Header;