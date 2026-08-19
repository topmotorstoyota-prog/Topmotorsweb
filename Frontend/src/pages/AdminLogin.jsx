import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('permissions', JSON.stringify(data.permissions));
        navigate('/admin/dashboard');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Сервертэй холбогдоход алдаа гарлаа');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="email" placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password" placeholder="Password"
          className="w-full p-2 border rounded mb-6"
          value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition">
          Нэвтрэх
        </button>
      </form>
    </div>
  );
}
