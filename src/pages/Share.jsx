import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Languages, Send } from 'lucide-react';

const Share = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    bookId: '',
    originalText: '',
    translatedText: '',
    context: '',
    tags: []
  });

  if (!user) {
    return (
      <div className="text-center py-12">
        <Languages className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Sign in to Share Translations</h2>
        <p className="text-slate-500">You need to be signed in to create and share translations.</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Translation submitted:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Share a Translation</h1>
        <p className="text-slate-600">Add a new translation to help others learn.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Translation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Original Text
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
                value={formData.originalText}
                onChange={(e) => setFormData({...formData, originalText: e.target.value})}
                placeholder="Enter the original text..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Translation
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
                value={formData.translatedText}
                onChange={(e) => setFormData({...formData, translatedText: e.target.value})}
                placeholder="Enter the translation..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Context (Optional)
              </label>
              <Input
                value={formData.context}
                onChange={(e) => setFormData({...formData, context: e.target.value})}
                placeholder="e.g., Chapter 3, Page 45"
              />
            </div>

            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
              <Send className="w-4 h-4 mr-2" />
              Share Translation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Share;