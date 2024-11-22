import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import type { ComputeResult } from '../lib/store';

interface ResultDisplayProps {
  result: ComputeResult | null;
  isComputing: boolean;
}

export function ResultDisplay({ result, isComputing }: ResultDisplayProps) {
  if (!result && !isComputing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Computation Result</h3>
      
      {isComputing ? (
        <div className="flex items-center space-x-3 text-gray-600">
          <Clock className="w-5 h-5 animate-spin" />
          <span>Computing across nodes...</span>
        </div>
      ) : result?.type === 'hash' ? (
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
            <div>
              <p className="font-medium">Original Text</p>
              <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1">
                {result.plaintext}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
            <div>
              <p className="font-medium">Hash</p>
              <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1 break-all">
                {result.hash}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Found by Node {result.nodeId} in {result.timeElapsed}ms
          </p>
        </div>
      ) : result?.type === 'prime' ? (
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            {result.isPrime ? (
              <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 mt-1" />
            )}
            <div>
              <p className="font-medium">Number: {result.number}</p>
              <p className="text-sm text-gray-600 mt-1">
                {result.isPrime
                  ? 'Is a prime number'
                  : `Not prime (divisible by ${result.divisor})`}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Verified by Node {result.nodeId} in {result.timeElapsed}ms
          </p>
        </div>
      ) : null}
    </motion.div>
  );
}