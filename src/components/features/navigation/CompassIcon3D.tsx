import React from 'react';

const CompassIcon3D = () => {
  return (
    <div className="group w-10 h-10 [transform-style:preserve-3d] transition-transform duration-200 ease-in-out hover:[transform:rotateY(8deg)_rotateX(8deg)]">
      <div className="relative w-full h-full">
        <div className="absolute w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 [transform:translateZ(-2px)]"></div>
        <div className="absolute w-full h-full rounded-full border-2 border-gray-400 dark:border-gray-500"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 bg-red-500 rounded-full [transform:translateZ(2px)]"></div>
        <div
          className="absolute top-0 left-1/2 w-0.5 h-2 -ml-px bg-gray-500 dark:bg-gray-400"
          style={{ transformOrigin: 'bottom center', transform: 'rotate(0deg) translateY(-14px)' }}
        ></div>
        <div
          className="absolute top-1/2 right-0 h-0.5 w-2 -mt-px bg-gray-500 dark:bg-gray-400"
          style={{ transformOrigin: 'center left', transform: 'rotate(90deg) translateX(14px)' }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-0.5 h-2 -ml-px bg-gray-500 dark:bg-gray-400"
          style={{ transformOrigin: 'top center', transform: 'rotate(180deg) translateY(14px)' }}
        ></div>
        <div
          className="absolute top-1/2 left-0 h-0.5 w-2 -mt-px bg-gray-500 dark:bg-gray-400"
          style={{ transformOrigin: 'center right', transform: 'rotate(270deg) translateX(-14px)' }}
        ></div>
      </div>
    </div>
  );
};

export default CompassIcon3D;
