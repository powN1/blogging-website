import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { UserContext } from "../App.jsx";
import { filterPaginationData } from "../common/filter-pagination-data.jsx";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component.jsx";
import Loader from "../components/loader.component.jsx";
import NoDataMessage from "../components/nodata.component.jsx";
import AnimationWrapper from "../common/page-animation.jsx";
import { ManagePublishedBlogCard, ManageDraftBlogPost } from "../components/manage-blogcard.component.jsx";

const ManageBlogs = () => {
	const [blogs, setBlogs] = useState(null);
	const [drafts, setDrafts] = useState(null);
	const [query, setQuery] = useState("");

	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
		axios
			.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs",
				{ page, draft, query, deletedDocCount },
				{
					headers: {
						Authorization: `${access_token}`,
					},
				},
			)
			.then(async ({ data }) => {
				const formattedData = await filterPaginationData({
					state: draft ? drafts : blogs,
					data: data.blogs,
					page,
					user: access_token,
					countRoute: "/user-written-blogs-count",
					data_to_send: { draft, query },
				});

				if (draft) {
					setDrafts(formattedData);
				} else {
					setBlogs(formattedData);
				}
			})
			.catch(err => console.log(err));
	};

	const handleChange = e => {
		if (!e.target.value.length) {
			setQuery("");
			setBlogs(null);
			setDrafts(null);
		}
	};

	const handleSearch = e => {
		const searchQuery = e.target.value;

		setQuery(searchQuery);

		if (e.keyCode === 13 && searchQuery.length) {
			setBlogs(null);
			setDrafts(null);
		}
	};

	useEffect(() => {
		if (access_token) {
			if (blogs === null) {
				getBlogs({ page: 1, draft: false });
			}
			if (drafts === null) {
				getBlogs({ page: 1, draft: true });
			}
		}
	}, [access_token, blogs, drafts, query]);

	return (
		<>
			<h1 className="max-md:hidden">Manage Blogs</h1>
			<Toaster />
			<div className="relative max-md:mt-5 md:mt-8 mb-10">
				<input
					type="search"
					className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
					placeholder="Search Blogs"
					onChange={handleChange}
					onKeyDown={handleSearch}
				/>
				<i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
			</div>

			<InPageNavigation routes={["Published Blogs", "Drafts"]}>
				{
					// Published blogs
					blogs === null ? (
						<Loader />
					) : blogs.results.length ? (
						<>
							{blogs.results.map((blog, i) => {
								return (
									<AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
										<ManagePublishedBlogCard blog={{ ...blog, index: i, setStateFunc: setBlogs }} />
									</AnimationWrapper>
								);
							})}
						</>
					) : (
						<NoDataMessage message="No published blogs" />
					)
				}

				{
					// Drafted blogs
					drafts === null ? (
						<Loader />
					) : drafts.results.length ? (
						<>
							{drafts.results.map((blog, i) => {
								return (
									<AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
										<ManageDraftBlogPost blog={{ ...blog, index: i + 1, setStateFunc: setDrafts }} />
									</AnimationWrapper>
								);
							})}
						</>
					) : (
						<NoDataMessage message="No draft blogs" />
					)
				}
			</InPageNavigation>
		</>
	);
};

export default ManageBlogs;
