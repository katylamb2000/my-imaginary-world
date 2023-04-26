import { useDispatch } from "react-redux";
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { setCharacterId } from '../app/GlobalRedux/Features/viewCharacterSlice'
import Image from "next/image";

type Character = {
    id: string;
    name: string;
    heroImage: string
    // Add other properties as needed
  };
  
  type CharacterScrollBarProps = {
    characters: Character[];
  };

  function CharacterScrollBar({ characters }: CharacterScrollBarProps) {
    const dispatch = useDispatch()
    const goToCharacterProfile = (id: string) => {
      dispatch(setName('hero'))
      dispatch(setCharacterId(id))
    }

    return (
    <div className='max-w-2xl mx-auto flex p-4 space-x-4 overflow-x-scroll'>
        {characters.map(character => (
            <div 
                key={character.id}
                onClick={() => goToCharacterProfile(character.id)}
                className='p-4 rounded-full cursor-pointer hover:shadow-2xl'>
                {character.heroImage && (
                   <Image src={character.heroImage} width={24} height={24} alt='/' className="mx-auto" />
                )}
           
                <p>{character.name}</p>
            </div>
        ))}
    </div>
  )
}

export default CharacterScrollBar