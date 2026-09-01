import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In - Passu Peaks Travels"
        description="Sign in to manage your Passu Peaks Travels account"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
