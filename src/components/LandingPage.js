import React, { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { logUserData } from "../utils/logUserData";
import { ref, set, get } from "firebase/database";
import { db } from "../firebase";


const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const effectRan = useRef(false); // Prevents double execution

  useEffect(() => {
    if (effectRan.current) return; // Ensure effect runs only once

    logUserData().catch((error) => console.error("Error logging user data:", error));
    updateSiteHits().catch((error) => console.error("Error updating site hits:", error));

    effectRan.current = true; // Set flag to prevent re-running
  }, []);

  // Function to update site hits in Firebase
  const updateSiteHits = async () => {
    try {
      const hitsRef = ref(db, "siteHits");
      const snapshot = await get(hitsRef);
      let hits = snapshot.exists() ? snapshot.val() : 0;
      hits += 1;
      await set(hitsRef, hits);
      console.log("Site hits updated successfully!");
    } catch (error) {
      console.error("Error updating site hits:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in successfully!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed up successfully!", user);

        await set(ref(db, `users/${user.uid}`), {
          name,
          email,
          createdAt: new Date().toISOString(),
        });
        console.log("User data saved to database!");
      }
      navigate("/loading");
    } catch (error) {
      console.error("Error during login/signup:", error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="image-container">
        <img src="/newposter.png" alt="Landing Page" />
      </div>
      <div className="form-container">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ margin: "10px 0", padding: "10px", width: "100%", maxWidth: "300px" }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ margin: "10px 0", padding: "10px", width: "100%", maxWidth: "300px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
            style={{ margin: "10px 0", padding: "10px", width: "100%", maxWidth: "300px" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: isLogin ? "#007bff" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              margin: "10px 0",
            }}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p
          className="toggle-link"
          onClick={() => setIsLogin(!isLogin)}
          style={{
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "none",
            transition: "color 0.3s ease, transform 0.2s ease",
            marginTop: "10px",
          }}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
