'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useSelector } from 'react-redux';
import { RootState } from "../app/GlobalRedux/store"

console.log('PROGRESS BAR IS LOADED')

function LinearBuffer() {
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const pageLoading = useSelector((state: RootState) => state.pageLoading.isLoading)



  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (!pageLoading) return;
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
   {pageLoading ? (
    <Box sx={{ width: '100%' }}>
    <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} color='secondary' />
  </Box>
   ): 
   null
   }

    </>
  );
}

export default LinearBuffer