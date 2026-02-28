/**
 * ========================================================================
 * REDUX SIGNUP FORM - COMPLETE IMPLEMENTATION GUIDE
 * ========================================================================
 * 
 * This file shows how to use the Redux signup slice for multi-step forms
 * with persistent state management.
 */

// ========================================================================
// 1. BASIC SETUP - How to import in your components
// ========================================================================

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateField,        // Update a single field
  updateFields,       // Update multiple fields at once
  nextStep,          // Move to next step
  prevStep,          // Move to previous step
  goToStep,          // Jump to specific step
  completeSignup,    // Mark form as complete
  resetSignupForm,   // Reset form to initial state
} from '../features/signup/signupSlice';

// ========================================================================
// 2. GET STATE FROM REDUX
// ========================================================================

export function ExampleComponent() {
  // Get entire signup state
  const signupState = useSelector(state => state.signup);

  // Or get specific fields
  const { firstName, email, currentStep, isFormComplete } = useSelector(
    state => state.signup
  );

  // Redux dispatch
  const dispatch = useDispatch();

  return (
    <div>
      {/* Render based on state */}
      Current Step: {currentStep} / 4
      Email: {email}
      Complete: {isFormComplete ? 'Yes' : 'No'}
    </div>
  );
}

// ========================================================================
// 3. UPDATE SINGLE FIELD - For form inputs
// ========================================================================

export function InputExample() {
  const dispatch = useDispatch();
  const { firstName } = useSelector(state => state.signup);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Dispatch updateField action
    dispatch(updateField({ 
      fieldName: name,  // "firstName", "email", "password", etc.
      value: value      // The new value
    }));
  };

  return (
    <div>
      <input
        name="firstName"
        value={firstName}
        onChange={handleInputChange}
        placeholder="Enter first name"
      />
      
      <input
        name="email"
        value={useSelector(state => state.signup.email)}
        onChange={handleInputChange}
        placeholder="Enter email"
      />
    </div>
  );
}

// ========================================================================
// 4. UPDATE MULTIPLE FIELDS AT ONCE
// ========================================================================

export function MultipleFieldsExample() {
  const dispatch = useDispatch();

  const handleFormData = (formObject) => {
    // All fields will be updated together
    dispatch(updateFields({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      age: 25,
      // Only include fields that exist in the Redux state
    }));
  };

  return (
    <button onClick={handleFormData}>
      Update Multiple Fields
    </button>
  );
}

// ========================================================================
// 5. NAVIGATION BETWEEN STEPS
// ========================================================================

export function StepNavigationExample() {
  const dispatch = useDispatch();
  const { currentStep, totalSteps } = useSelector(state => state.signup);

  return (
    <div>
      <p>Step {currentStep} of {totalSteps}</p>

      {/* Move to next step */}
      <button onClick={() => dispatch(nextStep())}>
        Next Step →
      </button>

      {/* Move to previous step */}
      <button onClick={() => dispatch(prevStep())}>
        ← Previous Step
      </button>

      {/* Jump to specific step (1-4) */}
      <button onClick={() => dispatch(goToStep(2))}>
        Go to Step 2
      </button>
    </div>
  );
}

// ========================================================================
// 6. MULTI-STEP FORM EXAMPLE
// ========================================================================

