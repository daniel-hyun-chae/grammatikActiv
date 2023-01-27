import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnderline } from "@fortawesome/free-solid-svg-icons";

export default function UnitContentDesigner({
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
    <div>
      <ContentWizard />
    </div>
  );
}

function ContentWizard() {
  return (
    <div>
      <ul className="flex space-x-2">
        <ContentTypeListItem>
          <span>Fill in the blank</span>
          <FontAwesomeIcon icon={faUnderline} className="h-16 w-16 stroke-1" />
        </ContentTypeListItem>
      </ul>
    </div>
  );
}

function ContentTypeListItem({ children }: { children: React.ReactNode }) {
  return <li className="flex flex-col items-center border p-2">{children}</li>;
}
