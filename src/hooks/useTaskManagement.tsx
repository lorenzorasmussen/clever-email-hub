
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  content: string | null;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  tags: string[];
  category: string;
  assignedTo: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data for demo - in production this would connect to your backend
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Q4 Marketing Strategy Review',
    content: 'Review and analyze Q4 marketing performance metrics',
    isCompleted: false,
    priority: 'high',
    dueDate: '2024-01-15',
    tags: ['marketing', 'review', 'quarterly'],
    category: 'Business',
    assignedTo: ['user1'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Update project documentation',
    content: 'Ensure all project docs are up to date',
    isCompleted: true,
    priority: 'medium',
    dueDate: '2024-01-10',
    tags: ['documentation', 'project'],
    category: 'Development',
    assignedTo: ['user1'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created'>('dueDate');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.content && task.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const createTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || 'Untitled Task',
      content: taskData.content || null,
      isCompleted: false,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      category: taskData.category || 'General',
      assignedTo: taskData.assignedTo || ['user1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Success",
      description: "Task created successfully",
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
    toast({
      title: "Success",
      description: "Task updated successfully",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const exportTasks = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(tasks, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'tasks.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else if (format === 'csv') {
      const csvContent = [
        'Title,Content,Status,Priority,Due Date,Tags,Category',
        ...tasks.map(task => [
          task.title,
          task.content || '',
          task.isCompleted ? 'Completed' : 'Pending',
          task.priority,
          task.dueDate || '',
          task.tags.join(';'),
          task.category
        ].map(field => `"${field}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tasks.csv';
      link.click();
    }
  };

  const getProductivityMetrics = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted
    ).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      completionRate,
      pendingTasks: totalTasks - completedTasks
    };
  };

  return {
    tasks: sortedTasks,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    createTask,
    updateTask,
    deleteTask,
    exportTasks,
    getProductivityMetrics
  };
};
