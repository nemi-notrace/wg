import React from "react";
import { useLoaderData } from "@remix-run/react";
import { createInviteCode } from "~/models/user.server";

function InviteCodeComponent() {
  const loaderData = useLoaderData();
  const user = loaderData?.user || null;
  const [inviteCode, setInviteCode] = React.useState<string | null>(null);

  async function handleGenerateInviteCode() {
    try {
      if (!user || !user.id) {
        console.error("User is not logged in or user ID is missing.");
        return;
      }

      const newInviteCode = await createInviteCode(user.id);
      setInviteCode(newInviteCode.code);
    } catch (error) {
      console.error("Failed to generate invite code:", error);
    }
  }

  return (
    <div>
      {inviteCode ? (
        <div>Your invite code: {inviteCode}</div>
      ) : (
        <button onClick={handleGenerateInviteCode}>Generate Invite Code</button>
      )}
    </div>
  );
}

export default InviteCodeComponent;
