import { useAuth } from '../state/AuthContext.jsx';

export default function Profile() {
  const { claims } = useAuth();

  const rows = claims
    ? Object.entries(claims).map(([k, v]) => (
        <div key={k} className="flex justify-between border-b py-2 text-sm">
          <span className="font-medium">{k}</span>
          <span className="text-gray-700">{Array.isArray(v) ? v.join(', ') : String(v)}</span>
        </div>
      ))
    : null;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">Profile</h1>
      {!claims ? (
        <div>Could not read token claims.</div>
      ) : (
        <div className="rounded border bg-white p-4">{rows}</div>
      )}
    </div>
  );
}