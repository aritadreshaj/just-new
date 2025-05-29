import React from 'react';
import '@/styles/project-page.css';

interface NavigationArrowsProps {
  prevProjectUrl: string | null; // Updated to accept full URLs
  nextProjectUrl: string | null; // Updated to accept full URLs
}

const NavigationArrows: React.FC<NavigationArrowsProps> = ({ prevProjectUrl, nextProjectUrl }) => {
  // Detect if device is touch/mobile
  const [isTouch, setIsTouch] = React.useState(false);
  React.useEffect(() => {
    const checkTouch = () => setIsTouch(window.matchMedia('(max-width: 640px)').matches);
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Swipe gesture handling for mobile
  React.useEffect(() => {
    if (!isTouch) return;
    let touchStartX = 0;
    let touchEndX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (diff > 60 && prevProjectUrl) {
        window.location.href = prevProjectUrl;
      } else if (diff < -60 && nextProjectUrl) {
        window.location.href = nextProjectUrl;
      }
    };
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTouch, prevProjectUrl, nextProjectUrl]);

  return (
    <>
      {!isTouch && prevProjectUrl && (
        <div className="project-page-arrow project-page-arrow-right">
          <a href={prevProjectUrl}>
            <img src="/previous.png" alt="Previous" />
          </a>
        </div>
      )}
      {!isTouch && nextProjectUrl && (
        <div className="project-page-arrow project-page-arrow-left">
          <a href={nextProjectUrl}>
            <img src="/next.png" alt="Next" />
          </a>
        </div>
      )}
      {/* On mobile, swipe left/right to navigate. No visible arrows. */}
    </>
  );
};

export default NavigationArrows;