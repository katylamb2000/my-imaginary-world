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
    <div className='max-w-2xl mx-auto flex p-4 space-x-4 overflow-x-scroll'>
        {characters.map(character => (
            <div 
                onClick={() => console.log(character.id)}
                className='w-24 h-24 bg-red-500 rounded-full cursor-pointer hover:bg-red-200'>
                <p>{character.name}</p>
            </div>
        ))}
    </div>
  )
}

export default CharacterScrollBar