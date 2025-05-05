
import React from "react";

// Simple text preprocessing
const preprocessText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/);
};

// Calculate word frequency
const getWordFrequency = (words) => {
  return words.reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1;
    return freq;
  }, {});
};

// Calculate cosine similarity between two texts
export const calculateSimilarity = (text1, text2) => {
  const words1 = preprocessText(text1);
  const words2 = preprocessText(text2);
  
  const freq1 = getWordFrequency(words1);
  const freq2 = getWordFrequency(words2);
  
  // Get all unique words
  const uniqueWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  
  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  uniqueWords.forEach(word => {
    const f1 = freq1[word] || 0;
    const f2 = freq2[word] || 0;
    
    dotProduct += f1 * f2;
    magnitude1 += f1 * f1;
    magnitude2 += f2 * f2;
  });
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  // Return cosine similarity
  return dotProduct / (magnitude1 * magnitude2);
};
