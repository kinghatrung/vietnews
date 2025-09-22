import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LazyLoad from "react-lazyload";

import config from "~/config/";

const Comment = React.memo(function Comment({ comment }) {
  return (
    <div className="flex gap-[16px]">
      <div>
        <Link className="h-[40px] w-[40px] block">
          <LazyLoad height={40} offset={40} once>
            <img
              alt="Avatar"
              loading="lazy"
              className="size-full object-cover rounded-full"
              src={comment.user?.avatar}
            />
          </LazyLoad>
        </Link>
      </div>

      <div className="flex flex-col">
        <div className="flex gap-2">
          <h2 className="text-[#222] font-bold text-[16px]">
            {comment.user?.full_name}:
          </h2>
          <span className="text-[16px] text-[#4f4f4f]">{comment.content}</span>
        </div>
        <p className="text-[#9f9f9f]">
          {dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")}
        </p>
      </div>
    </div>
  );
});

export default Comment;
