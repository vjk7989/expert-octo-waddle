import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Server } from 'lucide-react';

interface NetworkStatusProps {
  activeNodes: number;
  uptime: string;
  taskCount: number;
  isConnected?: boolean;
}

export function NetworkStatus({ activeNodes, uptime, taskCount, isConnected = true }: NetworkStatusProps) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center space-x-3">
          <Server className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Active Nodes</h3>
        </div>
        <p className="mt-2 text-3xl font-bold text-gray-900">{activeNodes}</p>
        <p className="mt-1 text-sm text-gray-500">
          {isConnected ? 'Network connected' : 'Network offline'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Uptime</h3>
        </div>
        <p className="mt-2 text-3xl font-bold text-gray-900">{uptime}</p>
        <p className="mt-1 text-sm text-gray-500">Since last restart</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Tasks Completed</h3>
        </div>
        <p className="mt-2 text-3xl font-bold text-gray-900">{taskCount}</p>
        <p className="mt-1 text-sm text-gray-500">Total processed</p>
      </motion.div>
    </div>
  );
}