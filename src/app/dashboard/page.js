'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // profile, orders, payments

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          window.location.href = '/auth/login';
          return;
        }

        // Fetch user profile
        const profileResponse = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUser(profileData.user);
        } else {
          window.location.href = '/auth/login';
          return;
        }

        // Fetch user orders
        const ordersResponse = await fetch('/api/user/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData.orders);
        }

        // Fetch user payments
        const paymentsResponse = await fetch('/api/user/payments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          setPayments(paymentsData.payments);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name || user?.email}</span>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Payments
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'profile' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account information.</p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.name}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Account created</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">My Orders</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">List of all your orders.</p>
              </div>
              <div className="border-t border-gray-200">
                {orders.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <li key={order.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-indigo-600 truncate">
                            Order #{order.id}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="mr-6">
                              <p className="text-sm text-gray-500">Amount: ${order.amount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Created: {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">My Payments</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">List of all your payments.</p>
              </div>
              <div className="border-t border-gray-200">
                {payments.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <li key={payment.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-indigo-600 truncate">
                            Payment for Order #{payment.orderId}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : payment.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="mr-6">
                              <p className="text-sm text-gray-500">Amount: ${payment.amount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Order Amount: ${payment.order?.amount || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Created: {new Date(payment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No payments found.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}