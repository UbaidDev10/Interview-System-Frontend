import { useState, useEffect } from "react";
import API from "../../api/BaseService";

const useFetchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const fetchJobs = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/jobs?page=${page}&limit=6&search=${search}`);
      
      if (res.data && res.data.data) {
        const { jobs: fetchedJobs, currentPage, totalPages, totalJobs } = res.data.data;
        
        setJobs(fetchedJobs || []);
        setCurrentPage(currentPage || 1);
        setTotalPages(totalPages || 1);
        setTotalJobs(totalJobs || 0);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { 
    jobs, 
    loading, 
    currentPage, 
    totalPages, 
    totalJobs, 
    fetchJobs 
  };
};

export default useFetchJobs;