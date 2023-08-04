import React, { ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';

interface MessageFormProps {
    submit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>; // Changes here
    userMessage: string;
  setUserMessage: Dispatch<SetStateAction<string>>;
}

const MessageForm: React.FC<MessageFormProps> = ({ submit, userMessage, setUserMessage }) => {
  return (
    <form onSubmit={(e) => submit(e)} className="space-y-4 mt-4">
        <input 
        value={userMessage} 
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUserMessage(e.target.value)}
        className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" 
        placeholder="Your Message..." 
        />
        <button 
        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg" 
        type="submit"
        >
        Send Message
        </button>
    </form>
  );
}

export default MessageForm;
