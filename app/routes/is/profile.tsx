import { useSessionContext } from "supertokens-auth-react/recipe/session";

export default function Profile() {
  // This hook gives you direct access to the session payload
  const session = useSessionContext();

  if (session.loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>User ID: {session.userId}</h1>
      <p>Access Token Payload: {JSON.stringify(session.accessTokenPayload)}</p>
    </div>
  );
}