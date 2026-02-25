import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction } from '../store/authSlice';

export default function Onboarding() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: '',
        experience: '',
        goal: '',
        bio: '',
    });

    const totalSteps = 4;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save to profile
        const updatedUser = { ...user, ...formData };

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
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    ></div>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="space-y-4">
                            <label className="block text-lg font-medium text-gray-700">Quel est votre rôle principal ?</label>
                            <div className="space-y-2">
                                {['Digital Marketing Specialist', 'Content Marketer', 'Social Media Manager', 'SEO/SEM Specialis', 'Email Marketing Specialist', 'Marketing Analyst', 'Autre'].map((option) => (
                                    <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition">
                                        <input
                                            type="radio"
                                            name="role"
                                            value={option}
                                            checked={formData.role === option}
                                            onChange={handleChange}
                                            className="form-radio text-purple-600"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <label className="block text-lg font-medium text-gray-700">Quel est votre niveau d'expérience ?</label>
                            <div className="grid grid-cols-1 gap-3">
                                {['Débutant (0-1 an)', 'Intermédiaire (1-4 ans)', 'Expert (5+ ans)'].map((option) => (
                                    <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition">
                                        <input
                                            type="radio"
                                            name="experience"
                                            value={option}
                                            checked={formData.experience === option}
                                            onChange={handleChange}
                                            className="form-radio text-purple-600"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <label className="block text-lg font-medium text-gray-700">Quel est votre objectif principal ?</label>
                            <div className="space-y-2">
                                {['Apprendre de nouvelles compétences', 'Partager mes connaissances', 'Trouver un emploi / stage', 'Réseauter avec des pairs', 'Découvrir des projets'].map((option) => (
                                    <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition">
                                        <input
                                            type="radio"
                                            name="goal"
                                            value={option}
                                            checked={formData.goal === option}
                                            onChange={handleChange}
                                            className="form-radio text-purple-600"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <label className="block text-lg font-medium text-gray-700">Dites-nous en plus sur vous (Bio)</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Une courte description de qui vous êtes et ce que vous aimez..."
                            ></textarea>
                        </div>
                    )}

                    <div className="flex justify-between mt-8">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                            >
                                Précédent
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < totalSteps ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={step === 1 && !formData.role || step === 2 && !formData.experience || step === 3 && !formData.goal}
                                className={`px-6 py-2 rounded-lg text-white font-semibold transition ${(step === 1 && !formData.role || step === 2 && !formData.experience || step === 3 && !formData.goal)
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
