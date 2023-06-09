const ErrorNotify = (props: any) => {
    const { error, resetErrorBoundary } = props;
    console.log(error, resetErrorBoundary);
    return (
        <div className="error-page min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-5xl font-semibold text-yellow-600 mb-4">OOPS!!</h1>
                <p className="text-2xl text-gray-300 font-semibold">{error.massage}</p>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-md mt-4" onClick={resetErrorBoundary}>
                    Thử lại
                </button>
            </div>
        </div>
    );
};

export default ErrorNotify;
