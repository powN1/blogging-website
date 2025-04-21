import axios from "axios";
import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import { storeInSession } from "../common/session";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
	let {
		userAuth: { access_token },
		setUserAuth,
	} = useContext(UserContext);

	const userAuthThroughServer = (serverRoute, formData) => {
		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
			.then(({ data }) => {
				storeInSession("user", JSON.stringify(data));
				setUserAuth(data);
			})
			.catch(({ response }) => {
				toast.error(response.data.error);
			});
	};

	const handleSubmit = e => {
		e.preventDefault();

		const serverRoute = type === "sign-in" ? "/api/signin" : "/api/signup";

		// Regex for identifying whether the email and password are correctly formatted
		let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
		let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

		// form data
		let form = new FormData(formElement);
		let formData = {};
		for (let [key, value] of form.entries()) {
			formData[key] = value;
		}

		const { fullname, email, password } = formData;

		if (fullname) {
			if (fullname.length < 3) {
				return toast.error("Fullname must be at least 3 letters long");
			}
		}
		if (!email.length) {
			return toast.error("Enter email");
		}
		if (!emailRegex.test(email)) {
			return toast.error("Email is invalid");
		}
		if (!passwordRegex.test(password)) {
			return toast.error("Password should be 6-20 characters long with a numeric, 1 lowercase and 1 uppercase letters");
		}

		userAuthThroughServer(serverRoute, formData);
	};

	const handleGoogleAuth = e => {
		e.preventDefault();
		authWithGoogle()
			.then(user => {
				let serverRoute = "/api/google-auth";

				let formData = {
					access_token: user.accessToken,
				};

				userAuthThroughServer(serverRoute, formData);
			})
			.catch(err => {
				toast.error("Trouble loggin in through google");
				return console.log(err);
			});
	};

	return access_token ? (
		<Navigate to="/"></Navigate>
	) : (
		<AnimationWrapper keyValue={type}>
			<section className="h-cover flex items-center justify-center">
				<Toaster />
				<form id="formElement" className="w-[90%] md:w-2/3 lg:w-1/4 max-width-[400px]">
					<h1 className="text-4xl font-gelasio captialize text-center mb-24">
						{type === "sign-in" ? "Welcome back" : "Join us today"}
					</h1>
					{type !== "sign-in" ? (
						<InputBox name="fullname" type="text" placeholder="Full Name" icon="fi-rr-user" />
					) : null}
					<InputBox name="email" type="email" placeholder="Email" icon="fi-rr-envelope" />
					<InputBox name="password" type="password" placeholder="Password" icon="fi-rr-key" />
					<button onClick={handleSubmit} className="btn-dark center mt-14 w-[90%]" type="submit">
						{type.replace("-", " ")}
					</button>
					<div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
						<hr className="w-1/2 border-black" />
						<p>or</p>
						<hr className="w-1/2 border-black" />
					</div>
					<button onClick={handleGoogleAuth} className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
						<img className="w-5" src={googleIcon} alt="google icon" />
						continue with google
					</button>
					{type === "sign-in" ? (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Don't have an account?
							<Link to="/signup" className="underline text-black text-xl ml-1">
								Join us today
							</Link>
						</p>
					) : (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Already a member?
							<Link to="/signin" className="underline text-black text-xl ml-1">
								Sign in here
							</Link>
						</p>
					)}
				</form>
			</section>
		</AnimationWrapper>
	);
};

export default UserAuthForm;
