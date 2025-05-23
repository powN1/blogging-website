import axios from "axios";

const uploadImage = async (img) => {
  let imgUrl = null;

  await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/get-upload-url")
    .then(async ({ data: { uploadUrl } }) => {
      await axios({
        method: "PUT",
        url: uploadUrl,
        headers: { "Content-Type": "multipart/form-data" },
        data: img,
      }).then(() => {
        imgUrl = uploadUrl.split("?")[0];
      });
    });
  return imgUrl;
};

export default uploadImage;
