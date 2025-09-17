"use client"; // This page now needs to be a client component

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <main style={{ padding: "20px" }}>
        <h1>Welcome, {session.user?.name}</h1>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </main>
    );
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>You are not signed in</h1>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </main>
  );
}
