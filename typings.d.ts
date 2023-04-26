import { ActionMatcherDescription } from "@reduxjs/toolkit/dist/createReducer";

interface Story {
    text: string;

}

interface StoryOutline {
    readersAge: number;
    setting: string;
    thingsToInclude: string;
    storyStyle: string;
}

interface Character {
    buttonMessageId: string;
    buttons: array;
    clothing: string;
    eyeColor: string;
    gender: string;
    hairColor: string;
    hairStyle: string;
    imageChoices: string;
    imagePrompt: string;
    name: string;
    skinColor: string;
    userId: string
}