import { AppError } from "@utils/AppError";
import axios from "axios";


const api = axios.create({
    baseURL: "http://192.168.1.109:3333"
})

api.interceptors.response.use((response)=> {

    return response
}, (error)=> {

    console.error("API ERROR:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })

    if (error.response && error.response.data?.message) {
      return Promise.reject(new AppError(error.response.data.message))
    } else {
      return Promise.reject(error)
    }
})

export {api}