"use client";

import { useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import { Flip } from 'gsap/dist/Flip';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable, Flip);
}

export function useWheel(wheelRef: React.RefObject<HTMLDivElement>, imagesLength: number) {
  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel || typeof window === 'undefined') return;

    const setup = () => {
      const radius = wheel.offsetWidth / 2;
      const center = radius;
      const slice = 360 / imagesLength;
      const DEG2RAD = Math.PI / 180;

      const cards = wheel.querySelectorAll('[data-wheel-card]');
      
      cards.forEach((card, i) => {
        gsap.set(card, {
          x: center + radius * Math.sin(i * slice * DEG2RAD),
          y: center - radius * Math.cos(i * slice * DEG2RAD),
          rotation: i * slice,
          xPercent: -50,
          yPercent: -50
        });
      });
    };

    setup();
    window.addEventListener('resize', setup);

    // Create draggable instance
    const draggable = Draggable.create(wheel, {
      type: 'rotation',
      inertia: true,
      snap: {
        rotation: gsap.utils.snap(360 / imagesLength)
      }
    })[0];

    // Initial rotation animation
    // gsap.to(wheel, {
    //   rotation: -360,
    //   ease: 'none',
    //   duration: imagesLength,
    //   repeat: -1
    // });

    return () => {
      window.removeEventListener('resize', setup);
      draggable.kill();
    };
  }, [wheelRef, imagesLength]);
}