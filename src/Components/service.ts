import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.React_APP_BASE_URL,
});

export const getPosts = async (pageNo: number) => {
    return await axiosInstance.get(`${'search_by_date?tags=story&page='}${pageNo}`)
}