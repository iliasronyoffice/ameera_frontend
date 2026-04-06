const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://your-laravel-app.com/api';

class BlogAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}/blogs`;
  }

  async fetchWithErrorHandling(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getAllBlogs({ page = 1, perPage = 12, search = '', selectedCategories = [] } = {}) {
    const params = new URLSearchParams({
      page,
      per_page: perPage,
      ...(search && { search }),
      ...(selectedCategories.length > 0 && { selected_categories: JSON.stringify(selectedCategories) }),
    });

    return this.fetchWithErrorHandling(`${this.baseURL}?${params}`);
  }

  async getBlogBySlug(slug) {
    return this.fetchWithErrorHandling(`${this.baseURL}/${slug}`);
  }

  async getRecentBlogs(limit = 9) {
    return this.fetchWithErrorHandling(`${this.baseURL}/recent?limit=${limit}`);
  }

  async getAllCategories() {
    return this.fetchWithErrorHandling(`${this.baseURL}/categories`);
  }

  async getBlogsByCategory(categorySlug, { page = 1, perPage = 12 } = {}) {
    const params = new URLSearchParams({
      page,
      per_page: perPage,
    });
    return this.fetchWithErrorHandling(`${this.baseURL}/category/${categorySlug}?${params}`);
  }

  async searchBlogs(query, { page = 1, perPage = 12 } = {}) {
    const params = new URLSearchParams({
      query,
      page,
      per_page: perPage,
    });
    return this.fetchWithErrorHandling(`${this.baseURL}/search?${params}`);
  }
}

export default new BlogAPI();