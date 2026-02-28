/**
 * ========================================================================
 * COMPLETE WORKING EXAMPLE - Multi-Step Signup Form with Redux
 * ========================================================================
 * 
 * This is a COMPLETE, COPY-PASTE READY component that demonstrates
 * all Redux signup features in action.
 * 
 * You can use this as a template or reference for your own forms.
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateField,
  nextStep,
  prevStep,
  completeSignup,
  resetSignupForm,
} from '../features/signup/signupSlice';

/**
 * Complete Multi-Step Form Component
 * Demonstrates all Redux signup features
 */
function CompleteSignupFormExample() {
  const dispatch = useDispatch();

  // Get all needed data from Redux
  const {
    // Step 1 fields
    firstName,
    lastName,
    email,
    password,
    age,

    // Steps 2-4 fields
    role,
    experience,
    goal,
    bio,

    // Progress
    currentStep,
    totalSteps,
    isFormComplete,
  } = useSelector(state => state.signup);

  // Local state for validation errors and UI
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle field changes - dispatches to Redux
   * This is the main pattern to use for all inputs
   */
  const handleFieldChange = (fieldName, value) => {
    dispatch(updateField({ fieldName, value }));
    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };

  /**
   * Validate Step 1: Basic Information
   */
  const validateStep1 = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (age && (Number(age) < 17 || Number(age) > 120)) {
      newErrors.age = 'Please enter a valid age (17-120)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validate Step 2: Role Selection
   */
  const validateStep2 = () => {
    const newErrors = {};

    if (!role.trim()) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validate Step 3: Experience Selection
   */
  const validateStep3 = () => {
    const newErrors = {};

    if (!experience.trim()) {
      newErrors.experience = 'Please select your experience level';
    }

    if (!goal.trim()) {
      newErrors.goal = 'Please select your main goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validate Step 4: Bio
   */
  const validateStep4 = () => {
    const newErrors = {};

    if (!bio.trim()) {
      newErrors.bio = 'Please write a short bio';
    } else if (bio.trim().length < 10) {
      newErrors.bio = 'Bio should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle Next Button - Validate then move to next step
   */
  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();
    if (currentStep === 4) isValid = validateStep4();

    if (isValid) {
      dispatch(nextStep());
      setErrors({}); // Clear errors when moving forward
    }
  };

  /**
   * Handle Back Button
   */
  const handleBack = () => {
    dispatch(prevStep());
    setErrors({}); // Clear errors when going back
  };

  /**
   * Handle Form Submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the final step
    if (!validateStep4()) {
      return;
    }

    // Get all form data from Redux
    const fullFormData = {
      firstName,
      lastName,
      email,
      password,
      age,
      role,
      experience,
      goal,
      bio,
    };

    console.log('Form Submitted:', fullFormData);

    // Save to localStorage
    localStorage.setItem('signupData', JSON.stringify(fullFormData));

    // Mark form as complete in Redux
    dispatch(completeSignup());

    // Here you would normally send data to backend
    // const response = await fetch('/api/signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(fullFormData)
    // });

    alert('✅ Signup Complete! Check console for data.');
  };

  /**
   * Handle Reset Button
   */
  const handleReset = () => {
    if (window.confirm('Are you sure? This will clear all form data.')) {
      dispatch(resetSignupForm());
      setErrors({});
    }
  };

  // If form is complete, show success screen
  if (isFormComplete) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✅</div>
          <h2>Sign Up Complete!</h2>
          <p>Your account has been created successfully.</p>

          <div style={styles.summaryBox}>
            <h3>Account Details</h3>
            <p><strong>Name:</strong> {firstName} {lastName}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Role:</strong> {role}</p>
            <p><strong>Experience:</strong> {experience}</p>
            <p><strong>Goal:</strong> {goal}</p>
          </div>

          <button
            onClick={handleReset}
            style={{ ...styles.button, backgroundColor: '#6B46C1' }}
          >
            Start Another Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1>Create Your Account</h1>
          <p>Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(currentStep / totalSteps) * 100}%`,
            }}
          ></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div style={styles.step}>
              <h2>Basic Information</h2>

              {/* First Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) =>
                    handleFieldChange('firstName', e.target.value)
                  }
                  placeholder="John"
                  style={{
                    ...styles.input,
                    borderColor: errors.firstName ? '#EF4444' : '#D1D5DB',
                  }}
                />
                {errors.firstName && (
                  <span style={styles.error}>{errors.firstName}</span>
                )}
              </div>

              {/* Last Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) =>
                    handleFieldChange('lastName', e.target.value)
                  }
                  placeholder="Doe"
                  style={{
                    ...styles.input,
                    borderColor: errors.lastName ? '#EF4444' : '#D1D5DB',
                  }}
                />
                {errors.lastName && (
                  <span style={styles.error}>{errors.lastName}</span>
                )}
              </div>

              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="john@example.com"
                  style={{
                    ...styles.input,
                    borderColor: errors.email ? '#EF4444' : '#D1D5DB',
                  }}
                />
                {errors.email && (
                  <span style={styles.error}>{errors.email}</span>
                )}
              </div>

              {/* Password */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Password *</label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) =>
                      handleFieldChange('password', e.target.value)
                    }
                    placeholder="••••••"
                    style={{
                      ...styles.input,
                      borderColor: errors.password ? '#EF4444' : '#D1D5DB',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.togglePassword}
                  >
                    {showPassword ? '👁️ Hide' : '👁️ Show'}
                  </button>
                </div>
                {errors.password && (
                  <span style={styles.error}>{errors.password}</span>
                )}
              </div>

              {/* Age */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Age (optional)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => handleFieldChange('age', e.target.value)}
                  placeholder="25"
                  min="17"
                  max="120"
                  style={{
                    ...styles.input,
                    borderColor: errors.age ? '#EF4444' : '#D1D5DB',
                  }}
                />
                {errors.age && (
                  <span style={styles.error}>{errors.age}</span>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Role Selection */}
          {currentStep === 2 && (
            <div style={styles.step}>
              <h2>Select Your Role</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>What's your main role? *</label>
                {errors.role && (
                  <span style={styles.error}>{errors.role}</span>
                )}

                <div style={styles.optionsGrid}>
                  {[
                    'Digital Marketing Specialist',
                    'Content Marketer',
                    'Social Media Manager',
                    'SEO/SEM Specialist',
                    'Email Marketing Specialist',
                    'Marketing Analyst',
                  ].map((option) => (
                    <label
                      key={option}
                      style={{
                        ...styles.radioOption,
                        backgroundColor:
                          role === option ? '#EDE9FE' : 'white',
                        borderColor:
                          role === option ? '#7C3AED' : '#E5E7EB',
                      }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option}
                        checked={role === option}
                        onChange={(e) =>
                          handleFieldChange('role', e.target.value)
                        }
                        style={{ marginRight: '10px' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Experience & Goals */}
          {currentStep === 3 && (
            <div style={styles.step}>
              <h2>Experience & Goals</h2>

              {/* Experience */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Experience Level *</label>
                {errors.experience && (
                  <span style={styles.error}>{errors.experience}</span>
                )}

                <div style={styles.optionsGrid}>
                  {['Beginner (0-1 year)', 'Intermediate (1-4 years)', 'Expert (5+ years)'].map(
                    (option) => (
                      <label
                        key={option}
                        style={{
                          ...styles.radioOption,
                          backgroundColor:
                            experience === option ? '#EDE9FE' : 'white',
                          borderColor:
                            experience === option ? '#7C3AED' : '#E5E7EB',
                        }}
                      >
                        <input
                          type="radio"
                          name="experience"
                          value={option}
                          checked={experience === option}
                          onChange={(e) =>
                            handleFieldChange('experience', e.target.value)
                          }
                          style={{ marginRight: '10px' }}
                        />
                        {option}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Goal */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Main Goal *</label>
                {errors.goal && (
                  <span style={styles.error}>{errors.goal}</span>
                )}

                <div style={styles.optionsGrid}>
                  {[
                    'Learn new skills',
                    'Share knowledge',
                    'Find job/internship',
                    'Network with peers',
                    'Discover projects',
                  ].map((option) => (
                    <label
                      key={option}
                      style={{
                        ...styles.radioOption,
                        backgroundColor:
                          goal === option ? '#EDE9FE' : 'white',
                        borderColor:
                          goal === option ? '#7C3AED' : '#E5E7EB',
                      }}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={option}
                        checked={goal === option}
                        onChange={(e) =>
                          handleFieldChange('goal', e.target.value)
                        }
                        style={{ marginRight: '10px' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Bio */}
          {currentStep === 4 && (
            <div style={styles.step}>
              <h2>Tell Us About Yourself</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Write Your Bio *</label>
                <textarea
                  value={bio}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  placeholder="Share a bit about yourself, your interests, and what you're looking for..."
                  rows="6"
                  style={{
                    ...styles.textarea,
                    borderColor: errors.bio ? '#EF4444' : '#D1D5DB',
                  }}
                />
                {errors.bio && (
                  <span style={styles.error}>{errors.bio}</span>
                )}
                <span style={styles.charCount}>
                  {bio.length} / 500 characters
                </span>
              </div>

              {/* Review Section */}
              <div style={styles.reviewBox}>
                <h3>📋 Review Your Information</h3>
                <p>
                  <strong>Name:</strong> {firstName} {lastName}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Role:</strong> {role}
                </p>
                <p>
                  <strong>Experience:</strong> {experience}
                </p>
                <p>
                  <strong>Goal:</strong> {goal}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={styles.buttonGroup}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                style={styles.secondaryButton}
              >
                ← Back
              </button>
            )}

            {currentStep < totalSteps && (
              <button
                type="button"
                onClick={handleNext}
                style={styles.primaryButton}
              >
                Next →
              </button>
            )}

            {currentStep === totalSteps && (
              <button type="submit" style={styles.successButton}>
                ✓ Complete Sign Up
              </button>
            )}
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            style={styles.resetButton}
          >
            Start Over
          </button>
        </form>
      </div>
    </div>
  );
}

// ========================================================================
// STYLES
// ========================================================================

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  progressBar: {
    height: '8px',
    background: '#E5E7EB',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '30px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667EEA, #764BA2)',
    transition: 'width 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  textarea: {
    padding: '12px 16px',
    border: '2px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
  },
  togglePassword: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#6B7280',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
  },
  radioOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    border: '2px solid #E5E7EB',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  error: {
    color: '#EF4444',
    fontSize: '14px',
    fontWeight: '500',
  },
  charCount: {
    fontSize: '12px',
    color: '#9CA3AF',
  },
  reviewBox: {
    padding: '16px',
    background: '#F3F4F6',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
    marginTop: '30px',
  },
  primaryButton: {
    flex: 1,
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667EEA, #764BA2)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    flex: 1,
    padding: '12px 24px',
    background: 'white',
    color: '#6B7280',
    border: '2px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  successButton: {
    flex: 1,
    padding: '12px 24px',
    background: '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  resetButton: {
    padding: '10px 16px',
    background: '#F3F4F6',
    color: '#6B7280',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  successIcon: {
    fontSize: '60px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  summaryBox: {
    padding: '20px',
    background: '#F0FDF4',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #DBEAFE',
  },
};

export default CompleteSignupFormExample;
