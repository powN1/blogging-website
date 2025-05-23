import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../App";
import uploadImage from "../common/aws";
import AnimationWrapper from "../common/page-animation";
import { storeInSession } from "../common/session";
import InputBox from "../components/input.component";
import Loader from "../components/loader.component";
import { profileDataStructure } from "./profile.page";

const EditProfile = () => {
  const {
    userAuth,
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const bioLimit = 150;
  const profileImgElement = useRef();
  const editProfileForm = useRef();

  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);
  const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

  const {
    personal_info: { fullname, username: profile_username, profile_img, email, bio },
    social_links,
  } = profile;

  useEffect(() => {
    if (access_token) {
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/api/get-profile", { username: userAuth.username })
        .then(({ data }) => {
          setProfile(data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [access_token]);

  const handleCharacterChange = (e) => {
    setCharactersLeft(bioLimit - e.target.value.length);
  };

  const handleImagePreview = (e) => {
    const img = e.target.files[0];

    profileImgElement.current.src = URL.createObjectURL(img);

    setUpdatedProfileImg(img);
  };

  const handleImgUpload = (e) => {
    e.preventDefault();

    if (updatedProfileImg) {
      const loadingToast = toast.loading("Uploading...");

      e.target.setAttribute("disabled", true);

      uploadImage(updatedProfileImg)
        .then((url) => {
          if (url) {
            axios
              .post(
                import.meta.env.VITE_SERVER_DOMAIN + "/api/update-profile-img",
                { url: url },
                {
                  headers: {
                    Authorization: `${access_token}`,
                  },
                }
              )
              .then(({ data }) => {
                const newUserAuth = { ...userAuth, profile_img: data.profile_img };

                storeInSession("user", JSON.stringify(newUserAuth));
                setUserAuth(newUserAuth);

                setUpdatedProfileImg(null);
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.success("Uploaded");
              })
              .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.error(response.data.error);
              });
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(editProfileForm.current);
    const formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    const { username, bio, youtube, twitter, github, facebook, instagram, website } = formData;

    if (username.length < 3) {
      return toast.error("Username should be at least 3 characters long");
    }
    if (bio.length > bioLimit) {
      return toast.error(`Bio should be shorter than ${bioLimit} characters long`);
    }

    const loadingToast = toast.loading("Updating");
    e.target.setAttribute("disabled", true);

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/update-profile",
        { username, bio, social_links: { youtube, facebook, twitter, github, instagram, website } },
        {
          headers: {
            Authorization: `${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        console.log(`Data came back: ${data}`);
        if (userAuth.username !== data.username) {
          const newUserAuth = { ...userAuth, username: data.username };

          storeInSession("user", JSON.stringify(newUserAuth));
          setUserAuth(newUserAuth);
        }

        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        toast.success("Profile Updated");
      })
      .catch(({ response }) => {
        console.log(`error: ${response}`);
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        toast.error(response.data.error);
      });
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editProfileForm} onSubmit={handleSubmit}>
          <Toaster />
          <h1 className="max-md:hidden">Edit Profile</h1>
          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5">
              <label
                htmlFor="uploadImg"
                id="profileImgLabel"
                className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
              >
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                  Upload Image
                </div>
                <img src={profile_img} ref={profileImgElement} />
              </label>

              <input type="file" id="uploadImg" accept=".jpg, .jpeg, .png" hidden onChange={handleImagePreview} />

              <button className="btn-light mt-5 max-lg:center lg:w-full px-10" onClick={handleImgUpload}>
                Upload
              </button>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <div>
                  <InputBox
                    name="fullname"
                    type="text"
                    value={fullname}
                    placeholder="Full Name"
                    icon="fi-rr-user"
                    disabled={true}
                  />
                </div>
                <div>
                  <InputBox
                    name="email"
                    type="email"
                    value={email}
                    placeholder="Email"
                    icon="fi-rr-envelope"
                    disabled={true}
                  />
                </div>
              </div>

              <InputBox type="text" name="username" value={profile_username} placeholder="username" icon="fi-rr-at" />

              <p className="text-dark-grey -mt-3">
                Username will be used to search user and will be visible to all users
              </p>

              <textarea
                name="bio"
                maxLength={bioLimit}
                defaultValue={bio}
                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                placeholder="Bio"
                onChange={handleCharacterChange}
              ></textarea>

              <p className="mt-1 text-dark-grey">{charactersLeft} characters left</p>

              <p className="my-6 text-dark-grey">Add your social handles</p>

              <div className="md:grid md:grid-cols-2 gap-x-6">
                {Object.keys(social_links).map((key, i) => {
                  const link = social_links[key];

                  return (
                    <InputBox
                      key={i}
                      name={key}
                      type="text"
                      value={link}
                      placeholder="https://"
                      icon={"fi " + (key !== "website" ? "fi-brands-" + key : "fi-rr-globe")}
                    />
                  );
                })}
              </div>
              <button className="btn-dark w-auto px-10" type="submit">
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default EditProfile;
