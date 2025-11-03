'use client';

import Link from 'next/link';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-base-200">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center mb-2">Get Started</h1>
                    <p className="text-center opacity-70 mb-6">Create your account</p>

                    <SignUp.Root>
                        <SignUp.Step name="start">
                            <div className="space-y-4">
                                <Clerk.Field name="firstName">
                                    <div className="form-control">
                                        <Clerk.Label className="label">
                                            <span className="label-text">First Name</span>
                                        </Clerk.Label>
                                        <Clerk.Input
                                            type="text"
                                            placeholder="John"
                                            className="input input-bordered w-full"
                                        />
                                        <Clerk.FieldError className="label">
                                            <span className="label-text-alt text-error" />
                                        </Clerk.FieldError>
                                    </div>
                                </Clerk.Field>

                                <Clerk.Field name="lastName">
                                    <div className="form-control">
                                        <Clerk.Label className="label">
                                            <span className="label-text">Last Name</span>
                                        </Clerk.Label>
                                        <Clerk.Input
                                            type="text"
                                            placeholder="Doe"
                                            className="input input-bordered w-full"
                                        />
                                        <Clerk.FieldError className="label">
                                            <span className="label-text-alt text-error" />
                                        </Clerk.FieldError>
                                    </div>
                                </Clerk.Field>

                                <Clerk.Field name="emailAddress">
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
                                        <label className="label">
                                            <span className="label-text-alt">At least 8 characters</span>
                                        </label>
                                    </div>
                                </Clerk.Field>

                                <SignUp.Action submit className="btn btn-primary w-full">
                                    <i className="fa-solid fa-duotone fa-user-plus mr-2"></i>
                                    Create Account
                                </SignUp.Action>

                                <div className="divider">OR</div>

                                <Clerk.Connection name="google" className="btn btn-outline w-full">
                                    <i className="fa-brands fa-google mr-2"></i>
                                    Continue with Google
                                </Clerk.Connection>
                            </div>
                        </SignUp.Step>

                        <SignUp.Step name="verifications">
                            <SignUp.Strategy name="email_code">
                                <div className="space-y-4">
                                    <p className="text-center opacity-70">
                                        We sent a verification code to your email
                                    </p>
                                    <Clerk.Field name="code">
                                        <div className="form-control">
                                            <Clerk.Label className="label">
                                                <span className="label-text">Verification Code</span>
                                            </Clerk.Label>
                                            <Clerk.Input
                                                type="text"
                                                placeholder="123456"
                                                className="input input-bordered w-full text-center text-2xl tracking-widest"
                                            />
                                            <Clerk.FieldError className="label">
                                                <span className="label-text-alt text-error" />
                                            </Clerk.FieldError>
                                        </div>
                                    </Clerk.Field>
                                    <SignUp.Action submit className="btn btn-primary w-full">
                                        Verify Email
                                    </SignUp.Action>
                                </div>
                            </SignUp.Strategy>
                        </SignUp.Step>
                    </SignUp.Root>

                    <div className="text-center mt-6">
                        <p className="text-sm opacity-70">
                            Already have an account?{' '}
                            <Link href="/login" className="link link-primary">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
