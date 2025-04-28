import React from 'react'
import API from '../api/BaseService'

const useDeleteJobs = () => {
    const deleteJob = async (jobId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.delete(`/admin/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (err) {
            console.log("Error deleting job:", err.response?.data?.message || err.message);
            throw err;
        }
    }
  return{deleteJob}
}

export default useDeleteJobs