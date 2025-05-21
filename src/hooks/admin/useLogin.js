import React from 'react'
import API from '../../api/BaseService'

const useLogin = () => {
    const login = async(credentials) =>{
        const res = await API.post("/auth/Login", credentials);
        console.log("LOGIN RESPONSE:", res.data);
        localStorage.setItem("logintimestamp", Date.now());
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({
          username: res.data.data.username
      }));
        return res.data;
    }
  return {login}
}

export default useLogin