import { records, screening, user, apps } from "../assets";

export const navLinks = [
  {
    name: "dashboard",
    imgUrl: apps,
    link: "/",
  },
  {
    name: "records",
    imgUrl: records,
    link: "/medical-records",
  },
  {
    name: "screening",
    imgUrl: screening,
    link: "/screening-schedules",
  },
  {
    name: "profile",
    imgUrl: user,
    link: "/profile",
  },
];
