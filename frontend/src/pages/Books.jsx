import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, BookOpen, Users } from 'lucide-react';
import { bookService } from '@/lib/api';

const Books = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookService.getAllBooks();
        setBooks(data);
      } catch (err) {
        console.error('Failed to fetch books:', err);
        setError('Failed to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Translation Books</h1>
        {user && (
          <Link to="/create-book">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Book
            </Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search books by title, author, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading books...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Books Grid */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Link key={book.id} to={`/books/${book.id}`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-slate-400" />
                  )}
                </div>
                <CardTitle className="text-lg">{book.title}</CardTitle>
                <p className="text-sm text-slate-600">by {book.author}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-700 line-clamp-2">
                  {book.description}
                </p>
                
                <div className="text-xs text-slate-500">
                  Language: {book.language}
                </div>

                <div className="flex gap-1 flex-wrap">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                    {book.language}
                  </span>
                  <span className="px-2 py-1 bg-teal-100 text-teal-600 rounded-md text-xs">
                    {book.translationsCount} translations
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <div className="flex items-center space-x-3">
                    <span>{book.translationsCount} translations</span>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {book.bookmarksCount} bookmarks
                    </div>
                  </div>
                  <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        </div>
      )}

      {!loading && !error && filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No books found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Books;
