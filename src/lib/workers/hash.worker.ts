import SHA256 from 'crypto-js/sha256';

const generateCombinations = function* (charset: string[], length: number) {
  if (length === 0) {
    yield '';
    return;
  }

  for (const char of charset) {
    for (const rest of generateCombinations(charset, length - 1)) {
      yield char + rest;
    }
  }
};

self.onmessage = async (e: MessageEvent) => {
  const { target, charset, maxLength } = e.data;
  
  for (let len = 1; len <= maxLength; len++) {
    for (const attempt of generateCombinations(charset.split(''), len)) {
      const hash = SHA256(attempt).toString();
      
      if (hash === target) {
        self.postMessage({ found: true, value: attempt, hash });
        return;
      }

      // Report progress periodically
      if (Math.random() < 0.001) { // Report ~0.1% of attempts
        self.postMessage({ 
          found: false, 
          progress: (len / maxLength) * 100,
          lastAttempt: attempt 
        });
      }
    }
  }

  self.postMessage({ found: false, complete: true });
};