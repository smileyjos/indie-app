import React from "react";

import Policy from "react-s3/lib/Policy";
import Signature from "react-s3/lib/Signature";
import { xAmzDate, dateYMD } from "react-s3/lib/Date";

import { v4 as uuidv4 } from "uuid";
import { Upload, message } from "antd";
import {
  LoadingOutlined,
  CloudUploadOutlined,
  SyncOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET,
  region: process.env.REACT_APP_S3_REGION,
  accessKeyId: process.env.REACT_APP_ACCESSKEYID,
  secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
};

const beforeUpload = (file) => {
  const isJpgOrPngOrGif =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/webp" ||
    file.type === "image/gif";
  if (!isJpgOrPngOrGif) {
    message.error("You can only upload JPG/PNG/WEBP/GIF file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    message.error("Image must smaller than 20MB!");
  }
  return isJpgOrPngOrGif && isLt2M;
};

export const uploadFile = async (file) => {
  const originalFilename = file.name;
  const fileExtension = originalFilename.split(".").pop();
  const newfileName = `${uuidv4()}.${fileExtension}`;

  const fd = new FormData();
  const key = `${config.dirName ? config.dirName + "/" : ""}${newfileName}`;
  const url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/`;
  fd.append("key", key);
  fd.append("acl", "public-read");
  fd.append("Content-Type", file.type);
  fd.append("x-amz-meta-uuid", "14365123651274");
  fd.append("x-amz-server-side-encryption", "AES256");
  fd.append(
    "X-Amz-Credential",
    `${config.accessKeyId}/${dateYMD}/${config.region}/s3/aws4_request`
  );
  fd.append("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
  fd.append("X-Amz-Date", xAmzDate);
  fd.append("x-amz-meta-tag", "");
  fd.append("Policy", Policy.getPolicy(config));
  fd.append(
    "X-Amz-Signature",
    Signature.getSignature(config, dateYMD, Policy.getPolicy(config))
  );
  fd.append("file", file);

  const params = {
    method: "post",
    headers: {
      fd,
    },
    body: fd,
  };

  const data = await fetch(url, params);
  if (!data.ok) return Promise.reject(data);
  return Promise.resolve({
    bucket: config.bucketName,
    key: `${config.dirName ? config.dirName + "/" : ""}${newfileName}`,
    location: `${url}${
      config.dirName ? config.dirName + "/" : ""
    }${newfileName}`,
    result: data,
  });
};

class Avatar extends React.Component {
  state = {
    loading: false,
    imageUrl: this.props.value || "",
  };

  handleChange = (info) => {
    this.setState({ loading: true });
    uploadFile(info)
      .then((data) => {
        const imageUrl = data.location;
        this.setState({
          imageUrl,
          loading: false,
        });
        this.props.onChange(imageUrl);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  onDelete = (e) => {
    this.setState({ imageUrl: "" });
    this.props.onChange("");
    e.stopPropagation();
  };

  render() {
    const { label, cover, disabled } = this.props;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <CloudUploadOutlined />}
        <div className="ant-upload-text" style={{ marginTop: "10px" }}>
          {label}
        </div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        data={this.handleChange}
        disabled={disabled}
      >
        {imageUrl ? (
          <React.Fragment>
            <img src={imageUrl} alt="avatar" style={{ width: "85%" }} />
            {cover === "delete" && (
              <span className="upload-cover" onClick={this.onDelete}>
                <DeleteOutlined /> &nbsp; {cover}
              </span>
            )}
            {cover && cover !== "delete" && (
              <span className="upload-cover">
                <SyncOutlined /> &nbsp; {cover}
              </span>
            )}
          </React.Fragment>
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}

export default Avatar;
