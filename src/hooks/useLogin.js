import React from 'react'
import API from '../api/BaseService'

const useLogin = () => {
    const login = async(credentials) =>{
        const res = await API.post("/auth/Login", credentials);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("user", JSON.stringify({
          username: res.data.username
      }));
        return res.data;
    }
  return {login}
}

export default useLogin