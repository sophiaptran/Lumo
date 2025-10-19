import { useNavigate } from 'react-router-dom';

export const Component = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="relative inline-flex items-center justify-center gap-4 group">
      <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-md blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
      <button
        role="button"
        className="group relative inline-flex items-center justify-center text-base rounded-md bg-transparent border border-white/30 backdrop-blur-sm px-8 py-2 text-lg font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
        title="Login"
        onClick={handleLoginClick}
      >
        Login
        <svg
          viewBox="0 0 10 10"
          height="10"
          width="10"
          fill="none"
          className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
        >
          <path
            d="M0 5h7"
            className="transition opacity-0 group-hover:opacity-100"
          ></path>
          <path
            d="M1 1l4 4-4 4"
            className="transition group-hover:translate-x-[3px]"
          ></path>
        </svg>
      </button>
    </div>
  );
};