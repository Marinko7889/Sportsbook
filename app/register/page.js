import AuthForm from "../components/AuthForm";
export default function RegisterPage() {
  const BASE_URL = process.env.BASE_URL;

  return <AuthForm mode="register" BASE_URL={BASE_URL} />;
}
