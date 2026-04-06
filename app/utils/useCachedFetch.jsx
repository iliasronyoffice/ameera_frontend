// "use client";
// import { useState, useEffect } from "react";

// export default function useCachedFetch(url, cacheKey, cacheDuration = 6 * 60 * 1000) {

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const now = Date.now();
//     const cachedData = localStorage.getItem(cacheKey);
//     const cachedTime = Number(localStorage.getItem(`${cacheKey}_time`));

//     // Use cached data if not expired
//     if (cachedData && cachedTime && now - cachedTime < cacheDuration) {
//       setData(JSON.parse(cachedData));
//       setLoading(false);
//     } else {
//       fetch(url)
//         .then((res) => res.json())
//         .then((json) => {
//           if (json.success) {
//             setData(json.data);
//             localStorage.setItem(cacheKey, JSON.stringify(json.data));
//             localStorage.setItem(`${cacheKey}_time`, now.toString());
//           } else {
//             setError("Invalid response");
//           }
//         })
//         .catch((err) => setError(err.message))
//         .finally(() => setLoading(false));
//     }
//   }, [url, cacheKey, cacheDuration]);

//   return { data, loading, error };
// }


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
          // console.log('Using cached data');
          setData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // console.log('Fetching fresh data from:', url);
        
        // Fetch new data
        const response = await fetch(url);
        
        // Check if response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        // console.log('API Response paisi:', json);
        
        // Check if the API request was successful
        if (json.success === true) {
          // The products are directly in json.data (array of products)
          const products = json.data || [];
          // console.log('Extracted products:', products);
          
          setData(products);
          
          // Cache the products array
          localStorage.setItem(cacheKey, JSON.stringify(products));
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
