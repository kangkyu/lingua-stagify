import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon, Calendar, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <UserIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Sign in to View Profile</h2>
        <p className="text-slate-500">You need to be signed in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-slate-700 text-white rounded-full flex items-center justify-center text-2xl font-bold">
          {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-slate-600">{user.email}</p>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            Joined January 2024
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Translations Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600">24</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Likes Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">156</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Comments Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">43</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Translations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4 last:border-b-0">
              <p className="font-medium text-slate-800">"Hello, how are you?" → "Hola, ¿cómo estás?"</p>
              <p className="text-sm text-slate-600">from Basic Spanish Conversations • 3 days ago</p>
            </div>
            <div className="border-b border-slate-200 pb-4 last:border-b-0">
              <p className="font-medium text-slate-800">"Good morning" → "Buenos días"</p>
              <p className="text-sm text-slate-600">from Daily Greetings • 5 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;