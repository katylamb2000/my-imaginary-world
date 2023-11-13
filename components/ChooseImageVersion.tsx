import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import axios from "axios";

function ChooseImageVersion() {
    const { data: session } = useSession()
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const buttonMsgId = useSelector((state: RootState) => state.pageToEdit.buttonMsgId)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)

    const buttonClicked = async(button: string) => {
      console.log("PAGE ID", pageId)
        try {
          var data = JSON.stringify({
            button: button,
            buttonMessageId: buttonMsgId,
            ref: { storyId: storyId, userId: session!.user!.email, action: 'imagine', page: 'page_1', },
            webhookOverride: ""
          });
      
          const config = {
            method: 'post',
            url: 'https://api.thenextleg.io/api',
            headers: {
              Authorization: `Bearer ${process.env.next_leg_api_token}`,
              'Content-Type': 'application/json'
            },
            data: data,
          };
      
          const response = await axios(config);

        } catch (error) {
          console.log(error);
        }
       }

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg h-full w-full">
    <p className="text-xl font-semibold mb-4">Which version of the front cover image do you like?</p>

    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center justify-center rounded-md bg-purple-500 hover:bg-purple-400 transition-colors duration-200 h-20">
        <button onClick={() => buttonClicked('U1')} className="text-white font-semibold text-lg">Version 1</button>
      </div>
      <div   className="flex flex-col items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-400 transition-colors duration-200 h-20">
        <button onClick={() => buttonClicked('U2')} className="text-white font-semibold text-lg">Version 2</button>
      </div>
      <div className="flex flex-col items-center justify-center rounded-md bg-blue-500 hover:bg-blue-400 transition-colors duration-200 h-20">
        <button onClick={() => buttonClicked('U3')} className="text-white font-semibold text-lg">Version 3</button>
      </div>
      <div className="flex flex-col items-center justify-center rounded-md bg-green-500 hover:bg-green-400 transition-colors duration-200 h-20">
        <button onClick={() => buttonClicked('U4')} className="text-white font-semibold text-lg">Version 4</button>
      </div>
    </div>
  </div>
  )
}

export default ChooseImageVersion