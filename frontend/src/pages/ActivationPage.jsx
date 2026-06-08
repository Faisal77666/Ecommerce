import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../server';

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          console.log("✅ Activation Success:", res.data);
          setError(false);
        } catch (err) {
          console.error("❌ Activation Failed:", err.response.data.message);
          setError(true);
        }
      };
      activationEmail();
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p style={{ color: "red" }}>Your token is expired!</p>
      ) : (
        <p style={{ color: "green" }}>Your Account has been created successfully!</p>
      )}
    </div>
  );
};

export default ActivationPage;
