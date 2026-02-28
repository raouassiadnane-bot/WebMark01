 dev/**
 * Redux Signup Data Debug Component
 * Shows all form data currently saved in Redux in real-time
 * 
 * Usage: Import and add this component temporarily to see Redux state
 */

import React from 'react';
import { useSelector } from 'react-redux';

function SignupDebugPanel() {
  const signupData = useSelector(state => state.signup);

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <h2 style={styles.title}>🔍 Redux Signup Data (Debug) 🔍</h2>
        
        <div style={styles.section}>
          <h3>📝 Step 1: Basic Information</h3>
          <p><strong>First Name:</strong> {signupData.firstName || '(empty)'}</p>
          <p><strong>Last Name:</strong> {signupData.lastName || '(empty)'}</p>
          <p><strong>Email:</strong> {signupData.email || '(empty)'}</p>
          <p><strong>Password:</strong> {signupData.password ? '••••••' : '(empty)'}</p>
          <p><strong>Age:</strong> {signupData.age || '(empty)'}</p>
        </div>

        <hr />

        <div style={styles.section}>
          <h3>🎯 Step 2-4: Onboarding</h3>
          <p><strong>Role:</strong> {signupData.role || '(empty)'}</p>
          <p><strong>Experience:</strong> {signupData.experience || '(empty)'}</p>
          <p><strong>Goal:</strong> {signupData.goal || '(empty)'}</p>
          <p><strong>Bio:</strong> {signupData.bio || '(empty)'}</p>
        </div>

        <hr />

        <div style={styles.section}>
          <h3>⚙️ Progress</h3>
          <p><strong>Current Step:</strong> {signupData.currentStep} / {signupData.totalSteps}</p>
          <p><strong>Form Complete:</strong> {signupData.isFormComplete ? '✅ Yes' : '❌ No'}</p>
        </div>

        <hr />

        <div style={styles.rawJson}>
          <h3>📄 Raw Redux State (JSON)</h3>
          <pre>{JSON.stringify(signupData, null, 2)}</pre>
        </div>

        <div style={styles.note}>
          <strong>💡 Note:</strong> This shows live data from Redux store. 
          Fill out the form in Signup/Onboarding pages and watch the data update here!
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    background: '#F9FAFB',
    borderRadius: '8px',
    marginTop: '20px',
    border: '2px dashed #9CA3AF',
  },
  panel: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'monospace',
  },
  title: {
    color: '#667EEA',
    marginTop: 0,
    textAlign: 'center',
  },
  section: {
    marginBottom: '15px',
  },
  rawJson: {
    background: '#1F2937',
    color: '#10B981',
    padding: '15px',
    borderRadius: '6px',
    overflow: 'auto',
    maxHeight: '300px',
  },
  note: {
    marginTop: '15px',
    padding: '12px',
    background: '#FEF3C7',
    borderLeft: '4px solid #F59E0B',
    borderRadius: '4px',
    color: '#92400E',
  },
};

export default SignupDebugPanel;
