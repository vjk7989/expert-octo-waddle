import { useCallback, useRef } from 'react';
import { useNetworkStore } from '../lib/store';

export function useTask() {
  const workers = useRef<{ [key: string]: Worker }>({});
  const updateNode = useNetworkStore((state) => state.updateNode);
  const addLog = useNetworkStore((state) => state.addLog);
  const setResult = useNetworkStore((state) => state.setResult);
  const setComputing = useNetworkStore((state) => state.setComputing);

  const startHashTask = useCallback((nodeId: string, target: string, charset: string) => {
    const startTime = performance.now();
    const worker = new Worker(
      new URL('../lib/workers/hash.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e) => {
      if (e.data.found) {
        const timeElapsed = Math.round(performance.now() - startTime);
        setResult({
          type: 'hash',
          nodeId,
          timeElapsed,
          plaintext: e.data.value,
          hash: e.data.hash,
        });
        addLog({
          nodeId,
          message: `Found match: ${e.data.value} (${e.data.hash})`,
          type: 'success'
        });
        updateNode(nodeId, { status: 'idle', progress: 100 });
        worker.terminate();
      } else if (e.data.complete) {
        addLog({
          nodeId,
          message: 'Task completed - no match found',
          type: 'info'
        });
        updateNode(nodeId, { status: 'idle', progress: 100 });
        worker.terminate();
      } else {
        updateNode(nodeId, {
          progress: e.data.progress,
          lastAttempt: e.data.lastAttempt
        });
      }
    };

    workers.current[nodeId] = worker;
    worker.postMessage({ target, charset, maxLength: 8 });
    updateNode(nodeId, { status: 'active', progress: 0, taskType: 'SHA-256 Brute Force' });
    setComputing(true);
  }, [updateNode, addLog, setResult, setComputing]);

  const startPrimeTask = useCallback((nodeId: string, start: number, end: number) => {
    const startTime = performance.now();
    const worker = new Worker(
      new URL('../lib/workers/prime.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e) => {
      if (e.data.complete) {
        const timeElapsed = Math.round(performance.now() - startTime);
        if (e.data.result) {
          setResult({
            type: 'prime',
            nodeId,
            timeElapsed,
            number: e.data.number,
            isPrime: e.data.isPrime,
            divisor: e.data.divisor,
          });
        }
        addLog({
          nodeId,
          message: `Completed prime check for range ${start}-${end}`,
          type: 'success'
        });
        updateNode(nodeId, { status: 'idle', progress: 100 });
        worker.terminate();
      } else {
        updateNode(nodeId, {
          progress: e.data.progress,
          lastAttempt: e.data.lastAttempt
        });
      }
    };

    workers.current[nodeId] = worker;
    worker.postMessage({ start, end });
    updateNode(nodeId, { status: 'active', progress: 0, taskType: 'Prime Check' });
    setComputing(true);
  }, [updateNode, addLog, setResult, setComputing]);

  return { startHashTask, startPrimeTask };
}