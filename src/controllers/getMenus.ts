import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import intranet from "../utils/intranet";
import { parse } from "node-html-parser";

export default async (req: Request, res: Response) => {
  if (!process.env.HEIG_USERNAME || !process.env.HEIG_PASSWORD) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send("Please enter your HEIG credentials in your .env file.");
  }

  try {
    // Get PDF link
    const { body } = await intranet.authenticatedCallNTLM({
      url: "https://intra.heig-vd.ch/campus/cafeterias/Pages/menusetprix.aspx",
      login: process.env.HEIG_USERNAME,
      password: process.env.HEIG_PASSWORD,
    });
    const dom = parse(body);
    const csvLink = dom.querySelector("div[app=ms-excel] a")
    console.log(csvLink)
    // .getAttribute('href')

    return res.status(StatusCodes.OK).send(body);
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.UNAUTHORIZED).send(e);
  }
};
