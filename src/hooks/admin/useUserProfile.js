import { useState, useEffect } from "react";
import API from "../../api/BaseService";

const useUserProfile = () => {
    const[profile, setProfile] = useState(null);
    const[loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/user/profile");
            setProfile(res.data.data);
        }
        catch(err){
            console.log("Failed to fetch profile:", err);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProfile();
    },[]);

    return{profile, loading}
}

export default useUserProfile;