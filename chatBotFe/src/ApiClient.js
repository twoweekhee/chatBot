import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:8000/",  // Nginx 로드 밸런서의 주소
    timeout: 3000,
    headers: {
        },
    responseType: "json",
});
