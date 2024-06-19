import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "../App";
import BlogEditor from "../components/blog-editor.component";
import Loader from "../components/loader.component";
import PublishForm from "../components/publish-form.component";

const blogStructure = {
	title: "",
	banner: "",
	content: [],
	tags: [],
	desc: "",
	author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
	const { blog_id } = useParams();

	const [blog, setBlog] = useState(blogStructure);
	const [editorState, setEditorState] = useState("editor");
	const [textEditor, setTextEditor] = useState({ isReady: false });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!blog_id) {
			return setLoading(false);
		}

		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id, draft: true, mode: "edit" })
			.then(({ data: { blog } }) => {
				setBlog(blog);
				setLoading(false);
			})
			.catch(err => console.log(err));
	}, []);

	let {
		userAuth: { access_token },
	} = useContext(UserContext);

	return (
		<EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
			{access_token === null ? (
				<Navigate to="/signin" />
			) : loading ? (
				<Loader />
			) : editorState === "editor" ? (
				<BlogEditor />
			) : (
				<PublishForm />
			)}
		</EditorContext.Provider>
	);
};

export default Editor;
