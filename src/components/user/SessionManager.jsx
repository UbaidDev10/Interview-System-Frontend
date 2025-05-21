import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

const SessionManager = () => {
    const navigate = useNavigate();

   useEffect(() => {
    const checkSessionTimeout = () => {
      const timestamp = localStorage.getItem("logintimestamp");
      const hour = 12*60*60*1000; 

      if (timestamp && Date.now() - Number(timestamp) > hour) {
        localStorage.clear();
        navigate("/login");
      }
    };

    const interval = setInterval(checkSessionTimeout, 10000);
    return () => clearInterval(interval);
  }, []);
  return null;
}

export default SessionManager