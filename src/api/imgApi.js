import axios from "@/api/imgIndex";
//素材接口

export function UploadSingle(formData) {
  return axios({
    url: "/api/File/UploadSingle",
    method: "post",
    data: formData,
  });
}

export function UploadSingleToImage(data) {
  return axios({
    url: "/api/File/UploadSingleToImage",
    method: "post",
    data: data,
  });
}
