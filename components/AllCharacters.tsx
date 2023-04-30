import Image from 'next/image'
import { useDispatch } from 'react-redux';
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { setCharacterId } from '../app/GlobalRedux/Features/viewCharacterSlice'

interface Character {
    buttonMessageId: string;
    buttons: Array<any>;
    clothing: string;
    eyeColor: string;
    gender: string;
    hairColor: string;
    hairStyle: string;
    imageChoices: string;
    imagePrompt: string;
    name: string;
    skinColor: string;
    age: string;
    userId: string;
    id: string;
    heroImage: string;
  }
  
  type Props = {
      characters: Character[]
  };

function AllCharacters({ characters }: Props) {
    const dispatch = useDispatch()

    const goToCharacterPage = (id: string) => {
        dispatch(setName('hero'))
        dispatch(setCharacterId(id))
    }

  return (
    <div className='flex-1 bg-white'>
        <div>AllCharacters</div>
        <div className='grid grid-cols-5 '>
        {characters.map(character => (
            <div 
                onClick={() => goToCharacterPage(character.id)}
                className="hover:shadow-xl cursor-pointer rounded-full items-center text-center justify-center"> 
                {character.heroImage ? (
                <Image alt='' src={character.heroImage} width={100} height={100} className='mx-auto p-4 ' />
                ):
                <img src={`https://ui-avatars.com/api/?name=${name}`}
                className="h-12 w-12 rounded-full cursor-pointer mb-2 hover:opactiy-50"
                alt="Profile Pic"
          />
                } 
                <p>{character.name}</p>

            </div>
        ))}
        </div>
    </div>

  )
}

export default AllCharacters