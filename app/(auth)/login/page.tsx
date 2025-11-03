'use client';

import Link from 'next/link';
import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
                    <p className="text-center opacity-70 mb-6">Sign in to your account</p>

                    <SignIn.Root>
                        <SignIn.Step name="start">
                            <div className="space-y-4">
                                <Clerk.Field name="identifier">
                                    <div className="form-control">
                                        <Clerk.Label className="label">
                                            <span className="label-text">Email</span>
                                        </Clerk.Label>
                                        <Clerk.Input
                                            type="email"
                                            placeholder="your@email.com"
                                            className="input input-bordered w-full"
                                        />
                                        <Clerk.FieldError className="label">
                                            <span className="label-text-alt text-error" />
                                        </Clerk.FieldError>
                                    </div>
                                </Clerk.Field>

                                <Clerk.Field name="password">
                                    <div className="form-control">
                                        <Clerk.Label className="label">
                                            <span className="label-text">Password</span>
                                        </Clerk.Label>
                                        <Clerk.Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="input input-bordered w-full"
                                        />
                                        <Clerk.FieldError className="label">
                                            <span className="label-text-alt text-error" />
                                        </Clerk.FieldError>
                                    </div>
                                </Clerk.Field>

                                <SignIn.Action submit className="btn btn-primary w-full">
                                    <i className="fa-solid fa-duotone fa-arrow-right-to-bracket mr-2"></i>
                                    Sign In
                                </SignIn.Action>

                                <div className="divider">OR</div>

                                <Clerk.Connection name="google" className="btn btn-outline w-full">
                                    <i className="fa-brands fa-google mr-2"></i>
                                    Continue with Google
                                </Clerk.Connection>
                            </div>
                        </SignIn.Step>
                    </SignIn.Root>

                    <div className="text-center mt-6">
                        <p className="text-sm opacity-70">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="link link-primary">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
