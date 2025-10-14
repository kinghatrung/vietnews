import { memo } from "react";
import News from "~/components/News";

function ListTitle() {
  return (
    <div className="list-disc pl-[20px] pt-[20px]">
      <ul className="flex flex-col lg:flex-row justify-between list-disc gap-[20px] lg:gap-[40px]">
        <li>
          <News title noImage noSubTitle noTime sizeDefault />
        </li>
        <li>
          <News title noImage noSubTitle noTime sizeDefault />
        </li>
        <li>
          <News title noImage noSubTitle noTime sizeDefault />
        </li>
      </ul>
    </div>
  );
}

export default memo(ListTitle);
