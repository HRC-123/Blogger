import axios from "axios";

import {
  API_NOTIFICATION_MESSAGES,
  SERVICE_URLS,
} from "../constants/config.js";

import { getAccessToken, getType } from "../utils/common-utils.js";
// const API_URL = "http://localhost:8000/";
const API_URL = "https://bloggerserver.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json, multipart/form-data",
    "Content-Type": "application/json",
    authorization: getAccessToken(),
  },
});

axiosInstance.interceptors.request.use(
  //Successful case
  function (config) {
    if (config.TYPE.params) {
      config.params = config.TYPE.params;
    } else if (config.TYPE.query) {
      config.url = config.url + "/" + config.TYPE.query;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  //Successful case
  function (response) {
    //Stop global loader here
    return processResponse(response);
  },
  function (error) {
    //Stop global loader here
    return Promise.reject(processError(error));
  }
);

////////////////////////
//If success =>  return {isSuccess:true,data:Object}
//If fail    =>  return {isFailure:true,status:string,msg:string,code:int}
///////////////////////
const processResponse = (response) => {
  if (response?.status === 200) {
    return { isSuccess: true, data: response.data };
  } else {
    return {
      isFailure: true,
      status: response?.status,
      msg: response?.msg,
      code: response?.code,
    };
  }
};

const processError = async (error) => {
  if (error.response) {
    //request made and server responded with a status other
    //that falls out of range of 2.x.x
    console.log("ERROR IN RESPONSE", error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.responseFailure,
      code: error.response.status,
    };
  } else if (error.request) {
    //request made but no response was received
    console.log("ERROR IN RESPONSE ", error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.requestFailure,
      code: "", //We don't get any code because the request doesn't go to backend
    };
  } else {
    // something happened in setting up request that triggers an error
    console.log("ERROR IN NETWORK", error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.networkError,
      code: "",
    };
  }
};

const API = {};

for (const [key, value] of Object.entries(SERVICE_URLS)) {
  API[key] = (body, showUploadProgress, showDownloadProgress) =>
    axiosInstance({
      method: value.method,
      url: value.url,
      data: value.method === "DELETE" ? {} : body, //!Check why {} accepted but not null and " ";
      responseType: value.responseType,
      headers: {
        authorization: getAccessToken(),
      },
      TYPE: getType(value, body),
      onUploadProgress: function (progressEvent) {
        if (showUploadProgress) {
          let percentageCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          showUploadProgress(percentageCompleted);
        }
      },
      onDownloadProgress: function (progressEvent) {
        if (showDownloadProgress) {
          let percentageCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          showDownloadProgress(percentageCompleted);
        }
      },
    });
}

export { API };
