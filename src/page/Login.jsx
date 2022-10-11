import React from 'react';
import Card from '../components/elements/Card';
import Text from '../components/elements/Text';
import Button from '../components/elements/Button';
import {useNavigate} from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const onLogin = (e) => {
        e.preventDefault();
        console.log("e")
        navigate("/home");
    }
  return (
    <main >        
        <section>
            <div className="flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <Text className="text-4xl text-white text-center font-bold mb-2">
                            Focus<span className="text-tertiary">App</span>
                        </Text>

                        <h2 className="text-white mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>                        
                    </div>
                    <form className="mt-8 space-y-6" >
                        {/* <input type="hidden" name="remember" /> */}
                        <div className="-space-y-px rounded-md shadow-sm">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"                                    
                                    required
                                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"                                    
                                    required
                                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>                        

                        <div>
                            <button
                                // type="submit"
                                onClick={onLogin}
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >                                
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </main>
  )
}

export default Login