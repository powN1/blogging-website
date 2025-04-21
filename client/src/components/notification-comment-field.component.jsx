import { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../App";
import axios from "axios";

const NotificationCommentField = ({
	_id,
	blog_author,
	index = undefined,
	replyingTo = undefined,
	setIsReplying,
	notification_id,
	notificationData,
}) => {
	const [comment, setComment] = useState("");

	const { _id: user_id } = blog_author;

	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	const {
		notifications,
		notifications: { results },
		setNotifications,
	} = notificationData;

	const handleComment = () => {
		if (!comment.length) {
			return toast.error("Write something to leave a comment");
		}

		axios
			.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/api/add-comment",
				{
					_id,
					blog_author: user_id,
					comment,
					replying_to: replyingTo,
					notification_id,
				},
				{
					headers: {
						Authorization: `${access_token}`,
					},
				},
			)
			.then(({ data }) => {
				setIsReplying(false);

				results[index].reply = { comment, _id: data._id };
				setNotifications({ ...notifications, results });
			})
			.catch(err => console.log(err));
	};

	return (
		<>
			<Toaster />
			<textarea
				value={comment}
				placeholder="Leave a reply..."
				className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
				onChange={e => setComment(e.target.value)}
			></textarea>
			<button className="btn-dark mt-5 px-10" onClick={handleComment}>
				Reply
			</button>
		</>
	);
};

export default NotificationCommentField;
