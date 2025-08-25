import React from "react";
import { Link } from "react-router-dom";

const CategoryList = React.memo(function CategoryList({
  category,
  categoryId,
}) {
  return (
    <div className="flex mb-[6px] items-end gap-[16px]">
      <h3 className="font-title font-bold ms:mb-0">
        <Link
          to={`/genre/${categoryId}`}
          className="text-[20px] md:text-[18px] hover-color p-[6px]"
        >
          {category}
        </Link>
      </h3>
    </div>
  );
});

export default CategoryList;