export function MultiStepFormExample() {
  const dispatch = useDispatch();
  const { currentStep, firstName, email, password, role } = useSelector(
    state => state.signup
  );

  const handleFieldChange = (fieldName, value) => {
    dispatch(updateField({ fieldName, value }));
  };

  const handleSubmit = () => {
    // Mark form as complete
    dispatch(completeSignup());
    
    // You can now get all the data from Redux and send to backend
    // or save to localStorage
    console.log('Form completed!');
  };

  return (
    <div>
      {currentStep === 1 && (
        <div>
          <h2>Step 1: Basic Information</h2>
          <input
            value={firstName}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            placeholder="First Name"
          />
          <input
            value={email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="Email"
            type="email"
          />
          <button onClick={() => dispatch(nextStep())}>Next</button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h2>Step 2: Password</h2>
          <input
            value={password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            placeholder="Password"
            type="password"
          />
          <button onClick={() => dispatch(nextStep())}>Next</button>
          <button onClick={() => dispatch(prevStep())}>Back</button>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h2>Step 3: Role</h2>
          <select
            value={role}
            onChange={(e) => handleFieldChange('role', e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
          </select>
          <button onClick={() => dispatch(nextStep())}>Next</button>
          <button onClick={() => dispatch(prevStep())}>Back</button>
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <h2>Step 4: Confirm</h2>
          <p>Review your information:</p>
          <p>Name: {firstName}</p>
          <p>Email: {email}</p>
          <p>Role: {role}</p>
          <button onClick={handleSubmit}>Complete Sign Up</button>
          <button onClick={() => dispatch(prevStep())}>Back</button>
        </div>
      )}
    </div>
  );
}

// ========================================================================
// 7. FORM PERSISTENCE - Data survives page navigation
// ========================================================================

/**
 * KEY FEATURE: State Persistence
 * 
 * Because Redux is global state, your signup form data persists:
 * - Across page navigation
 * - Until the user explicitly clears it
 * - Without needing localStorage (though you can also use localStorage)
 * 
 * Example:
 * User fills out Step 1 → navigates to another page → comes back
 * All Step 1 data is still in Redux!
 */

export function PersistenceExample() {
  const dispatch = useDispatch();
  const signupData = useSelector(state => state.signup);

  // When user submits the entire form
  const handleCompleteSignup = () => {
    // Save to localStorage for browser persistence
    localStorage.setItem('signupData', JSON.stringify(signupData));
    
    // Mark as complete
    dispatch(completeSignup());
  };

  return <button onClick={handleCompleteSignup}>Save & Complete</button>;
}

// ========================================================================
// 8. RESETTING THE FORM
// ========================================================================

export function ResetFormExample() {
  const dispatch = useDispatch();

  const handleReset = () => {
    // Clears all signup data and resets to step 1
    dispatch(resetSignupForm());
  };

  return (
    <button onClick={handleReset}>
      Clear Everything & Start Over
    </button>
  );
}

// ========================================================================
// 9. CONDITIONAL RENDERING BASED ON FORM STATE
// ========================================================================

export function ConditionalRenderingExample() {
  const { currentStep, firstName, email, role, isFormComplete } = useSelector(
    state => state.signup
  );

  if (isFormComplete) {
    return <div>✅ Signup complete!</div>;
  }

  if (!firstName || !email) {
    return <div>❌ Please fill in basic info (Step 1)</div>;
  }

  if (!role) {
    return <div>❌ Please select a role (Step 3)</div>;
  }

  return <div>✓ Form is valid</div>;
}

// ========================================================================
// 10. WORKING WITH FORM VALIDATION
// ========================================================================

export function FormValidationExample() {
  const dispatch = useDispatch();
  const { firstName, email, password } = useSelector(state => state.signup);

  const validateStep1 = () => {
    if (!firstName.trim()) {
      alert('First name is required');
      return false;
    }
    if (!email.includes('@')) {
      alert('Valid email is required');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      dispatch(nextStep());
    }
  };

  return (
    <button onClick={handleNext}>
      Next (with validation)
    </button>
  );
}

// ========================================================================
// 11. READING ALL FORM DATA AT ONCE
// ========================================================================

export function ReadAllDataExample() {
  const dispatch = useDispatch();
  const signupState = useSelector(state => state.signup);

  const formData = {
    firstName: signupState.firstName,
    lastName: signupState.lastName,
    email: signupState.email,
    password: signupState.password,
    age: signupState.age,
    role: signupState.role,
    experience: signupState.experience,
    goal: signupState.goal,
    bio: signupState.bio,
  };

  const handleSubmit = async () => {
    console.log('Submitting form data:', formData);
    
    // Send to backend
    // const response = await fetch('/api/signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
  };

  return <button onClick={handleSubmit}>Submit to Server</button>;
}

// ========================================================================
// REDUX STATE STRUCTURE
// ========================================================================

/**
 * Current Redux state structure:
 * 
 * {
 *   signup: {
 *     // Step 1 fields
 *     firstName: "",
 *     lastName: "",
 *     email: "",
 *     password: "",
 *     age: "",
 *     
 *     // Step 2-4 fields
 *     role: "",
 *     experience: "",
 *     goal: "",
 *     bio: "",
 *     
 *     // Progress tracking
 *     currentStep: 1,
 *     totalSteps: 4,
 *     isFormComplete: false,
 *   }
 * }
 */

// ========================================================================
// BEST PRACTICES
// ========================================================================

/**
 * ✓ DO:
 * - Use updateField() for single input changes
 * - Use updateFields() when you need to update multiple fields
 * - Use nextStep/prevStep for navigation
 * - Validate before moving to next step
 * - Clear form data when user logs out
 * - Use Redux DevTools to debug state changes
 * 
 * ✗ DON'T:
 * - Don't use useState for form fields that should persist
 * - Don't forget to validate before submission
 * - Don't mix Redux state with local component state for the same data
 * - Don't forget to clear sensitive data (passwords) when storing
 */

// ========================================================================
// QUICK REFERENCE - MOST USED PATTERNS
// ========================================================================

export function QuickReference() {
  const dispatch = useDispatch();
  const signupData = useSelector(state => state.signup);

  return (
    <div>
      {/* 1. Update input */}
      <input
        onChange={(e) => dispatch(updateField({ 
          fieldName: 'firstName', 
          value: e.target.value 
        }))}
        value={signupData.firstName}
      />

      {/* 2. Move to next step */}
      <button onClick={() => dispatch(nextStep())}>Next</button>

      {/* 3. Submit form */}
      <button onClick={() => dispatch(completeSignup())}>
        Submit
      </button>

      {/* 4. Get all data */}
      <pre>{JSON.stringify(signupData, null, 2)}</pre>
    </div>
  );
}

export default QuickReference;
