import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { NetworkStatus } from './components/NetworkStatus';
import { TaskControl } from './components/TaskControl';
import { NodeCard } from './components/NodeCard';
import { LogViewer } from './components/LogViewer';
import { ResultDisplay } from './components/ResultDisplay';
import { LayoutGrid } from 'lucide-react';
import { useNetworkStore } from './lib/store';
import { useTask } from './hooks/useTask';
import { formatDistanceToNow } from 'date-fns';

function App() {
  const {
    nodes,
    logs,
    activeNodes,
    startTime,
    taskCount,
    connect,
    isConnected,
    currentResult,
    isComputing,
  } = useNetworkStore();
  const { startHashTask, startPrimeTask } = useTask();

  useEffect(() => {
    connect();
  }, [connect]);

  const handleTaskSubmit = (taskType: string, config: any) => {
    if (taskType === 'hash') {
      const charsetString = config.charset.join('');
      nodes.forEach((node, index) => {
        if (node.status === 'idle') {
          startHashTask(node.id, config.target, charsetString);
        }
      });
    } else if (taskType === 'prime') {
      const range = config.range.end - config.range.start;
      const chunkSize = Math.ceil(range / nodes.length);
      
      nodes.forEach((node, index) => {
        if (node.status === 'idle') {
          const start = config.range.start + (index * chunkSize);
          const end = Math.min(start + chunkSize, config.range.end);
          startPrimeTask(node.id, start, end);
        }
      });
    }
  };

  const uptime = formatDistanceToNow(startTime, { addSuffix: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <LayoutGrid className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Distributed Compute Dashboard</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <NetworkStatus
            activeNodes={activeNodes}
            uptime={uptime}
            taskCount={taskCount}
            isConnected={isConnected}
          />

          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-6">
              <TaskControl onSubmit={handleTaskSubmit} />
              <ResultDisplay result={currentResult} isComputing={isComputing} />
            </div>
            
            <div className="col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-6"
              >
                {nodes.map((node) => (
                  <NodeCard key={node.id} {...node} />
                ))}
              </motion.div>
            </div>
          </div>

          <LogViewer logs={logs} />
        </div>
      </main>
    </div>
  );
}

export default App;
