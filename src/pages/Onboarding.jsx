import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction } from '../store/authSlice';
import { updateField, nextStep, prevStep } from '../features/signup/signupSlice';

export default function Onboarding() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    
    // Get signup data from Redux
    const signupState = useSelector(state => state.signup);
    const { currentStep, totalSteps, role, experience, goal, bio } = signupState;

    // Handle field changes by dispatching Redux action
    const handleFieldChange = (fieldName, value) => {
        dispatch(updateField({ fieldName, value }));
    };

    const handleNextStep = () => {
        dispatch(nextStep());
    };

    const handlePrevStep = () => {
        dispatch(prevStep());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Combine auth user with signup form data
        const updatedUser = { 
            ...user, 
            role,
            experience,
            goal,
            bio,
        };

        // Update Redux
        dispatch(loginAction(updatedUser));

        // Update LocalStorage
        localStorage.setItem('profile', JSON.stringify(updatedUser));
        localStorage.setItem('onboarded', 'true');

        navigate('/');
    };

    if (!user) {
        // Should not happen if redirected from Signup, but handle safely
        return <div className="p-10 text-center">Please sign up first.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Bienvenue, {user.firstName}!
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    Quelques questions pour personnaliser votre expérience.
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>

                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <label className="block text-lg font-medium text-gray-700">Quel est votre rôle principal ?</label>
                            <div className="space-y-2">
                                {['Digital Marketing Specialist', 'Content Marketer', 'Social Media Manager', 'SEO/SEM Specialis', 'Email Marketing Specialist', 'Marketing Analyst', 'Autre'].map((option) => (
                                    <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition">
                                        <input
                                            type="radio"
                                            name="role"
                                            value={option}
                                            checked={role === option}
                                            onChange={(e) => handleFieldChange('role', e.target.value)}
                                            className="form-radio text-purple-600"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <label className="block text-lg font-medium text-gray-700">Quel est votre niveau d'expérience ?</label>
                            <div className="grid grid-cols-1 gap-3">
                                {['Débutant (0-1 an)', 'Intermédiaire (1-4 ans)', 'Expert (5+ ans)'].map((option) => (
                                    <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition">
                                        <input
                                            type="radio"
                                            name="experience"
                                            value={option}
                                            checked={experience === option}
                                            onChange={(e) => handleFieldChange('experience', e.target.value)}
                                            className="form-radio text-purple-600"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <label className="block text-lg font-medium text-gray-700">Quel est votre objectif principal ?</label>
                            <div className="space-y-2">
                                {['Apprendre de nouvelles compétences', 'Partager mes connaissances', 'Trouver un emploi / stage', 'Réseauter avec des pairs', 'Découvrir des projets'].map((option) => (
                                    <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition">
                                        <input
                                            type="radio"
                                            name="goal"
                                            value={option}
                                            checked={goal === option}
                                            onChange={(e) => handleFieldChange('goal', e.target.value)}
                                            className="form-radio text-purple-600"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <label className="block text-lg font-medium text-gray-700">Dites-nous en plus sur vous (Bio)</label>
                            <textarea
                                name="bio"
                                value={bio}
                                onChange={(e) => handleFieldChange('bio', e.target.value)}
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Une courte description de qui vous êtes et ce que vous aimez..."
                            ></textarea>
                        </div>
                    )}

                    <div className="flex justify-between mt-8">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                            >
                                Précédent
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={currentStep === 1 && !role || currentStep === 2 && !experience || currentStep === 3 && !goal}
                                className={`px-6 py-2 rounded-lg text-white font-semibold transition ${(currentStep === 1 && !role || currentStep === 2 && !experience || currentStep === 3 && !goal)
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700 shadow-md'
                                    }`}
                            >
                                Suivant
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition"
                            >
                                Terminer
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
