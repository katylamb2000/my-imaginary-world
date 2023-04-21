
import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import path from "path";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('WE ARE IN RUN AUTOMATION!!!')
  if (req.method === "POST") {

    const { storyId } = req.body 
    // Fetch the prompts from Firestore
    const promptsCollection = collection(db, "imagePrompts", storyId, 'pages' );
    // const promptsQuery = query(promptsCollection, where("active", "==", true));
    const promptsQuery = query(promptsCollection)
    const promptsSnapshot = await getDocs(promptsQuery);
    const prompts = promptsSnapshot.docs.map(doc => doc.data().imagePrompt);
    // console.log('PROMPTS ====>', prompts)
    // Run the Python script with fetched prompts
    const pythonScriptPath = path.join(process.cwd(), "scripts", "image_generation.py");
    const promptsArgs = prompts.map(prompt => `"${prompt}"`).join(" ");
    const storyIdArg = `--storyId=${storyId}`;
    console.log('story id ====>', storyId)
    exec(`python3 ${pythonScriptPath} ${promptsArgs} --storyId=${storyId}`, {
      env: { ...process.env, STORY_ID: storyId },
    }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    res.status(200).json({ message: "Automation started", prompts });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}



