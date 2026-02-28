import { createSlice } from "@reduxjs/toolkit";

// Initial state for multi-step signup form
const initialState = {
  // Step 1: Basic Information
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  age: "",

  // Step 2: Onboarding - Role & Experience
  role: "", // "Étudiant", "Professionnel", "Entrepreneur", etc.
  experience: "", // "Débutant", "Intermédiaire", "Avancé"

  // Step 3: Goals
  goal: "", // User's main goal

  // Step 4: Bio
  bio: "", // User's bio

  // Form progress tracking
  currentStep: 1,
  totalSteps: 4,
  isFormComplete: false,
};

// Create the slice
const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    // Update a single field (works for any field name)
    updateField: (state, action) => {
      const { fieldName, value } = action.payload;
      state[fieldName] = value;
    },

    // Update multiple fields at once
    updateFields: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (key in state) {
          state[key] = action.payload[key];
        }
      });
    },

    // Move to next step
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },

    // Move to previous step
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },

    // Jump to specific step
    goToStep: (state, action) => {
      const step = action.payload;
      if (step >= 1 && step <= state.totalSteps) {
        state.currentStep = step;
      }
    },

    // Mark form as complete
    completeSignup: (state) => {
      state.isFormComplete = true;
    },

    // Reset form to initial state
    resetSignupForm: (state) => {
      return initialState;
    },

    // Get all form data (useful for debugging)
    getFormData: (state) => {
      return {
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        password: state.password,
        age: state.age,
        role: state.role,
        experience: state.experience,
        goal: state.goal,
        bio: state.bio,
      };
    },
  },
});

// Export actions
export const {
  updateField,
  updateFields,
  nextStep,
  prevStep,
  goToStep,
  completeSignup,
  resetSignupForm,
  getFormData,
} = signupSlice.actions;

// Export reducer
export default signupSlice.reducer;
