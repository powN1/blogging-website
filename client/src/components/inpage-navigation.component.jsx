import { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({ routes, defaultActiveIndex = 0, defaultHidden = [], children }) => {
	const [inPageNavIndex, setInPageNavIndex] = useState(null);

	const [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
	const [width, setWidth] = useState(window.innerWidth);

	activeTabLineRef = useRef();
	activeTabRef = useRef();

	const changePageState = (btn, i) => {
		let { offsetWidth, offsetLeft } = btn;

		activeTabLineRef.current.style.width = offsetWidth + "px";
		activeTabLineRef.current.style.left = offsetLeft + "px";

		setInPageNavIndex(i);
	};

	useEffect(() => {
		if (width > 766 && inPageNavIndex !== defaultActiveIndex) {
			changePageState(activeTabRef.current, defaultActiveIndex);
		}

		if (!isResizeEventAdded) {
			window.addEventListener("resize", () => {
				if (!isResizeEventAdded) {
					setIsResizeEventAdded(true);
				}
				setWidth(window.innerWidth);
			});
		}
	}, [width]);

	return (
		<>
			<div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflox-x-auto">
				{routes.map((route, i) => {
					return (
						<button
							key={i}
							ref={i === defaultActiveIndex ? activeTabRef : null}
							className={
								"p-4 px-5 capitalize " +
								(inPageNavIndex === i ? "text-black " : "text-dark-grey ") +
								(defaultHidden.includes(route) ? " md:hidden" : "")
							}
							onClick={e => changePageState(e.target, i)}
						>
							{route}
						</button>
					);
				})}

				<hr className="absolute bottom-0 duration-300 border-dark-grey" ref={activeTabLineRef} />
			</div>

			{Array.isArray(children) ? children[inPageNavIndex] : children}
		</>
	);
};

export default InPageNavigation;
