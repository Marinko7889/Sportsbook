import AuthForm from "../components/AuthForm";
export default function LoginPage() {
  const BASE_URL = process.env.BASE_URL;
  return <AuthForm mode="login" BASE_URL={BASE_URL} />;
}
