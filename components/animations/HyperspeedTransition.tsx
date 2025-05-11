'use client';
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

export function HyperspeedTransition({ onComplete = () => {} }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [loadingTarget, setLoadingTarget] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  
  console.log('🚀 HyperspeedTransition component mounted/rendered');

  // State for tracking minimum animation time
  const [minAnimationTimeComplete, setMinAnimationTimeComplete] = useState(false);
  
  // Use ref for the complete animation function so we can redefine it later
  const completeAnimationRef = useRef<() => void>(() => {
    console.log('Animation complete called, but implementation not yet assigned');
  });

  // Function to preload the destination page
  const preloadDestination = async () => {
    try {
      setLoadingTarget(true);
      console.log('🚀 Preloading dashboard page...');
      
      // Make a fetch request to the dashboard to warm up the cache
      const response = await fetch('/dashboard');
      await response.text();
      
      console.log('🚀 Dashboard page preloaded successfully');
      return true;
    } catch (err) {
      console.error('🚀 Error preloading dashboard:', err);
      return false;
    }
  };
  
  // Function to check if both conditions are met to complete the animation
  const checkIfShouldComplete = useCallback(() => {
    // Only complete if both the min animation time is done and page is preloaded
    if (minAnimationTimeComplete && loadingTarget) {
      completeAnimationRef.current();
    }
  }, [minAnimationTimeComplete, loadingTarget]);

  // Watch for loading target state changes
  useEffect(() => {
    if (loadingTarget && minAnimationTimeComplete) {
      checkIfShouldComplete();
    }
  }, [loadingTarget, minAnimationTimeComplete, checkIfShouldComplete]);

  useEffect(() => {
    console.log('🚀 HyperspeedTransition useEffect triggered');
    
    // Set a flag to prevent animation loops
    if (localStorage.getItem('hyperspeedAnimationCompleted')) {
      console.log('🚀 Animation already completed in this session, hiding component');
      setVisible(false);
      return;
    }
    
    // Start preloading the destination page immediately
    preloadDestination();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Play warp sound (with debugging and better error handling)
    try {
      console.log('🚀 Attempting to load audio file: /sfx/hyperdrive.wav');
      audioRef.current = new Audio("/sfx/hyperdrive.wav");
      audioRef.current.volume = 0.85;
      
      // Add event listeners for debugging
      audioRef.current.addEventListener('canplaythrough', () => {
        console.log('🚀 Audio loaded and ready to play');
      });
      
      audioRef.current.addEventListener('play', () => {
        console.log('🚀 Audio playback started');
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('🚀 Audio error:', e);
      });
      
      // Use a promise to handle audio play attempts
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('🚀 Audio playback initiated successfully');
          })
          .catch(err => {
            console.warn('🚀 Audio autoplay blocked by browser:', err);
            console.log('🚀 Will try to play audio after user interaction');
            
            // Try to play on first user interaction
            const attemptPlay = () => {
              audioRef.current?.play()
                .then(() => {
                  console.log('🚀 Audio playback started after user interaction');
                  document.removeEventListener('click', attemptPlay);
                  document.removeEventListener('keydown', attemptPlay);
                })
                .catch(e => console.error('🚀 Still could not play audio:', e));
            };
            
            document.addEventListener('click', attemptPlay, { once: true });
            document.addEventListener('keydown', attemptPlay, { once: true });
          });
      }
    } catch (err) {
      console.warn('🚀 Audio setup failed, animation will continue without sound:', err);
    }

    // Starfield effect
    const stars: { x: number; y: number; z: number }[] = [];
    const STAR_COUNT = 400;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
      });
    }

    let frameId: number;
    let speed = 5; // Start slow
    let maxSpeed = 40; // Maximum speed
    let acceleration = 0.3; // Acceleration rate
    
    const animate = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Gradually increase speed
      if (speed < maxSpeed) {
        speed += acceleration;
      }

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Draw a blue glow in the center when approaching max speed
      if (speed > maxSpeed / 2) {
        const glowRadius = 100 * (speed / maxSpeed);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
        gradient.addColorStop(0, "rgba(0, 204, 255, 0.8)");
        gradient.addColorStop(0.5, "rgba(0, 100, 255, 0.4)");
        gradient.addColorStop(1, "rgba(0, 50, 255, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const star of stars) {
        star.z -= speed;
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
        }

        const k = 128.0 / star.z;
        const x = star.x * k;
        const y = star.y * k;

        // Stars get bigger and brighter as they come closer
        const size = (1 - star.z / canvas.width) * 4;
        
        // Add trailing effect for faster stars
        if (speed > 15 && size > 1) {
          const tailLength = Math.min(20, size * 6);
          const gradient = ctx.createLinearGradient(
            x, y, 
            x - (x / (Math.abs(x) + 0.1)) * tailLength, 
            y - (y / (Math.abs(y) + 0.1)) * tailLength
          );
          gradient.addColorStop(0, "rgba(0, 204, 255, 0.85)");
          gradient.addColorStop(1, "rgba(0, 50, 255, 0)");
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = size;
          ctx.moveTo(x, y);
          ctx.lineTo(
            x - (x / (Math.abs(x) + 0.1)) * tailLength,
            y - (y / (Math.abs(y) + 0.1)) * tailLength
          );
          ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 204, 255, 0.85)";
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      frameId = requestAnimationFrame(animate);
    };

    animate();
    
    // Set a minimum time for the animation regardless of loading state
    const minAnimationTimer = setTimeout(() => {
      setMinAnimationTimeComplete(true);
      checkIfShouldComplete();
    }, 4000); // Minimum 4 seconds of animation
    
    // Define the actual animation completion function
    completeAnimationRef.current = () => {
      cancelAnimationFrame(frameId);
      
      // Add a final flash before ending
      const flashOverlay = document.createElement('div');
      flashOverlay.style.position = 'fixed';
      flashOverlay.style.inset = '0';
      flashOverlay.style.backgroundColor = 'white';
      flashOverlay.style.opacity = '0';
      flashOverlay.style.zIndex = '9999';
      flashOverlay.style.transition = 'opacity 0.3s ease-in-out';
      document.body.appendChild(flashOverlay);
      
      // Trigger flash effect
      setTimeout(() => {
        flashOverlay.style.opacity = '0.7';
        setTimeout(() => {
          flashOverlay.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(flashOverlay);
            
            console.log('🚀 Animation complete - hiding component and navigating');
            setVisible(false);
            
            // Set flag to prevent re-triggering the animation
            localStorage.setItem('hyperspeedAnimationCompleted', 'true');
            
            if (audioRef.current) {
              // Fade out audio over 0.5 seconds
              const fadeInterval = setInterval(() => {
                if (audioRef.current && audioRef.current.volume > 0.1) {
                  audioRef.current.volume -= 0.1;
                } else {
                  clearInterval(fadeInterval);
                  audioRef.current?.pause();
                }
              }, 50);
            }
            
            // Call the onComplete callback if provided
            onComplete();
            
            // Use default navigation if no callback provided
            if (onComplete === undefined) {
              try {
                console.log('🚀 Pushing to /dashboard route');
                router.push('/dashboard');
              } catch (e) {
                console.error('🚀 Error with router.push:', e);
                console.log('🚀 Using fallback window.location navigation');
                window.location.href = '/dashboard';
              }
            }
          }, 300);
        }, 200);
      }, 100);
    };

    return () => {
      console.log('🚀 Cleaning up HyperspeedTransition effect');
      cancelAnimationFrame(frameId);
      clearTimeout(minAnimationTimer);
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [router, onComplete, checkIfShouldComplete]);

  console.log('🚀 Rendering transition with visible =', visible);
  
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        zIndex: 9999,
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />

      {/* ENTERING VAULT Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3.5, delay: 0.4 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#00cfff",
          fontSize: "2.8rem",
          fontWeight: "bold",
          letterSpacing: "0.1em",
          textShadow: "0 0 20px #00cfff",
        }}
      >
        ENTERING VAULT
      </motion.div>
      
      {/* Loading indicator - shown during the final preload phase */}
      {loadingTarget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#00cfff",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
          }}
        >
          INITIALIZING QUANTUM SYSTEMS...
        </motion.div>
      )}
    </motion.div>
  );
} 