import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Character {
  name: string;
  description: string;
}

interface CharacterState {
  characters: Character[];
}

const initialState: CharacterState = {
  characters: [],
};

export const characterSlice = createSlice({
  name: "character",
  initialState,
  reducers: {
    addCharacter: (state, action: PayloadAction<Character>) => {
      state.characters.push(action.payload);
    },
    addCharacters: (state, action: PayloadAction<Character[]>) => {
      state.characters.push(...action.payload);
  },
    updateCharacter: (state, action: PayloadAction<Character>) => {
      const index = state.characters.findIndex(
        (char) => char.name === action.payload.name
      );
      if (index !== -1) {
        state.characters[index] = action.payload;
      }
    },
    removeCharacter: (state, action: PayloadAction<string>) => {
      const index = state.characters.findIndex(
        (char) => char.name === action.payload
      );
      if (index !== -1) {
        state.characters.splice(index, 1);
      }
    },
  },
});

export const { addCharacter, addCharacters, updateCharacter, removeCharacter } =
  characterSlice.actions;

export default characterSlice.reducer;
