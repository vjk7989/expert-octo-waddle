import { create } from 'zustand';
import { formatDistanceToNow } from 'date-fns';
import { createMockNodes } from './mockNodes';

export interface Node {
  id: string;
  status: 'active' | 'idle' | 'error';
  taskType: string;
  progress: number;
  lastAttempt?: string;
}

export interface Log {
  id: string;
  timestamp: string;
  nodeId: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface ComputeResult {
  type: 'hash' | 'prime';
  nodeId: string;
  timeElapsed: number;
  // Hash-specific fields
  plaintext?: string;
  hash?: string;
  // Prime-specific fields
  number?: number;
  isPrime?: boolean;
  divisor?: number;
}

interface NetworkState {
  nodes: Node[];
  logs: Log[];
  activeNodes: number;
  startTime: Date;
  taskCount: number;
  isConnected: boolean;
  currentResult: ComputeResult | null;
  isComputing: boolean;
  addLog: (log: Omit<Log, 'id' | 'timestamp'>) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  connect: () => void;
  submitTask: (taskType: string, config: any) => void;
  setResult: (result: ComputeResult | null) => void;
  setComputing: (status: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  nodes: createMockNodes(),
  logs: [],
  activeNodes: 0,
  startTime: new Date(),
  taskCount: 0,
  isConnected: true,
  currentResult: null,
  isComputing: false,

  addLog: (log) => {
    const newLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      logs: [newLog, ...state.logs].slice(0, 100),
    }));
  },

  updateNode: (nodeId, updates) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
      activeNodes: state.nodes.filter((node) => node.status === 'active').length,
    }));
  },

  connect: () => {
    const { addLog } = get();
    set({ isConnected: true });
    addLog({
      nodeId: 'system',
      message: 'Connected to local compute network',
      type: 'success',
    });
  },

  submitTask: (taskType, config) => {
    const { addLog } = get();
    set({ isComputing: true, currentResult: null });
    addLog({
      nodeId: 'system',
      message: `New ${taskType} task submitted`,
      type: 'info',
    });
    set((state) => ({ taskCount: state.taskCount + 1 }));
  },

  setResult: (result) => {
    set({ currentResult: result, isComputing: false });
  },

  setComputing: (status) => {
    set({ isComputing: status });
  },
}));