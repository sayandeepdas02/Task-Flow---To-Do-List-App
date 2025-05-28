
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus, Calendar, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">TaskFlow</span>
        </div>
        <div className="space-x-4">
          {!isLoggedIn ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-800"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Dashboard
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Organize your life,
            <br />
            <span className="text-blue-600">one task at a time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            TaskFlow helps you capture and organize tasks, so you can make progress on the things that matter most.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started for Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Tasks Quickly</h3>
            <p className="text-gray-600">
              Capture tasks instantly with our intuitive interface. Add, organize, and prioritize with ease.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Stay on Schedule</h3>
            <p className="text-gray-600">
              Set due dates and never miss a deadline. Keep track of what needs to be done and when.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal & Secure</h3>
            <p className="text-gray-600">
              Your tasks are stored securely on your device. Simple, private, and always accessible.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">TaskFlow</span>
          </div>
          <p className="text-gray-600">
            © 2024 TaskFlow. Built with passion for productivity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
