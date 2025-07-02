const ForgotPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          className="w-full mb-4 p-2 border rounded"
        />
        <button className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">
          Send Reset Link
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
