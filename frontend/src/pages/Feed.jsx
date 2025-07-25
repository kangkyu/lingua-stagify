import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Bookmark, Search, Users } from 'lucide-react';
import { translationService } from '@/lib/api';

const Feed = () => {
  const { user } = useAuth();
  const [translations, setTranslations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await translationService.getAllTranslations();
        setTranslations(data);
      } catch (err) {
        console.error('Failed to fetch translations:', err);
        setError('Failed to load translations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  const filteredTranslations = translations.filter(translation =>
    translation.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    translation.translatedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    translation.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group translations by book title, original text, and target language
  const groupedTranslations = filteredTranslations.reduce((groups, translation) => {
    const key = `${translation.bookTitle}|||${translation.originalText}|||${translation.targetLanguage}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(translation);
    return groups;
  }, {});

  // Convert grouped translations to sorted array
  const sortedTranslationGroups = Object.values(groupedTranslations)
    .map(group => {
      // Sort translations within each group
      const sortedGroup = [...group].sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            return b.likesCount - a.likesCount;
          case 'discussed':
            return b.commentsCount - a.commentsCount;
          default: // recent
            return new Date(b.createdDate) - new Date(a.createdDate);
        }
      });
      return sortedGroup;
    })
    .sort((a, b) => {
      // Sort groups by the best translation in each group
      const bestA = a[0];
      const bestB = b[0];
      switch (sortBy) {
        case 'popular':
          return bestB.likesCount - bestA.likesCount;
        case 'discussed':
          return bestB.commentsCount - bestA.commentsCount;
        default: // recent
          return new Date(bestB.createdDate) - new Date(bestA.createdDate);
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading translations...</p>
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

      {/* Translations List */}
      {!loading && !error && (
        <div className="space-y-6">
        {sortedTranslationGroups.map((translationGroup, groupIndex) => {
          const firstTranslation = translationGroup[0];
          const isGrouped = translationGroup.length > 1;

          return (
            <Card key={`group-${groupIndex}`} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      {firstTranslation.bookTitle}
                      {isGrouped && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                          <Users className="w-3 h-3" />
                          {translationGroup.length} translations
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-slate-600">
                      by {firstTranslation.author} • {firstTranslation.context}
                    </p>
                    {isGrouped && (
                      <p className="text-xs text-blue-600 mt-1">
                        Multiple {firstTranslation.targetLanguage} translations for comparison
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {firstTranslation.tags.map((tag) => (
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
                {/* Original Text */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-700 mb-2">Original Text ({firstTranslation.sourceLanguage})</h4>
                  <p className="text-slate-900 leading-relaxed">{firstTranslation.originalText}</p>
                </div>

                {/* Translations Grid */}
                <div className={`grid gap-4 ${
                  isGrouped
                    ? translationGroup.length === 2
                      ? 'md:grid-cols-2'
                      : 'md:grid-cols-2 lg:grid-cols-3'
                    : 'md:grid-cols-1'
                }`}>
                  {translationGroup.map((translation) => (
                    <div key={translation.id} className="space-y-3">
                      <div className="p-4 bg-teal-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-teal-700">
                            {isGrouped ? `Translation ${translationGroup.indexOf(translation) + 1}` : translation.targetLanguage}
                          </h4>
                          {isGrouped && (
                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                              <Heart className="w-3 h-3" />
                              <span>{translation.likesCount}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-teal-900 mb-3">{translation.translatedText}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-teal-200">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-red-600 h-6 px-2"
                              disabled={!user}
                            >
                              <Heart className="w-3 h-3 mr-1" />
                              {translation.likesCount}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-blue-600 h-6 px-2"
                              disabled={!user}
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {translation.commentsCount}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-yellow-600 h-6 px-1"
                              disabled={!user}
                            >
                              <Bookmark className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 px-1">
                        by {translation.createdBy} • {translation.createdDate}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}

      {!loading && !error && sortedTranslationGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No translations found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
