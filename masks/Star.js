import React from 'react';

function Star({ smallRoundImageUrl }) {

  return (
<div className="relative w-48 h-48">
  <svg width="0" height="0">
    <defs>
      <mask id="mask">
        <rect width="100%" height="100%" fill="red"/>
        <polygon points="50,1 60,40 99,40 70,60 80,99 50,70 20,99 30,60 1,40 40,40" fill="black"/>
      </mask>
    </defs>
  </svg>
  
  <img 
    src={smallRoundImageUrl} 
    className="absolute inset-0 w-full h-full object-cover"
    style={{WebkitMask: 'url(#mask)', mask: 'url(#mask)'}}
  />
</div>




  );
}

export default Star;
