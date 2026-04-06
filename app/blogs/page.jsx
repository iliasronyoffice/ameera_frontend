'use client';

import { useState, useEffect } from 'react';
import BlogAPI from '@/lib/api/blog';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function BlogListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Get initial values from URL params if needed
  useEffect(() => {
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const categories = searchParams.get('categories');
    
    if (page) setCurrentPage(parseInt(page));
    if (search) setSearchTerm(search);
    if (categories) setSelectedCategories(categories.split(','));
  }, [searchParams]);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [currentPage, selectedCategories, searchTerm]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await BlogAPI.getAllBlogs({
        page: currentPage,
        perPage: 12,
        search: searchTerm,
        selectedCategories: selectedCategories,
      });
      
      setBlogs(response.data);
      setPagination(response.pagination);
      
      // Update URL with current filters
      const params = new URLSearchParams();
      if (currentPage > 1) params.set('page', currentPage);
      if (searchTerm) params.set('search', searchTerm);
      if (selectedCategories.length) params.set('categories', selectedCategories.join(','));
      
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
      router.replace(newUrl, { scroll: false });
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await BlogAPI.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryToggle = (categorySlug) => {
    setSelectedCategories(prev =>
      prev.includes(categorySlug)
        ? prev.filter(slug => slug !== categorySlug)
        : [...prev, categorySlug]
    );
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          {/* Search */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Search</h3>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blogs..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="hidden">Search</button>
            </form>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.slug)}
                    onChange={() => handleCategoryToggle(category.slug)}
                    className="mr-2 cursor-pointer"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="lg:w-3/4">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Link href={`/blogs/${blog.slug}`} key={blog.id}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      {blog.banner && (
                        <img
                          src={blog.banner}
                          alt={blog.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {blog.short_description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                          {blog.category && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {blog.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, pagination.last_page))].map((_, i) => {
                      let pageNum;
                      if (pagination.last_page <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.last_page - 2) {
                        pageNum = pagination.last_page - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 border rounded ${
                            currentPage === pageNum
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                    className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}