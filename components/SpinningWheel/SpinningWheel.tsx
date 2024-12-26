"use client";

import { useRef } from 'react';
import { Flip } from 'gsap/dist/Flip';
import { useWheel } from './useWheel';
import { duplicatedImages } from './config';
import styles from './SpinningWheel.module.css';

export default function SpinningWheel() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const currentCardRef = useRef<HTMLDivElement | null>(null);

  useWheel(wheelRef, duplicatedImages.length);

  const closeCurrentCard = () => {
    if (currentCardRef.current && headerRef.current) {
      const img = headerRef.current.querySelector('img');
      if (img) {
        const state = Flip.getState(img);
        currentCardRef.current.appendChild(img);
        Flip.from(state, {
          ease: 'power1.inOut',
          scale: true
        });
        currentCardRef.current = null;
      }
    }
  };

  const onClickCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const image = card.querySelector('img');
    
    if (!image || !headerRef.current) return;

    if (card !== currentCardRef.current) {
      closeCurrentCard();
      currentCardRef.current = card;
      const state = Flip.getState(image);
      headerRef.current.appendChild(image);
      Flip.from(state, {
        duration: 0.6,
        scale: true,
        ease: 'power1.inOut'
      });
    } else {
      closeCurrentCard();
    }
  };

  return (
    <div className={styles.sliderContainer}>
      <div ref={headerRef} className={styles.header} onClick={closeCurrentCard} />
      <div className={styles.sliderSection}>
        <div ref={wheelRef} className={styles.wheel}>
          {duplicatedImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              data-wheel-card
              className={styles.wheel__card}
              onClick={onClickCard}
            >
              <img src={src} alt={`Gallery image ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}