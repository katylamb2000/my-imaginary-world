import { useSelector } from "react-redux"
import { RootState } from "../app/GlobalRedux/store"

type ColorName = 'red' | 'yellow' | 'purple' | 'green';
interface Color { name: ColorName }

const colorMap: Record<ColorName, string> = {
    red: "bg-red-400 hover:bg-red-500 text-red-400",
    yellow: "bg-yellow-400 hover:bg-yellow-500 text-yellow-400",
    purple: "bg-purple-400 hover:bg-purple-500 text-purple-400",
    green: "bg-green-400 hover:bg-green-500 text-green-400",
};

function TextEditorHeader() {
    const pageId = useSelector((state: RootState) => state.pageToEdit.id )
    const fonts = 
    [
        {name: 'spooky', font: 'mystery'}, {name: 'futuristic', font: 'roboto'}, {name: 'caesar', font: 'caesar'},
        {name: 'quicksand', font: 'quicksand'}, {name: 'indieFlower', font: 'indieFlower'}, {name: 'amatic', font: 'amatic'},
        {name: 'patrickHand', font: 'patrickHand'}, {name: 'handlee', font: 'handlee'}, 
]

    const colors: Color[] = [{name: 'red'}, {name: 'yellow'}, {name: 'purple'}, {name: 'green'}]

    return (
        <header className='flex justify-between items-center p-3 pb-1' >
            <div className="flex-grow p-2">
                <h2 className="">{pageId}</h2>
                <div className="flex items-center text-sm space-x-1 -ml-1 h-8 text-gray-600">
                    {fonts.map((font, index) => (
                        <p key={index} className={`cursor-pointer hover:bg-gray-100 transition p-2 duration-200 ease-out rounded-lg font-${font.font}`}>{font.name}</p>
                    ))}
                </div>

                <div className="flex items-center text-sm space-x-1 -ml-1 h-8">
                    {colors.map((color, index) => (
                        <p key={index} className={`text-${colorMap[color.name]}-500 cursor-pointer transition p-2 duration-200 ease-out rounded-lg`}>{color.name}</p>
                    ))}
                </div>
            </div>
        </header>
    )
}

export default TextEditorHeader
