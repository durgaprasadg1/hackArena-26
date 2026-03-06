import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join NutriSync AI
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start your personalized health and fitness journey today
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-green-600 hover:bg-green-700",
              card: "shadow-xl",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/auth-redirect"
          fallbackRedirectUrl="/auth-redirect"
        />
      </div>
    </div>
  );
}
