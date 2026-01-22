import React, { useState, useRef } from 'react';
import { Mail, ArrowRight, Loader } from 'lucide-react';

interface LoginViewProps {
    onLogin: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const [emailInput, setEmailInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const DOMAIN = '@blackwoods.com.au';
    const showSuffix = emailInput.length > 0 && !emailInput.includes('@');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Auto-append domain if missing
        let finalEmail = emailInput.trim();
        if (!finalEmail.includes('@')) {
            finalEmail += DOMAIN;
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simple Mock Validation
        if (finalEmail.toLowerCase().endsWith(DOMAIN) || finalEmail === `demo${DOMAIN}`) {
            onLogin(finalEmail);
        } else {
            setError(`Please use a valid Blackwoods email address (${DOMAIN})`);
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Allow Tab to autocomplete
        if (e.key === 'Tab' && showSuffix) {
            e.preventDefault();
            setEmailInput(emailInput + DOMAIN);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md">
                <div className="flex justify-center">
                    <img
                        src="/icons/icon-120.png"
                        alt="Blackwoods"
                        className="w-16 h-16 rounded-xl shadow-lg"
                    />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-[#002452]">
                    ICP Generator
                </h2>
                <p className="mt-2 text-center text-sm text-gray-700 font-medium">
                    Enter your email to access market intelligence
                </p>
            </div>

            <div className="mt-8 mx-auto w-full max-w-md">
                <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 border border-gray-300">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm flex items-center">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>

                                <div className="relative w-full flex items-center">
                                    <input
                                        ref={inputRef}
                                        id="email"
                                        name="email"
                                        type="text"
                                        autoComplete="email"
                                        required
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="focus:ring-[#002452] focus:border-[#002452] block w-full pl-10 sm:text-sm border-gray-400 rounded-md p-2.5 border text-gray-900 bg-white"
                                        placeholder="name"
                                    />

                                    {/* Intellisense Suffix */}
                                    {showSuffix && (
                                        <div
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none select-none text-sm transition-opacity duration-200"
                                        >
                                            {DOMAIN}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {showSuffix && (
                                <p className="mt-1 text-xs text-brand/60">Press <strong>Tab</strong> to autocomplete domain</p>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            Login Failed
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#002452] hover:bg-[#001a3d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002452] transition-colors disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 uppercase text-xs tracking-wider">
                                    For Blackwoods Internal Use Only
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
