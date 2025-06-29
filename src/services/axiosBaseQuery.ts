import {axiosInstance} from "./api.ts";
import axios, {AxiosRequestConfig} from "axios";
import {SerializedError} from "@reduxjs/toolkit";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";

type AxiosBaseQueryResult =
    | { data: string }
    | { error: CustomErrorType | SerializedError | FetchBaseQueryError };

type BackendErrorData =
    | {
    message: string;
    errorCode?: string | number;
}
    | string;

type CustomErrorType = {
    status: number | undefined | string;
    data: BackendErrorData;
};

type axiosQueryArgs = {
    url: string;
    method: AxiosRequestConfig["method"];
    data?: unknown;
    params?: unknown;
};

export const axiosBaseQuery = ({baseUrl} = {baseUrl: ""}) => {
    return async ({
                      url,
                      method,
                      data,
                      params,
                  }: axiosQueryArgs): Promise<AxiosBaseQueryResult> => {
        try {
            const result = await axiosInstance({
                url: baseUrl + url,
                method,
                data,
                params,
            });
            return {data: result.data};
        } catch (axiosError) {
            const err = axiosError;
            if (axios.isAxiosError(err)) {
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    } as CustomErrorType,
                };
            } else {
                return {
                    error: {
                        status: "UNKNOWN_ERROR",
                        data: (err as Error).message || "An unexpected error occurred",
                    } as CustomErrorType,
                };
            }
        }
    };
};