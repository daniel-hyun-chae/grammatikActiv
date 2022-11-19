import { trpc } from "../../utils/trpc";

export default function Courses() {
  const books = trpc.book.getAll.useQuery();

  return (
    <div>
      <div>{books.data ? JSON.stringify(books.data) : null}</div>
    </div>
  );
}
