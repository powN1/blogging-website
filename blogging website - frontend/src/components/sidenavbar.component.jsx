import { useContext, useRef, useState, useEffect } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../App";

const SideNav = () => {
	const {
		userAuth: { access_token, new_notification_available },
	} = useContext(UserContext);

	const pageLocation = location.pathname.split("/")[2];

	const [page, setPage] = useState(pageLocation.replace("-", " "));
	const [showSideNav, setShowSideNav] = useState(false);

	const activeTabLine = useRef();
	const sideBarIconTab = useRef();
	const pageTab = useRef();

	const changePage = e => {
		const { offsetWidth, offsetLeft } = e.target;

		activeTabLine.current.style.width = offsetWidth + "px";
		activeTabLine.current.style.left = offsetLeft + "px";

		if (e.target === sideBarIconTab.current) {
			setShowSideNav(true);
		} else {
			setShowSideNav(false);
		}
	};

	useEffect(() => {
		setShowSideNav(false);
		pageTab.current.click();
	}, [page]);

	return access_token === null ? (
		<Navigate to="/signin" />
	) : (
		<>
			<section className="relative flex gap-10 py-0 m- max-md:flex-col">
				<div className="sticky top-[80px] z-30">
					<div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
						<button className="p-5 capitalize" ref={sideBarIconTab} onClick={changePage}>
							<i className="fi fi-rr-bars-staggered pointer-events-none"></i>
						</button>

						<button className="p-5 capitalize" ref={pageTab} onClick={changePage}>
							{page}
						</button>

						<hr className="absolute bottom-0 duration-500 " ref={activeTabLine} />
					</div>

					<div
						className={
							"min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " +
							(!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")
						}
					>
						<h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
						<hr className="border-grey -ml-6 mb-8 mr-6" />

						<NavLink to="/dashboard/blogs" onClick={e => setPage(e.target.innerText)} className="sidebar-link">
							<i className="fi fi-rr-document"></i>
							Blogs
						</NavLink>

						<NavLink to="/dashboard/notifications" onClick={e => setPage(e.target.innerText)} className="sidebar-link">
							<div className="relative">
								<i className="fi fi-rr-bell"></i>
								{new_notification_available ? (
									<span className="bg-red w-2 h-2 rounded-full absolute z-10 right-0 top-0"></span>
								) : null}
							</div>
							Notifications
						</NavLink>

						<NavLink to="/dashboard/write" onClick={e => setPage(e.target.innerText)} className="sidebar-link">
							<i className="fi fi-rr-file-edit"></i>
							Write
						</NavLink>

						<h1 className="text-xl text-dark-grey mb-3 mt-20">Settings</h1>
						<hr className="border-grey -ml-6 mb-8 mr-6" />

						<NavLink to="/settings/edit-profile" onClick={e => setPage(e.target.innerText)} className="sidebar-link">
							<i className="fi fi-rr-user"></i>
							Edit Profile
						</NavLink>

						<NavLink to="/settings/change-password" onClick={e => setPage(e.target.innerText)} className="sidebar-link">
							<i className="fi fi-rr-lock"></i>
							Change Password
						</NavLink>
					</div>
				</div>

				<div className="max-md:-mt-8 mt-5 w-full">
					<Outlet />
				</div>
			</section>
		</>
	);
};

export default SideNav;
