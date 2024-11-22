import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Calculator } from 'lucide-react';

interface TaskControlProps {
  onSubmit: (taskType: string, config: any) => void;
}

export function TaskControl({ onSubmit }: TaskControlProps) {
  const [taskType, setTaskType] = useState<'hash' | 'prime'>('hash');
  const [hashTarget, setHashTarget] = useState('');
  const [primeRange, setPrimeRange] = useState({ start: '', end: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskType === 'hash') {
      onSubmit('hash', {
        target: hashTarget,
        charset: 'abcdefghijklmnopqrstuvwxyz0123456789'.split(''),
      });
    } else {
      onSubmit('prime', {
        range: {
          start: parseInt(primeRange.start),
          end: parseInt(primeRange.end),
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Control</h3>

      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setTaskType('hash')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
              taskType === 'hash'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Hash className="w-5 h-5" />
            <span>Hash</span>
          </button>
          <button
            onClick={() => setTaskType('prime')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
              taskType === 'prime'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>Prime</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {taskType === 'hash' ? (
            <div>
              <label htmlFor="hashTarget" className="block text-sm font-medium text-gray-700">
                Target Hash (SHA-256)
              </label>
              <input
                type="text"
                id="hashTarget"
                value={hashTarget}
                onChange={(e) => setHashTarget(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter SHA-256 hash..."
                required
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="rangeStart" className="block text-sm font-medium text-gray-700">
                  Range Start
                </label>
                <input
                  type="number"
                  id="rangeStart"
                  value={primeRange.start}
                  onChange={(e) => setPrimeRange(prev => ({ ...prev, start: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor="rangeEnd" className="block text-sm font-medium text-gray-700">
                  Range End
                </label>
                <input
                  type="number"
                  id="rangeEnd"
                  value={primeRange.end}
                  onChange={(e) => setPrimeRange(prev => ({ ...prev, end: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Task
          </motion.button>
        </form>
      </div>
    </div>
  );
}