import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Bookmark, Search } from 'lucide-react';

const Feed = () => {
  const { user } = useAuth();
  const [translations, setTranslations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data for now
  useEffect(() => {
    setTranslations([
      {
        id: 1,
        originalText: 'Hello, how are you?',
        translatedText: 'Hola, ¿cómo estás?',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        context: 'Chapter 1, Page 1',
        bookTitle: 'Basic Conversations',
        author: 'Jane Smith',
        createdBy: 'John Doe',
        createdDate: '2024-01-15',
        likesCount: 12,
        commentsCount: 3,
        tags: ['greetings', 'conversation']
      },
      {
        id: 2,
        originalText: 'The weather is beautiful today.',
        translatedText: 'El clima está hermoso hoy.',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        context: 'Chapter 2, Page 5',
        bookTitle: 'Weather Expressions',
        author: 'Mike Johnson',
        createdBy: 'Sarah Wilson',
        createdDate: '2024-01-14',
        likesCount: 8,
        commentsCount: 1,
        tags: ['weather', 'adjectives']
      }
    ]);
  }, []);

  const filteredTranslations = translations.filter(translation =>
    translation.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    translation.translatedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    translation.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTranslations = [...filteredTranslations].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likesCount - a.likesCount;
      case 'discussed':
        return b.commentsCount - a.commentsCount;
      default: // recent
        return new Date(b.createdDate) - new Date(a.createdDate);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Translation Feed</h1>
        {!user && (
          <p className="text-slate-600 mt-2 sm:mt-0">
            Sign in to like, comment, and bookmark translations
          </p>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search translations, books, or context..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            onClick={() => setSortBy('recent')}
            size="sm"
          >
            Recent
          </Button>
          <Button
            variant={sortBy === 'popular' ? 'default' : 'outline'}
            onClick={() => setSortBy('popular')}
            size="sm"
          >
            Popular
          </Button>
          <Button
            variant={sortBy === 'discussed' ? 'default' : 'outline'}
            onClick={() => setSortBy('discussed')}
            size="sm"
          >
            Most Discussed
          </Button>
        </div>
      </div>

      {/* Translations List */}
      <div className="space-y-4">
        {sortedTranslations.map((translation) => (
          <Card key={translation.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-800">
                    {translation.bookTitle}
                  </CardTitle>
                  <p className="text-sm text-slate-600">
                    by {translation.author} • {translation.context}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {translation.sourceLanguage} → {translation.targetLanguage}
                  </p>
                </div>
                <div className="flex gap-1">
                  {translation.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-700 mb-2">Original</h4>
                  <p className="text-slate-900">{translation.originalText}</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <h4 className="font-medium text-teal-700 mb-2">Translation</h4>
                  <p className="text-teal-900">{translation.translatedText}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-red-600"
                    disabled={!user}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {translation.likesCount}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-blue-600"
                    disabled={!user}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {translation.commentsCount}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-yellow-600"
                    disabled={!user}
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-slate-500">
                  by {translation.createdBy} • {translation.createdDate}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedTranslations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No translations found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Feed;