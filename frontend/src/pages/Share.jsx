import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { translationService, bookService } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Languages, Send, Sparkles } from 'lucide-react';

const Share = () => {
  const { user, sessionToken, idToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookId: '',
    originalText: '',
    translatedText: '',
    sourceLanguage: 'en', // Default source language
    targetLanguage: 'ko', // Default target language
    context: '',
    tags: []
  });
  const [books, setBooks] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await bookService.getAllBooks();
        setBooks(booksData);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    fetchBooks();
  }, []);

  if (!user) {
    return (
      <div className="text-center py-12">
        <Languages className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Sign in to Share Translations</h2>
        <p className="text-slate-500">You need to be signed in to create and share translations.</p>
      </div>
    );
  }

  const handleTranslate = async () => {
    if (!formData.originalText || !formData.targetLanguage) {
      alert('Please enter the original text and a target language.');
      return;
    }
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formData.originalText,
          targetLanguage: formData.targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setFormData({ ...formData, translatedText: data.translatedText });
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate text. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bookId) {
      alert('Please select a book for this translation.');
      return;
    }

    if (!idToken) {
      alert('You must be signed in to create a translation.');
      return;
    }

    setIsSubmitting(true);
    try {
      const translationData = {
        originalText: formData.originalText,
        translatedText: formData.translatedText,
        sourceLanguage: formData.sourceLanguage,
        targetLanguage: formData.targetLanguage,
        bookId: formData.bookId,
        context: formData.context || null
      };

      const result = await translationService.createTranslation(translationData, idToken);

      alert('Translation created successfully!');

      // Navigate to the book detail page or feed
      if (result.bookId) {
        navigate(`/books/${result.bookId}`);
      } else {
        navigate('/feed');
      }
    } catch (error) {
      console.error('Failed to create translation:', error);
      alert('Failed to create translation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                Select Book
              </label>
              <select
                value={formData.bookId}
                onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                disabled={isLoadingBooks}
              >
                <option value="">
                  {isLoadingBooks ? 'Loading books...' : 'Choose a book...'}
                </option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} - {book.author}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Source Language
                </label>
                <Input
                  value={formData.sourceLanguage}
                  onChange={(e) => setFormData({ ...formData, sourceLanguage: e.target.value })}
                  placeholder="e.g., en"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Language
                </label>
                <Input
                  value={formData.targetLanguage}
                  onChange={(e) => setFormData({ ...formData, targetLanguage: e.target.value })}
                  placeholder="e.g., es"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Original Text
              </label>
              <Textarea
                rows={3}
                value={formData.originalText}
                onChange={(e) => setFormData({ ...formData, originalText: e.target.value })}
                placeholder="Enter the original text..."
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  Translation
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="text-teal-600 hover:text-teal-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isTranslating ? 'Translating...' : 'Translate'}
                </Button>
              </div>
              <Textarea
                rows={3}
                value={formData.translatedText}
                onChange={(e) => setFormData({ ...formData, translatedText: e.target.value })}
                placeholder="Enter the translation or use the 'Translate' button..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Context (Optional)
              </label>
              <Input
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                placeholder="e.g., Chapter 3, Page 45"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600"
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Share Translation'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Share;
