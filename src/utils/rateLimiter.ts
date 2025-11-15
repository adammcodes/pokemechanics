import pLimit from 'p-limit';

// Limit concurrent API requests to local PokeAPI
// Adjust this number based on your server's capacity
const API_CONCURRENCY_LIMIT = 10;

// Create a shared limiter for all API requests
export const apiLimiter = pLimit(API_CONCURRENCY_LIMIT);
