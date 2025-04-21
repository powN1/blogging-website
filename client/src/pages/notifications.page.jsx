import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { UserContext } from "../App.jsx";
import { filterPaginationData } from "../common/filter-pagination-data.jsx";
import Loader from "../components/loader.component.jsx";
import AnimationWrapper from "../common/page-animation.jsx";
import NoDataMessage from "../components/nodata.component.jsx";
import NotificationCard from "../components/notification-card.component.jsx";
import LoadMoreDataBtn from "../components/load-more.component.jsx";

const Notifications = () => {
	const {
		userAuth,
		userAuth: { access_token, new_notification_available },
		setUserAuth,
	} = useContext(UserContext);

	const [filter, setFilter] = useState("all");
	const [notifications, setNotifications] = useState(null);

	const filters = ["all", "like", "comment", "reply"];

	useEffect(() => {
		if (access_token) {
			fetchNotifications({ page: 1 });
		}
	}, [access_token, filter]);

	const handleFilter = e => {
		const btn = e.target;

		setFilter(btn.innerHTML);

		setNotifications(null);
	};

	const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
		axios
			.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/api/notifications",
				{ page, filter, deletedDocCount },
				{
					headers: {
						Authorization: `${access_token}`,
					},
				},
			)
			.then(async ({ data: { notifications: data } }) => {
				if (new_notification_available) {
					setUserAuth({ ...userAuth, new_notification_available: false });
				}

				const formattedData = await filterPaginationData({
					state: notifications,
					data,
					page,
					countRoute: "/api/all-notifications-count",
					data_to_send: { filter },
					user: access_token,
				});

				setNotifications(formattedData);
			})
			.catch(err => {
				console.log(err);
			});
	};

	return (
		<div>
			<h1 className="max-md:hidden">Recent Notifications</h1>

			<div className="my-8 flex gap-6">
				{filters.map((filterName, i) => {
					return (
						<button key={i} className={"py-2 " + (filter === filterName ? "btn-dark" : "btn-light")} onClick={handleFilter}>
							{filterName}
						</button>
					);
				})}
			</div>

			{notifications === null ? (
				<Loader />
			) : (
				<>
					{notifications.results.length ? (
						notifications.results.map((notification, i) => {
							return (
								<AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
									<NotificationCard data={notification} index={i} notificationState={{ notifications, setNotifications }} />
								</AnimationWrapper>
							);
						})
					) : (
						<NoDataMessage message="Nothing available" />
					)}
					<LoadMoreDataBtn
						state={notifications}
						fetchDataFunc={fetchNotifications}
						additionalParams={{ deletedDocCount: notifications.deletedDocCount }}
					/>
				</>
			)}
		</div>
	);
};

export default Notifications;
