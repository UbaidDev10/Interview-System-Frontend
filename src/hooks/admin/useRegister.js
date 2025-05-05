import React from 'react'
import API from '../../api/BaseService'

const useRegister = () => {
    const register = async(payload) =>{
        const res = await API.post("/auth/register", payload);
        localStorage.setItem("token",res.data.token);
        return res.data;
    }
  return {register}
}

export default useRegister




