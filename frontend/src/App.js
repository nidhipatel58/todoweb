import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/login";
import Signup from "./Components/Signup/signup";
import Profile from "./Components/Profile/profile";
import Todo from "./Components/Todo/Todo.component";
import UpdateTodo from "./Components/Todo/Updatetodo";
import { ToastContainer } from "react-toastify";

const SESSION_TIMEOUT = 10 * 1000; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    const restrictedRoutes = ["/login", "/signup"];

    if (loggedIn && restrictedRoutes.includes(location.pathname)) {
      navigate("/todo");
    }

    let logoutTimer;
    const resetSession = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(logout, SESSION_TIMEOUT);
      localStorage.setItem("lastActivity", Date.now());
    };

    const logout = () => {
      alert("Session expired! Logging out...");
      localStorage.clear();
      setIsLoggedIn(false);
      navigate("/login");
    };

    const checkSession = () => {
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity && Date.now() - lastActivity > SESSION_TIMEOUT) {
        logout();
      }
    };

    const activityHandler = () => resetSession();

    if (loggedIn) {
      resetSession();
      window.addEventListener("mousemove", activityHandler);
      window.addEventListener("keydown", activityHandler);
      const sessionCheckInterval = setInterval(checkSession, 1000);

      return () => {
        window.removeEventListener("mousemove", activityHandler);
        window.removeEventListener("keydown", activityHandler);
        clearTimeout(logoutTimer);
        clearInterval(sessionCheckInterval);
      };
    }

  }, [navigate, location.pathname]);

  return (
    <div className="App">
      <>
        <ToastContainer />
      </>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="container">
        <Routes>
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/updatetodo" element={<UpdateTodo />} />
          <Route path="/todo" element={<Todo />} />
          <Route
            path="/"
            element={
              isLoggedIn ? <Todo /> : <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
