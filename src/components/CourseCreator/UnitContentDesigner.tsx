export function UnitContentDesigner({
  selectedUnitId,
}: {
  selectedUnitId: string | undefined;
}) {
  if (selectedUnitId === undefined)
    return (
      <div>
        There is no unit. Please create your first unit through the table of
        content creator on the sidebar.
      </div>
    );
  return (
    <div className="pl-4  ">
      <h1 className=" mb-4 text-2xl font-semibold text-cyan-400">
        Unit Contents Designer
      </h1>
      <div className="flex bg-neutral-700 px-4 py-4">
        <ul className="">
          <li>Fill in the blank</li>
          <li>XX</li>
          <li>YY</li>
        </ul>
        <div>Content</div>
      </div>
      <form className="bg-slate-700 py-2 px-4">
        <div className="flex grow">
          <label>Instruction</label>
          <input
            placeholder="Enter the instruction for the exercise"
            className="w-full text-neutral-800"
          />
        </div>
        <div>
          <input />
        </div>
      </form>
    </div>
  );
}
