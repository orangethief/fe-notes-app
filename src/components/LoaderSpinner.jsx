const LoaderSpinner = () => {
  return (
    <div className="flex justify-center items-center mt-12">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoaderSpinner;