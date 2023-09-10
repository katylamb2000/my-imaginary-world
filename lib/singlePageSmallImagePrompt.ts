import openai from './chatgpt';

interface PageDetail {
 page?: string;
 backgroundImage?: string;
 characterCloseUp?: string;
 object?: string;
 wildCardImage?: string;
 [key: string]: string | undefined;
}

const singlPageSmallImageQuery = async (prompt: string) => {
    console.log("PROMPT PASSED", prompt);
   
    try {
      const res = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.9,
        top_p: 1,
        max_tokens: 1800,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
   

      const imageDescriptionsString = res.data.choices[0].text;

      if (!imageDescriptionsString) {
        throw new Error("Image descriptions are undefined");
      }
      
      const cleanedResponse = imageDescriptionsString
        .replace(/\n/g, '')
        .replace(/`/g, '"')
        .replace(/(\w+):/g, '"$1":')
        .replace(/: (\w+)/g, ': "$1"');
      const imageDescriptions = JSON.parse(cleanedResponse);
      
      if (!imageDescriptions) {
        throw new Error("Story is undefined");
      }
   
      return {
        success: true,
        message: "Image descriptions successfully generated.",
        data: { imageDescriptions }
    };
    
   
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
        console.error(`Error occurred while generating story: ${errorMessage}`);
        return {
          success: false,
          message: `Error occurred while generating story: ${errorMessage}`,
        };
      }
      
   
   
   };
   





export default singlPageSmallImageQuery;
