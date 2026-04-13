'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import BlogAPI from '@/lib/api/blog';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Breadcrumb from '../components/layout/Breadcrumb';

export default function BlogListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  const isUpdatingFromURL = useRef(false);
  
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Get initial values from URL params (only once on mount)
  useEffect(() => {
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const categoriesParam = searchParams.get('categories');
    
    if (page) setCurrentPage(parseInt(page));
    if (search) setSearchTerm(search);
    if (categoriesParam) setSelectedCategories(categoriesParam.split(','));
    
    isInitialMount.current = false;
  }, []); // Empty dependency array - only run once

  // Fetch blogs when filters change
  useEffect(() => {
    if (isInitialMount.current) return;
    
    fetchBlogs();
  }, [currentPage, selectedCategories, searchTerm]);

  // Fetch categories only once
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await BlogAPI.getAllBlogs({
        page: currentPage,
        perPage: 12,
        search: searchTerm,
        selectedCategories: selectedCategories,
      });
      
      console.log('API Response:', response);
      
      // Set blogs data
      if (response.data && Array.isArray(response.data)) {
        setBlogs(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setBlogs(response.data.data);
      } else {
        setBlogs([]);
      }
      
      // Set pagination data
      if (response.pagination) {
        setPagination(response.pagination);
      }
      
      // Update URL with current filters (only if not already syncing from URL)
      if (!isUpdatingFromURL.current) {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set('page', currentPage);
        if (searchTerm) params.set('search', searchTerm);
        if (selectedCategories.length) params.set('categories', selectedCategories.join(','));
        
        const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
        const currentUrl = window.location.pathname + window.location.search;
        
        if (newUrl !== currentUrl) {
          router.replace(newUrl, { scroll: false });
        }
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
      isUpdatingFromURL.current = false;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await BlogAPI.getAllCategories();
      console.log('Categories response:', response);
      
      // Handle different response formats
      let categoriesData = [];
      if (Array.isArray(response)) {
        categoriesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleCategoryToggle = (categorySlug) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(categorySlug)
        ? prev.filter(slug => slug !== categorySlug)
        : [...prev, categorySlug];
      
      console.log('Category toggled:', categorySlug, 'New selection:', newSelection);
      return newSelection;
    });
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 md:px-10 py-10">
      <Breadcrumb />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/5">
          {/* Search */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Search</h3>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blogs..."
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <span>{category.category_name || category.name}</span>
                </label>
              ))}
            </div>
            {(selectedCategories.length > 0 || searchTerm) && (
              <button
                onClick={clearAllFilters}
                className="mt-4 text-sm text-red-600 hover:text-red-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="lg:w-4/5">
          {blogs.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found.</p>
              {(selectedCategories.length > 0 || searchTerm) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear filters to see all blogs
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Active filters display */}
              {(selectedCategories.length > 0 || searchTerm) && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Search: {searchTerm}
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setCurrentPage(1);
                        }}
                        className="ml-2 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedCategories.map(cat => {
                    const category = categories.find(c => c.slug === cat);
                    return (
                      <span key={cat} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {category?.category_name || cat}
                        <button
                          onClick={() => handleCategoryToggle(cat)}
                          className="ml-2 hover:text-green-600"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {blogs.map((blog) => (
                  <Link href={`/blogs/${blog.slug}`} key={blog.id}>
                    <div className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      {blog.banner && (
                        <img
                          src={blog.banner}
                          alt={blog.title}
                          className="w-full h-[450px] md:h-[300px] lg:h-[350px] 2xl:h-[400px] object-cover"
                          onError={(e) => {
                            e.target.src = '/fallback-image.jpg';
                          }}
                        />
                      )}
                      <div className="p-4 h-[200px] md:h-[175px]">
                        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {blog.short_description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                          {blog.category && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {blog.category.category_name || blog.category.name}
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