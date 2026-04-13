'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogAPI from '@/lib/api/blog';
import Link from 'next/link';
import Breadcrumb from '@/app/components/layout/Breadcrumb';

export default function BlogDetails() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlogDetails();
      fetchRecentBlogs();
    }
  }, [slug]);

  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const response = await BlogAPI.getBlogBySlug(slug);
      console.log('Blog details response:', response);
      
      // Handle different response formats
      let blogData = null;
      if (response.data && response.data.data) {
        // If using BlogResource (nested data)
        blogData = response.data.data;
      } else if (response.data) {
        // If direct response
        blogData = response.data;
      } else if (response.success && response.data) {
        blogData = response.data;
      }
      
      if (blogData) {
        setBlog(blogData);
      } else {
        console.error('No blog data found in response:', response);
        router.push('/404');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      if (error.message.includes('404') || error.response?.status === 404) {
        router.push('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBlogs = async () => {
    try {
      const response = await BlogAPI.getRecentBlogs(9);
      console.log('Recent blogs response:', response);
      
      // Handle different response formats
      let recentData = [];
      if (response.data && Array.isArray(response.data)) {
        recentData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        recentData = response.data.data;
      } else if (Array.isArray(response)) {
        recentData = response;
      }
      
      setRecentBlogs(recentData);
    } catch (error) {
      console.error('Error fetching recent blogs:', error);
      setRecentBlogs([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Blog post not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <article className="bg-white shadow-md p-6">
            {blog.banner && (
              <img
                src={blog.banner}
                alt={blog.title}
                className="w-full h-auto object-cover mb-6"
                onError={(e) => {
                  e.target.src = '/fallback-image.jpg';
                }}
              />
            )}
            
            <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              {blog.category && (
                <>
                  <span className="mx-2">•</span>
                  <Link href={`/blogs?categories=${blog.category.slug}`}>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition cursor-pointer">
                      {blog.category.category_name || blog.category.name}
                    </span>
                  </Link>
                </>
              )}
            </div>
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          </article>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md p-6 sticky top-8">
            <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
            <div className="space-y-4">
              {recentBlogs.filter(recent => recent.id !== blog.id).slice(0, 5).length === 0 ? (
                <p className="text-gray-500 text-sm">No recent posts found</p>
              ) : (
                recentBlogs.filter(recent => recent.id !== blog.id).slice(0, 5).map((recent) => (
                  <Link href={`/blogs/${recent.slug}`} key={recent.id}>
                    <div className="flex gap-3 hover:bg-gray-50 p-2 transition cursor-pointer">
                      {recent.banner && (
                        <img
                          src={recent.banner}
                          alt={recent.title}
                          className="w-16 h-16 object-cover"
                          onError={(e) => {
                            e.target.src = '/fallback-image.jpg';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold line-clamp-2 text-sm">
                          {recent.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(recent.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}