import React from 'react'

type Character = {
    id: string;
    name: string;
    // Add other properties as needed
  };
  
  type CharacterScrollBarProps = {
    characters: Character[];
  };

  function CharacterScrollBar({ characters }: CharacterScrollBarProps) {
    return (
    <div className='max-w-md bg-green flex p-4 space-x-4 overflow-x-scroll'>
        {characters.map(character => (
            <div className='w-12 h-12 bg-red-500 rounded-full'>
                <p>{character.name}</p>
            </div>
        ))}
    </div>
  )
}

export default CharacterScrollBar