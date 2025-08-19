import Head from 'next/head';
import Link from 'next/link';

const CanceledPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Payment Canceled</title>
      </Head>
      
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-yellow-500 text-6xl mb-4">✕</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Canceled</h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was not completed. You have not been charged.
        </p>
        
        <div className="mt-6">
          <Link 
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
          >
            Return Home
          </Link>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <a 
              href="mailto:support@advileads.com"
              className="text-blue-500 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CanceledPage;
