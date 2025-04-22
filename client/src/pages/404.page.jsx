import { Link } from "react-router-dom";
import lightPageNotFoundImage from "../imgs/404-light.png";
import darkPageNotFoundImage from "../imgs/404-dark.png";
import lightFullLogo from "../imgs/inkspireLogoExtendedLight.png";
import darkFullLogo from "../imgs/inkspireLogoExtended.png";
import { useContext } from "react";
import { ThemeContext } from "../App";

const PageNotFound = () => {
	const { theme } = useContext(ThemeContext);

	return (
		<section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
			<img
				src={theme === "light" ? darkPageNotFoundImage : lightPageNotFoundImage}
				alt="Error image"
				className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
			/>
			<h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
			<p className="text-dark-grey text-xl leading-7 -mt-8">
				Page you are looking for doesn't exist. Head back to the{" "}
				<Link to="/" className="text-black underline">
					home page
				</Link>
			</p>
			<Link to="/" className="mt-auto">
				<img
					src={theme === "light" ? darkFullLogo : lightFullLogo}
					alt="website logo"
					className="h-16 object-contain block mx-auto select-none"
				/>
				<p className="mt-5 text-dark-grey">Read milions of stories from around the world</p>
			</Link>
		</section>
	);
};

export default PageNotFound;
