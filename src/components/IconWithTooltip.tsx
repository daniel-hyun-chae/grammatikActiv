import * as Tooltip from "@radix-ui/react-tooltip";
import type { SVGProps } from "react";

export type HeroIcon = (
  props: SVGProps<SVGSVGElement> & {
    title?: string;
    titleId?: string;
  }
) => JSX.Element;

export const IconWithTooltip = ({
  Icon,
  tooltipMessage,
  onClickCallback,
}: {
  Icon: HeroIcon;
  tooltipMessage: string;
  onClickCallback?: () => void;
}) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger>
          <button
            className="flex items-center"
            onClick={() => {
              onClickCallback && onClickCallback();
            }}
          >
            <Icon
              className={`h-7 w-7 rounded p-1 hover:bg-neutral-100 hover:dark:bg-neutral-700`}
            />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            sideOffset={5}
            className="rounded bg-neutral-700 p-1 text-xs text-neutral-200"
          >
            {tooltipMessage}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
