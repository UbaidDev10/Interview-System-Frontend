import React from 'react'
import API from '../../api/BaseService'

const useUpdateJobs = () => {
    const updateJob = async (jobId, formData) => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.put(`/admin/jobs/${jobId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (err) {
            console.log("Error updating job:", err.response?.data?.message || err.message);
            throw err;
        }
    }
  return {updateJob}
}

export default useUpdateJobs