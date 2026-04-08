"use client";
import { useState, useEffect } from "react";

export default function useCachedFetch(url, cacheKey, cacheDuration = 6 * 60 * 1000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = Date.now();
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = Number(localStorage.getItem(`${cacheKey}_time`));

        // Use cached data if not expired
        if (cachedData && cachedTime && now - cachedTime < cacheDuration) {
          setData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        console.log('Fetching fresh data from:', url);
        
        // Fetch new data with proper headers
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          // Important: Don't set cache headers that might conflict
          cache: 'no-cache',
        });
        
        // Check if response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        // Check content type before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON response but got: ${contentType}`);
        }

        const json = await response.json();
        
        // Check if the API request was successful
        if (json.success === true) {
          const categories = json.data || [];
          setData(categories);
          
          // Cache the data
          localStorage.setItem(cacheKey, JSON.stringify(categories));
          localStorage.setItem(`${cacheKey}_time`, now.toString());
        } else {
          setError(json.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, cacheKey, cacheDuration]);

  return { data, loading, error };
}