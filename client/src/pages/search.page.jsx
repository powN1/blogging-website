import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import LoadMoreDataBtn from "../components/load-more.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import Loader from "../components/loader.component";
import UserCard from "../components/usercard.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import axios from "axios";

const SearchPage = () => {
  const { query } = useParams();

  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);

  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/search-blogs", { query, page })
      .then(async ({ data }) => {
        const formattedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/api/search-blogs-count",
          data_to_send: { query },
          create_new_arr,
        });

        setBlogs(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  const fetchUsers = () => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/search-users", { query })
      .then(({ data: { users } }) => {
        console.log(users);
        setUsers(users);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const UserCardWrapper = () => {
    return (
      <>
        {users === null
          ? <Loader />
          : users.length
          ? users.map((user, i) => (
            <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
              <UserCard user={user} />
            </AnimationWrapper>
          ))
          : <NoDataMessage message="No user found" />}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results for "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
        >
          <>
            {blogs === null ? <Loader /> : blogs.results.length
              ? blogs.results.map((blog, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                    <BlogPostCard content={blog} author={blog.author.personal_info} />
                  </AnimationWrapper>
                );
              })
              : <NoDataMessage message="No blogs published" />}
            <LoadMoreDataBtn
              state={blogs}
              fetchDataFunc={searchBlogs}
            />
          </>

          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          Users related to search
          <i className="fi fi-rr-user mt-1 ml-1"></i>
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
