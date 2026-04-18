"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export default function useCachedFetch(url, cacheKey, cacheDuration = 6 * 60 * 1000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const fetchInProgress = useRef(false);
  const hasLoadedFromCache = useRef(false);

  const loadFromCache = useCallback(() => {
    try {
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTime = Number(localStorage.getItem(`${cacheKey}_time`));
      const now = Date.now();

      if (cachedData && cachedTime && now - cachedTime < cacheDuration) {
        const parsedData = JSON.parse(cachedData);
        if (isMounted.current && !hasLoadedFromCache.current) {
          hasLoadedFromCache.current = true;
          setData(parsedData);
          setLoading(false);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Cache read error:", err);
      return false;
    }
  }, [cacheKey, cacheDuration]);

  useEffect(() => {
    isMounted.current = true;
    hasLoadedFromCache.current = false;
    
    const fetchData = async () => {
      if (fetchInProgress.current) return;
      fetchInProgress.current = true;

      try {
        // Try cache first - this won't trigger re-render loop now
        const cacheValid = loadFromCache();
        
        if (cacheValid) {
          // Still fetch in background to update cache, but don't block UI
          fetchInBackground();
          fetchInProgress.current = false;
          return;
        }

        // No valid cache, fetch fresh data
        if (isMounted.current) {
          setLoading(true);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        
        if (isMounted.current) {
          if (json.success === true) {
            const responseData = json.data || [];
            setData(responseData);
            setError(null);
            
            // Cache the data
            try {
              localStorage.setItem(cacheKey, JSON.stringify(responseData));
              localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
            } catch (storageError) {
              console.error("Storage error:", storageError);
            }
          } else {
            setError(json.message || "Failed to fetch data");
            // Try to serve stale cache if available
            const staleCache = localStorage.getItem(cacheKey);
            if (staleCache) {
              setData(JSON.parse(staleCache));
            }
          }
        }
      } catch (err) {
        if (isMounted.current && err.name !== 'AbortError') {
          console.error("Fetch error:", err);
          setError(err.message);
          
          // Fallback to any cached data (even if expired)
          try {
            const anyCache = localStorage.getItem(cacheKey);
            if (anyCache) {
              setData(JSON.parse(anyCache));
            }
          } catch (cacheError) {
            console.error("Cache fallback error:", cacheError);
          }
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
        fetchInProgress.current = false;
      }
    };

    const fetchInBackground = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok && isMounted.current) {
          const json = await response.json();
          if (json.success === true) {
            const responseData = json.data || [];
            setData(responseData);
            
            localStorage.setItem(cacheKey, JSON.stringify(responseData));
            localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
          }
        }
      } catch (err) {
        // Silently fail background refresh
        console.debug("Background refresh failed:", err);
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
      fetchInProgress.current = false;
    };
  }, [url, cacheKey, cacheDuration, loadFromCache]);

  return { data, loading, error };
}