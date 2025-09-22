import React, { useCallback, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input, Form, Select, Empty } from "antd";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "~/redux/loadingSlice";

import News from "~/components/News";
import { getSearchNewsAPI } from "~/api";

const { Search } = Input;
const { Option } = Select;

const SearchNews = React.memo(function SearchNews() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [newsResults, setNewsResults] = useState([]);
  const [isResult, setIsResult] = useState(false);

  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const navigate = useNavigate();

  useEffect(() => {
    if (!q) return;
    const fetchData = async () => {
      try {
        dispatch(startLoading());
        const res = await getSearchNewsAPI(q);
        setNewsResults(res.data.results);
        dispatch(stopLoading());
      } catch (err) {
        console.error("Error fetching search results:", err);
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [q]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get("q") || "";
    const time = queryParams.get("time") || "";

    form.setFieldsValue({
      search: q,
      time: time,
    });
    const fetchData = async () => {
      try {
        dispatch(startLoading());
        const res = await getSearchNewsAPI({ q, time });
        setNewsResults(res.data.results);
        dispatch(stopLoading());
      } catch (error) {
        console.error("Search error:", error);
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [location.search]);

  const onSearch = useCallback(async () => {
    const values = form.getFieldsValue();

    const query = new URLSearchParams({
      q: values.search || "",
      time: values.time || "",
    }).toString();

    navigate(`/search?${query}`);
  }, [form, navigate]);

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-24">
        <div className="col-span-16 pr-0  lg:pr-[20px] border-0  lg:border-r border-[#E5E5E5]">
          <h1 className="text-[24px] text-[#222] font-title font-bold mb-[15px]">
            Tìm kiếm
          </h1>
          <div className="border-b border-[#E5E5E5]">
            <Form form={form} name="search" layout="vertical">
              <Form.Item layout="vertical" name="search">
                <Search
                  className="custom-input-search"
                  placeholder="Tìm kiếm"
                  onSearch={onSearch}
                />
              </Form.Item>
              <div className="flex gap-[10px]">
                <Form.Item
                  className="w-full"
                  layout="vertical"
                  name="time"
                  label="Thời gian"
                >
                  <Select
                    style={{ height: "40px" }}
                    className="custom-select"
                    placeholder="Chọn"
                  >
                    <Option value="">Chọn thời gian</Option>
                    <Option value="1d">1 ngày qua</Option>
                    <Option value="1w">1 tuần qua</Option>
                    <Option value="1m">1 tháng qua</Option>
                    <Option value="1y">1 năm qua</Option>
                  </Select>
                </Form.Item>
              </div>
            </Form>
          </div>
          {newsResults.length > 0 ? (
            <h3 className="mt-[20px] text-[30px] font-title font-[600]">
              Kết quả: <span>{newsResults.length}</span> tin tức
            </h3>
          ) : null}
          {newsResults.length > 0 ? (
            <div className="pt-[24px]">
              {newsResults?.map((result) => (
                <News
                  key={result._id}
                  {...result}
                  heading={result.title}
                  title
                  semiMedium
                  noTime
                  sizeLarge
                />
              ))}
            </div>
          ) : (
            <Empty
              className="flex flex-col justify-center items-center h-[50vh]"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có tin tức nào"
            />
          )}
        </div>
        {/* <div className="col-span-8 pl-[20px] hidden lg:block">
          <h1>Tìm kiếm</h1>
        </div> */}
      </div>
      {/* {isResult && (
        <Pagination
          className="!pt-[20px] !pb-[30px] !mt-[30px] border-t border-[#E5E5E5] custom-pagination"
          defaultCurrent={1}
          total={50}
        />
      )} */}
    </section>
  );
});

export default SearchNews;
