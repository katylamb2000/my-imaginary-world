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