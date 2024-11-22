const isPrime = (num: number): { isPrime: boolean; divisor?: number } => {
  if (num <= 1) return { isPrime: false, divisor: 1 };
  if (num <= 3) return { isPrime: true };
  if (num % 2 === 0) return { isPrime: false, divisor: 2 };
  if (num % 3 === 0) return { isPrime: false, divisor: 3 };

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0) return { isPrime: false, divisor: i };
    if (num % (i + 2) === 0) return { isPrime: false, divisor: i + 2 };
  }
  return { isPrime: true };
};

self.onmessage = async (e: MessageEvent) => {
  const { start, end } = e.data;
  const range = end - start;

  for (let num = start; num <= end; num++) {
    const result = isPrime(num);
    
    if (result.isPrime) {
      self.postMessage({
        complete: true,
        result: true,
        number: num,
        isPrime: true
      });
      return;
    }

    if (num % 1000 === 0) {
      self.postMessage({
        complete: false,
        progress: ((num - start) / range) * 100,
        lastAttempt: `Testing ${num}`,
      });
    }
  }

  self.postMessage({
    complete: true,
    result: true,
    number: end,
    isPrime: false,
    divisor: isPrime(end).divisor
  });
};