import type { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const Guestbook = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }
  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">Guestbook</h1>
      <div className="pt-10">
        {session ? (
          <>
            <p>hi {session.user?.name}</p>
            <button onClick={() => signOut()}>Logout</button>
            <div className="pt-6">
              <Form session={session} />
            </div>
          </>
        ) : (
          <button onClick={() => signIn("discord")}>Login with Discord</button>
        )}
      </div>
      <div className="pt-10">
        <Messages />
      </div>
    </main>
  );
};

const Messages = () => {
  const { data: messages, isLoading } = trpc.guestbook.getAll.useQuery();
  if (isLoading) return <div>Fetching messages...</div>;
  return (
    <div className="flex flex-col gap-4">
      {messages?.map((msg, index) => {
        return (
          <div key={index}>
            <p>{msg.message}</p>
            <span>- {msg.name}</span>
          </div>
        );
      })}
    </div>
  );
};

const Form = ({ session }: { session: Session }) => {
  const [message, setMessage] = useState("");
  const utils = trpc.useContext();
  const postMessage = trpc.guestbook.postMessage.useMutation({
    onMutate: () => {
      utils.guestbook.getAll.cancel();
      const optimisticUpdate = utils.guestbook.getAll.getData();

      if (optimisticUpdate) {
        utils.guestbook.getAll.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.guestbook.getAll.invalidate();
    },
  });

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        postMessage.mutate({
          name: session.user?.name as string,
          message,
        });
        setMessage("");
      }}
    >
      <input
        type="text"
        value={message}
        placeholder="Your message..."
        minLength={2}
        maxLength={100}
        onChange={(e) => setMessage(e.target.value)}
        className="bg- rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};

export default Guestbook;
