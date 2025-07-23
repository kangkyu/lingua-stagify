import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Save } from 'lucide-react';

const CreateBook = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    sourceLanguage: 'English',
    targetLanguage: 'Spanish',
    isPublic: true,
    tags: ''
  });

  if (!user) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Sign in to Create Books</h2>
        <p className="text-slate-500">You need to be signed in to create translation books.</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement book creation API call
    // Handle form submission logic here
  };

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Japanese', 'Korean', 'Chinese', 'Arabic', 'Hindi'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Translation Book</h1>
        <p className="text-slate-600">Create a collection of translations around a theme or topic.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter book title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Enter author name..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your translation book..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Source Language</label>
                <Select
                  value={formData.sourceLanguage}
                  onChange={(e) => setFormData({...formData, sourceLanguage: e.target.value})}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Language</label>
                <Select
                  value={formData.targetLanguage}
                  onChange={(e) => setFormData({...formData, targetLanguage: e.target.value})}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="e.g., beginner, conversation, business"
              />
            </div>

            <div className="flex items-center">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isPublic" className="text-sm text-slate-700">
                Make this book public (others can view and contribute)
              </label>
            </div>

            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
              <Save className="w-4 h-4 mr-2" />
              Create Book
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBook;
