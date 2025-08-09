/**
 * Hook untuk mendeteksi status autentikasi user.
 * @returns {boolean} isAuthenticated - True jika user sudah login/register
 */
import { useState, useEffect } from "react";


const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    return isAuthenticated;
};

export default useAuth;