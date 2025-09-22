const routes = {
  // public route
  home: "/",
  latest: "/latest",
  newsMange: "/newsMange",
  search: "/search",
  genre: "/genre/:id",
  news: "/news/:id",

  // Private route
  profile: "/profile",

  // Admin router
  article: "/article",
  category: "/category",

  // Editor router
  propose: "/propose",
};

export default routes;
