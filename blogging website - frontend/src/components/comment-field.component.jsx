import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../App";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentField = ({ action, index = null, replyingTo = undefined, setReplying }) => {
  const {
    blog,
    setBlog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      comments: { results: commentsArr },
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const {
    userAuth: { access_token, username, fullname, profile_img },
  } = useContext(UserContext);

  const [comment, setComment] = useState("");

  const handleCommentSubmition = () => {
    if (!access_token) {
      return toast.error("Login first to leave a comment");
    }
    if (!comment.length) {
      return toast.error("Write something to leave a comment");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",
        {
          _id,
          blog_author,
          comment,
          replying_to: replyingTo,
        },
        {
          headers: {
            Authorization: `${access_token}`,
          },
        },
      )
      .then(({ data }) => {
        setComment("");

        data.commented_by = { personal_info: { username, profile_img, fullname } };

        let newCommentArr;

        if (replyingTo) {
          commentsArr[index].children.push(data._id);

          data.childrenLevel = commentsArr[0].childrenLevel + 1;

          data.parentIndex = index;

          commentsArr[index].isReplyLoaded = true;

          commentsArr.splice(index + 1, 0, data);

          newCommentArr = commentsArr;

          setReplying(false);
        } else {
          data.childrenLevel = 0;

          newCommentArr = [data, ...commentsArr];
        }

        let parentCommentIncrementValue = replyingTo ? 0 : 1;

        setBlog({
          ...blog,
          comments: { ...comments, results: newCommentArr },
          activity: {
            ...activity,
            total_comments: total_comments + 1,
            total_parent_comments: total_parent_comments + parentCommentIncrementValue,
          },
        });

        setTotalParentCommentsLoaded((prevVal) => prevVal + parentCommentIncrementValue);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
        onChange={(e) => setComment(e.target.value)}
      >
      </textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleCommentSubmition}>
        {action}
      </button>
    </>
  );
};

export default CommentField;
