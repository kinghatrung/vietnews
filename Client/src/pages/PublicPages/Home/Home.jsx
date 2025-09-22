import React from "react";
import TopStory from "~/layouts/DefaultLayout/components/Containers/TopStory";
import ContentDaily from "~/layouts/DefaultLayout/components/Containers/ContentDaily";
import MostViewed from "~/layouts/DefaultLayout/components/Containers/MostViewed";
import ContentVertical from "~/layouts/DefaultLayout/components/Containers/ContentVertical";

const Home = React.memo(function Home() {
  return (
    <>
      <TopStory />
      <ContentDaily />
      <ContentVertical />
      <MostViewed />
    </>
  );
});

export default Home;
