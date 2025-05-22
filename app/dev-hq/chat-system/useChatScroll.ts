'use client';

/**
 * Hook for managing chat scroll behavior
 * @dev-vault-component
 */

import { useRef, useEffect, useCallback } from 'react';

interface UseChatScrollOptions {
  /**
   * Whether to auto-scroll to bottom on new messages
   */
  autoScroll?: boolean;
  
  /**
   * Threshold in pixels from bottom to trigger auto-scroll
   */
  scrollThreshold?: number;
  
  /**
   * Whether to smooth scroll
   */
  smoothScroll?: boolean;
}

/**
 * Hook for managing chat scroll behavior
 * @param options - Configuration options
 * @returns Object with scroll utilities
 */
export function useChatScroll({
  autoScroll = true,
  scrollThreshold = 100,
  smoothScroll = true
}: UseChatScrollOptions = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);
  
  // Check if scroll is near bottom
  const checkIfNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    return distanceFromBottom <= scrollThreshold;
  }, [scrollThreshold]);
  
  // Scroll to bottom
  const scrollToBottom = useCallback((force = false) => {
    const container = containerRef.current;
    if (!container) return;
    
    // Only auto-scroll if we're already near the bottom or force is true
    if (force || isNearBottomRef.current) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smoothScroll ? 'smooth' : 'auto'
      });
    }
  }, [smoothScroll]);
  
  // Handle scroll events
  const handleScroll = useCallback(() => {
    isNearBottomRef.current = checkIfNearBottom();
  }, [checkIfNearBottom]);
  
  // Set up scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  // Auto-scroll when new messages are added
  useEffect(() => {
    if (!autoScroll) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Use MutationObserver to detect when new messages are added
    const observer = new MutationObserver(() => {
      scrollToBottom();
    });
    
    observer.observe(container, {
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
    };
  }, [autoScroll, scrollToBottom]);
  
  return {
    containerRef,
    scrollToBottom,
    isNearBottom: () => isNearBottomRef.current
  };
}
