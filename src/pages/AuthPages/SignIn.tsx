import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In - NorthRoutes PK"
        description="Sign in to manage your NorthRoutes PK account"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
