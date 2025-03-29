// src/context/ResourcePriorityContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ResourcePriority = 'critical' | 'high' | 'medium' | 'low';

interface ResourceInfo {
  id: string;
  src: string;
  type: 'image' | 'video' | 'background';
  priority: ResourcePriority;
  loaded: boolean;
  loading: boolean;
}

interface ResourcePriorityContextType {
  registerResource: (id: string, src: string, type: 'image' | 'video' | 'background', priority: ResourcePriority) => void;
  preloadResource: (id: string) => Promise<void>;
  isResourceLoaded: (id: string) => boolean;
  isResourceLoading: (id: string) => boolean;
  priorityMap: Map<string, ResourceInfo>;
}

const ResourcePriorityContext = createContext<ResourcePriorityContextType | undefined>(undefined);

// Maximum concurrent loads based on resource priorities
const MAX_CONCURRENT_LOADS = {
  critical: 4, // Load up to 4 critical resources at once
  high: 3,     // Load up to 3 high priority resources at once
  medium: 2,   // Load up to 2 medium priority resources at once
  low: 1       // Load only 1 low priority resource at once
};

export const ResourcePriorityProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [resources, setResources] = useState<Map<string, ResourceInfo>>(new Map());
  const [loadQueue, setLoadQueue] = useState<string[]>([]);
  const [currentLoads, setCurrentLoads] = useState<{[key in ResourcePriority]: number}>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  
  // Register a resource to be managed by the system
  const registerResource = useCallback((
    id: string, 
    src: string, 
    type: 'image' | 'video' | 'background', 
    priority: ResourcePriority
  ) => {
    setResources(prev => {
      // Don't re-register if already in the system
      if (prev.has(id)) return prev;
      
      const newMap = new Map(prev);
      newMap.set(id, { 
        id, 
        src, 
        type, 
        priority, 
        loaded: false, 
        loading: false 
      });
      
      // Add to queue based on priority
      if (priority === 'critical') {
        // Immediately preload critical resources
        setTimeout(() => preloadResource(id), 0);
      } else {
        setLoadQueue(queue => [...queue, id]);
      }
      
      return newMap;
    });
  }, []);
  
  // Process the queue based on priority
  const processQueue = useCallback(() => {
    // First, sort the queue by priority
    const sortedQueue = [...loadQueue].sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const resourceA = resources.get(a);
      const resourceB = resources.get(b);
      if (!resourceA || !resourceB) return 0;
      return priorityOrder[resourceB.priority] - priorityOrder[resourceA.priority];
    });
    
    // Then, start loading resources based on available slots
    const newQueue = [...sortedQueue];
    const newLoads = {...currentLoads};
    const toLoad: string[] = [];
    
    for (let i = 0; i < newQueue.length; i++) {
      const id = newQueue[i];
      const resource = resources.get(id);
      if (!resource || resource.loading || resource.loaded) continue;
      
      const priority = resource.priority;
      if (newLoads[priority] < MAX_CONCURRENT_LOADS[priority]) {
        // Remove from queue and add to loading
        newQueue.splice(i, 1);
        i--; // Adjust index after removal
        
        newLoads[priority]++;
        toLoad.push(id);
      }
    }
    
    // Update state
    setLoadQueue(newQueue);
    setCurrentLoads(newLoads);
    
    // Start loading the selected resources
    toLoad.forEach(id => {
      const resource = resources.get(id);
      if (!resource) return;
      
      // Mark as loading
      setResources(prev => {
        const newMap = new Map(prev);
        const res = newMap.get(id);
        if (res) {
          newMap.set(id, {...res, loading: true});
        }
        return newMap;
      });
      
      // Load the resource based on type
      if (resource.type === 'image') {
        const img = new Image();
        img.src = resource.src;
        img.onload = img.onerror = () => resourceLoaded(id, resource.priority);
      } else if (resource.type === 'video') {
        const video = document.createElement('video');
        video.src = resource.src;
        video.preload = 'auto';
        video.onloadeddata = video.onerror = () => resourceLoaded(id, resource.priority);
      } else if (resource.type === 'background') {
        // For background images, create an image object
        const img = new Image();
        img.src = resource.src;
        img.onload = img.onerror = () => resourceLoaded(id, resource.priority);
      }
    });
  }, [loadQueue, resources, currentLoads]);
  
  // Called when a resource finishes loading
  const resourceLoaded = useCallback((id: string, priority: ResourcePriority) => {
    // Mark as loaded
    setResources(prev => {
      const newMap = new Map(prev);
      const res = newMap.get(id);
      if (res) {
        newMap.set(id, {...res, loaded: true, loading: false});
      }
      return newMap;
    });
    
    // Decrement current loads for this priority
    setCurrentLoads(prev => ({
      ...prev,
      [priority]: Math.max(0, prev[priority] - 1)
    }));
    
    // Process the queue again
    setTimeout(processQueue, 0);
  }, [processQueue]);
  
  // Preload a specific resource by ID
  const preloadResource = useCallback((id: string): Promise<void> => {
    return new Promise((resolve) => {
      const resource = resources.get(id);
      if (!resource) {
        resolve(); // Resource not found, resolve immediately
        return;
      }
      
      // If already loaded, resolve immediately
      if (resource.loaded) {
        resolve();
        return;
      }
      
      // If already loading, wait for it to finish
      if (resource.loading) {
        const checkInterval = setInterval(() => {
          if (resources.get(id)?.loaded) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }
      
      // Start loading
      setResources(prev => {
        const newMap = new Map(prev);
        const res = newMap.get(id);
        if (res) {
          newMap.set(id, {...res, loading: true});
        }
        return newMap;
      });
      
      // Increment current loads for this priority
      setCurrentLoads(prev => ({
        ...prev,
        [resource.priority]: prev[resource.priority] + 1
      }));
      
      // Load based on resource type
      if (resource.type === 'image') {
        const img = new Image();
        img.onload = img.onerror = () => {
          resourceLoaded(id, resource.priority);
          resolve();
        };
        img.src = resource.src;
      } else if (resource.type === 'video') {
        const video = document.createElement('video');
        video.src = resource.src;
        video.preload = 'auto';
        video.onloadeddata = video.onerror = () => {
          resourceLoaded(id, resource.priority);
          resolve();
        };
      } else if (resource.type === 'background') {
        const img = new Image();
        img.onload = img.onerror = () => {
          resourceLoaded(id, resource.priority);
          resolve();
        };
        img.src = resource.src;
      }
    });
  }, [resources, resourceLoaded]);
  
  // Check if a resource is loaded
  const isResourceLoaded = useCallback((id: string): boolean => {
    return !!resources.get(id)?.loaded;
  }, [resources]);
  
  // Check if a resource is currently loading
  const isResourceLoading = useCallback((id: string): boolean => {
    return !!resources.get(id)?.loading;
  }, [resources]);
  
  // Process the queue whenever it changes
  useEffect(() => {
    if (loadQueue.length > 0) {
      processQueue();
    }
  }, [loadQueue, processQueue]);
  
  const value = {
    registerResource,
    preloadResource,
    isResourceLoaded,
    isResourceLoading,
    priorityMap: resources
  };
  
  return (
    <ResourcePriorityContext.Provider value={value}>
      {children}
    </ResourcePriorityContext.Provider>
  );
};

// Hook to use the resource priority context
export const useResourcePriority = () => {
  const context = useContext(ResourcePriorityContext);
  if (context === undefined) {
    throw new Error('useResourcePriority must be used within a ResourcePriorityProvider');
  }
  return context;
};