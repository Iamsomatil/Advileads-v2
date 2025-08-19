import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const SuccessPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const { session_id } = router.query;

  useEffect(() => {
    if (session_id) {
      // Here you can fetch the session details if needed
      // or send it to your backend to update the order status
      setMessage('Payment successful! Thank you for your purchase.');
    }
  }, [session_id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Payment Successful</title>
      </Head>
      
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        
        {message && <p className="text-gray-600 mb-6">{message}</p>}
        
        <div className="mt-6">
          <Link 
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
          >
            Return Home
          </Link>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Order ID: {session_id}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
