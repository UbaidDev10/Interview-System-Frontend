import React from 'react'
import API from '../../api/BaseService'

const useRegister = () => {
  const register = async (payload) => {
    const res = await API.post("/auth/register", payload);

    // Fix: Check if token is at res.data.token or res.token
    const token = res.data?.token || res.token;
    console.log("Token:", token);

    localStorage.setItem("token", token);
    return res.data;
  };

  return { register };
};


export default useRegister




