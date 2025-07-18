import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark as BookmarkIcon } from 'lucide-react';

const Bookmarks = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <BookmarkIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Sign in to View Bookmarks</h2>
        <p className="text-slate-500">You need to be signed in to view your saved translations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">My Bookmarks</h1>
      
      <div className="text-center py-12">
        <BookmarkIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">You haven't bookmarked any translations yet.</p>
        <p className="text-sm text-slate-400 mt-2">Visit the feed to discover and bookmark translations.</p>
      </div>
    </div>
  );
};

export default Bookmarks;