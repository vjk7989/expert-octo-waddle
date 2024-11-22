import React from 'react';
import { motion } from 'framer-motion';
import { Server, Activity } from 'lucide-react';
import type { Node } from '../lib/store';

export function NodeCard({ id, status, taskType, progress, lastAttempt }: Node) {
  const statusColor = {
    active: 'bg-green-100 text-green-800',
    idle: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800',
  }[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Server className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Node {id}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {status}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Task Type</span>
            <span>{taskType}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-indigo-600 h-2 rounded-full"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Last Attempt</span>
            <span className="font-mono">{lastAttempt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}