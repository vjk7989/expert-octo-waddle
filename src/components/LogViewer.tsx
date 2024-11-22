import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import type { Log } from '../lib/store';
import { formatDistanceToNow } from 'date-fns';

interface LogViewerProps {
  logs: Log[];
}

export function LogViewer({ logs }: LogViewerProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Terminal className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
        </div>
      </div>

      <div className="p-6 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 last:mb-0"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  log.type === 'success' ? 'bg-green-400' :
                  log.type === 'error' ? 'bg-red-400' :
                  'bg-blue-400'
                }`} />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      Node {log.nodeId}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{log.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}