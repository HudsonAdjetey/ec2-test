import React, { useEffect, useState } from "react";
import { api } from "../../main";
import { useQuery } from "@tanstack/react-query";

const URL = `/api/course`;

const Banner = () => {
  const [image, setImage] = useState("");
  const queryURL = useQuery({
    queryKey: ["url"],
    queryFn: async () => {
      const res = await api.get(`${URL}/banner-display`);
      return res.data;
    },
  });
  useEffect(() => {
    if (queryURL.isSuccess && queryURL?.data) {
      const data = queryURL.data.data;
      setImage(data);
    }
  }, [queryURL.data]);
  return (
    <div className="banner__imgContainer">
      <img src={image} alt="" />
    </div>
  );
};

export default Banner;
