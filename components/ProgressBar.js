'use client'
import React, { useState, useEffect } from 'react';

const ProgressBar = () => {
    const [progress, setProgress] = useState(0);
    const [start, setStart] = useState(false)

    useEffect(() => {
    
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);  // Stop the interval when progress is 100
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 600);
    
        return () => {
            clearInterval(interval);  // Clears the interval when component unmounts
        };
    }, []);
    

    useEffect(() => {
        console.log('progress', progress)
    }, [progress])

    return (
      <div className="fixed top-0 left-0 h-1 bg-purple-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
    );
}

export default ProgressBar;
