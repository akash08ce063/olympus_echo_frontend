"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  testRunId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification sound
const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fallback: create a simple beep sound
      const beep = new AudioContext();
      const oscillator = beep.createOscillator();
      const gainNode = beep.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(beep.destination);

      oscillator.frequency.setValueAtTime(800, beep.currentTime);
      oscillator.frequency.setValueAtTime(600, beep.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, beep.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, beep.currentTime + 0.3);

      oscillator.start(beep.currentTime);
      oscillator.stop(beep.currentTime + 0.3);
    });
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Test Suite Completed',
      message: 'Your test suite "Sales Objection Handling" has completed successfully with 8/10 tests passing.',
      type: 'success',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      testRunId: 'run-123'
    },
    {
      id: '2',
      title: 'Test Suite Failed',
      message: 'Test suite "Customer Support Flow" failed due to network timeout. 2/5 tests passed.',
      type: 'error',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      testRunId: 'run-124'
    },
    {
      id: '3',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will begin in 2 hours. Some features may be unavailable.',
      type: 'warning',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true
    },
    {
      id: '4',
      title: 'New Feature Available',
      message: 'Multi-agent testing is now available! Try it out with your existing test suites.',
      type: 'info',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Play sound for new notifications
    playNotificationSound();

    // Show toast notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
