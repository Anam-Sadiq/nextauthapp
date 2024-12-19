'use client';

const ErrorPage = ({ error }) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{error}</p>
    </div>
  );
};

export default ErrorPage;
