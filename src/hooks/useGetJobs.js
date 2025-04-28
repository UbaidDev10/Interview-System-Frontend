import React from 'react'
import API from '../api/BaseService'

const useGetJobs = () => {

    const getJobs = async () =>{
        try{
            const token = localStorage.getItem("token");
            const res = await API.get("/admin/jobs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        }catch(err){
            console.log("Error fetching jobs:", err.response?.data?.message || err.message);
            throw err;
        }
    }
    return {getJobs}
}

export default useGetJobs