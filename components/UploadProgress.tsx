import React from 'react';

interface Props {
    progress: number;
}

const UploadProgress: React.FC<Props> = ({ progress }) => {
    console.log('this is progress ==> ', progress)
    return (
        <div>
            <div style={{ width: '100%', backgroundColor: '#eee' }}>
                <div style={{
                    height: '20px',
                    width: `${progress}%`,
                    backgroundColor: '#66f',
                    transition: 'width 0.2s'
                }} />
            </div>
            <p>{progress}%</p>
        </div>
    );
}

export default UploadProgress;
