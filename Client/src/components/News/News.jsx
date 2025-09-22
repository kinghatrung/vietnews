import React from "react";
import { Link } from "react-router-dom";
import { LikeOutlined } from "@ant-design/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LazyLoad from "react-lazyload";

import config from "~/config";

const News = React.memo(function News({
  vertical = false,
  horizontal = false,
  author = false,
  reverse = false,
  large = false,
  medium = false,
  semiMedium = false,
  small = false,
  semiSmall = false,
  sizeDefault = false,
  sizeLarge = false,
  sizeSmall = false,
  sizeSemiSmall = false,
  sizeAuthor = false,
  hiddenSubTitle = false,
  noImage = false,
  noSubTitle = false,
  noImageAndSubTitle = false,
  noTime = false,
  title = false,
  image,
  describe,
  category,
  _id,
  createdAt,
  heading,
  reporter,
  like,
}) {
  return (
    <article
      className={clsx({
        "flex flex-col gap-[15px] pb-[15px] mb-[15px] border-b border-[#E5E5E5] last:border-b-0 last:p-0 last:m-0":
          vertical,
        "flex flex-2 flex-col lg:flex-row gap-[15px] border-b lg:border-r lg:border-b-0 border-[#E5E5E5] pb-[20px] lg:pr-[20px] lg:pb-0":
          horizontal,
        "flex flex-col": author,
        "flex-1": noImageAndSubTitle,
        "sm:flex gap-[20px] border-b border-[#E5E5E5] pb-[20px] mb-[20px]":
          large,
        "flex flex-col-reverse justify-between": reverse,
        "flex flex-col md:flex-row gap-[10px] md:gap-[20px] border-b border-[#E5E5E5] last:border-b-0 pb-[20px] mb-[20px] last:p-0 last:m-0":
          semiMedium,
        "flex flex-row gap-[10px]": small,
        "flex flex-col lg:flex-row gap-[10px] border-b border-[#E5E5E5] pb-[16px] mb-[16px] last:border-b-0 last:p-0 last:m-0":
          semiSmall,
      })}
    >
      {!noImage && (
        <Link to={`/news/${_id}`}>
          <LazyLoad offset={0} once>
            <div
              className={clsx("object-cover", {
                "aspect-[5/3]": vertical,
                "lg:w-[225px] lg:h-[135px] aspect-[5/3]": horizontal,
                "xl:w-[520px] xl:h-[312px] lg:w-[440px] lg:h-[264px] md:w-[440px] md:h-[264px] aspect-[5/3]":
                  large,
                "lg:w-[250px] lg:h-[150px] aspect-[5/3]": medium,
                "sm:w-[240px] sm:h-[144px] aspect-[5/3]": semiMedium,
                "md:w-[145px] md:h-[87px] w-[120px] h-[72px] aspect-[5/3]":
                  small,
                "w-[110px] h-[66px] aspect-[5/3] hidden lg:block": semiSmall,
              })}
            >
              <img
                alt="Ảnh tin tức"
                loading="lazy"
                className="size-full object-cover"
                src={
                  vertical
                    ? image.replace(
                        "/upload/",
                        "/upload/w_520,h_312,c_fill,f_auto,q_auto/"
                      )
                    : horizontal
                    ? image.replace(
                        "/upload/",
                        "/upload/w_225,h_135,c_fill,f_auto,q_auto/"
                      )
                    : large
                    ? image.replace(
                        "/upload/",
                        "/upload/w_520,h_312,c_fill,f_auto,q_auto/"
                      )
                    : medium
                    ? image.replace(
                        "/upload/",
                        "/upload/w_250,h_150,c_fill,f_auto,q_auto/"
                      )
                    : semiMedium
                    ? image.replace(
                        "/upload/",
                        "/upload/w_240,h_144,c_fill,f_auto,q_auto/"
                      )
                    : small
                    ? image.replace(
                        "/upload/",
                        "/upload/w_145,h_87,c_fill,f_auto,q_auto/"
                      )
                    : semiSmall
                    ? image.replace(
                        "/upload/",
                        "/upload/w_110,h_66,c_fill,f_auto,q_auto/"
                      )
                    : image
                }
              />
            </div>
          </LazyLoad>
        </Link>
      )}
      <div
        className={clsx({
          "pt-[20px] sm:pt-0": noImageAndSubTitle,
          "pt-[16px] sm:pt-0": large,
        })}
      >
        {title && (
          <h3
            className={clsx({
              "text-[18px] md:text-[15px] lg:line-clamp-2": sizeDefault,
              "text-[20px]": sizeLarge,
              "sm:text-[18px] text-[15px] mb-2 ms:mb-0 line-clamp-3 sm:line-clamp-none":
                sizeSmall,
              "text-[18px] mb-2": sizeSemiSmall,
              "text-[20px] sm:text-[15px] mb-1 lg:line-clamp-2": sizeAuthor,
            })}
          >
            <Link
              to={`/news/${_id}`}
              className="hover-color text-color font-title font-bold"
            >
              {heading}
            </Link>
          </h3>
        )}
        {!noSubTitle && (
          <p
            className={clsx("text-[17px] sm:text-[14px]", {
              "mt-3 line-clamp-4": sizeLarge,
              "mt-1 line-clamp-4": sizeDefault,
              "block sm:hidden  mb-3 ms:mb-0": hiddenSubTitle,
              "line-clamp-3": sizeAuthor,
              "hidden md:block": sizeSmall,
            })}
          >
            <Link to={`/news/${_id}`} style={{ color: "#4f4f4f" }}>
              {describe}
            </Link>
          </p>
        )}
        {!noTime && (
          <p className="mt-2 text-[#757575]">
            {dayjs(createdAt).fromNow()}
            <span className="ml-3">{category.category_name}</span>
          </p>
        )}

        {author && (
          <div className="flex justify-between mt-5">
            <div className="flex flex-col">
              <h3 className="italic font-title text-[16px] sm:text-[14px]">
                <Link style={{ color: "#757575" }} to={config.routes.home}>
                  {reporter?.full_name}
                </Link>
              </h3>
              <p className="mt-1 text-[12px]">
                <LikeOutlined /> {like}
              </p>
            </div>
            <img
              alt="Ảnh tin tức"
              loading="lazy"
              className="block sm:hidden md:hidden lg:hidden xl:block w-[72px] sm:w-[60px] rounded-full"
              src={reporter?.avatar ? reporter?.avatar : "/image/no-image.png"}
            />
          </div>
        )}
      </div>
    </article>
  );
});

export default News;
