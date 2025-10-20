import { useState, useEffect } from 'react';
import { supabase } from './supaBaseClient';
import Auth from './Auth';
import Account from './Account';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-indigo-600">User Profiler</h1>
              </div>
            </div>
            
            {session && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm font-medium">
                  Welcome, {session.user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:-translate-y-0.5"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {session ? (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Profile</h2>
                <p className="text-gray-600">Manage your account settings and profile information</p>
              </div>

              {/* Account Component */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <Account session={session} />
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Authentication</h2>
                <Auth />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 User Profiler. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
