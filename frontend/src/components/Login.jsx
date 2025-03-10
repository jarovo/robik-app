import GoogleLogin from "./GoogleLogin";
import FakturoidLogin from "./FakturoidLogin";


export default function Login() {
  return (
    <div className="root">
      <div>
        <h1>Log in to services</h1>
        <GoogleLogin />
        <FakturoidLogin />
      </div>
    </div>
  );
}