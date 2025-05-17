import React, { createContext, useState, useContext } from 'react';

// Create context
const EmployeeContext = createContext();

// Create a provider component
export const EmployeeProvider = ({ children }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');

    const setEmployeeDetails = (id, name) => {
        setEmployeeId(id);
        setEmployeeName(name);
    };

    return (
        <EmployeeContext.Provider value={{ employeeId, employeeName, setEmployeeDetails }}>
            {children}
        </EmployeeContext.Provider>
    );
};

// Custom hook to use the EmployeeContext
export const useEmployee = () => {
    return useContext(EmployeeContext);
};
