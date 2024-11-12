import React from 'react';

const RegisterForm: React.FC = () => {
  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    // Add your registration logic here
    alert('Registration complete');
  };

  return (
    <form onSubmit={handleRegister}>
      <div>
        <label>Username:</label>
        <input type="text" name="username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
