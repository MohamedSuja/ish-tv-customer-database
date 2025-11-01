import React from 'react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100 text-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-neutral/50 rounded-xl shadow-lg">
        <div className="text-center">
            <svg className="w-16 h-16 text-primary mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.5C12 2.5 7.63 4.54 5.8 7.37C4.19 9.87 3.99 12.68 5.8 15.63C7.63 18.54 12 21.5 12 21.5C12 21.5 16.37 18.54 18.2 15.63C20.01 12.68 19.81 9.87 18.2 7.37C16.37 4.54 12 2.5 12 2.5ZM12 14.25C10.76 14.25 9.75 13.24 9.75 12C9.75 10.76 10.76 9.75 12 9.75C13.24 9.75 14.25 10.76 14.25 12C14.25 13.24 13.24 14.25 12 14.25Z" />
            </svg>
            <h1 className="text-3xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400">Sign in to manage the customer database.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="current-password"
            />
          </div>
          
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-primary rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-primary transition">
              Sign In
            </button>
          </div>
        </form>
         <div className="text-center text-xs text-gray-500">
            <p>Hint: Use username <span className="font-mono text-accent">admin</span> and password <span className="font-mono text-accent">password</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;