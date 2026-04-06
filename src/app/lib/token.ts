"use client";
import { eraseCookie, getCookie, setCookie } from "../utils/cookies/cookies.util";

export const Token = {
  get: () => {
    if (typeof document === "undefined") return null;
    return getCookie("token");
  },
  getRefresh: () => {
    if (typeof document === "undefined") return null;
    return getCookie("refresh_token");
  },
  set: (token: string) => {
    if (typeof document === "undefined") return;
    return setCookie("token", token, 100);
  },
  setRefresh: (token: string) => {
    if (typeof document === "undefined") return;
    return setCookie("refresh_token", token, 100);
  },
  remove: () => {
    if (typeof document === "undefined") return;
    return eraseCookie("token");
  },
  removeRefresh: () => {
    if (typeof document === "undefined") return;
    return eraseCookie("refresh_token");
  },
};
