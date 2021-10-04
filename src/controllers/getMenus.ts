import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import intranet from "../utils/intranet";
import { parse } from "node-html-parser";
import xlsx from "xlsx";

export default async (req: Request, res: Response) => {
  if (!process.env.HEIG_USERNAME || !process.env.HEIG_PASSWORD) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send("Please enter your HEIG credentials in your .env file.");
  }

  try {
    // Get Excel file link
    const { body } = await intranet.authenticatedCallNTLM({
      url: "https://intra.heig-vd.ch/campus/cafeterias/Pages/menusetprix.aspx",
      login: process.env.HEIG_USERNAME,
      password: process.env.HEIG_PASSWORD,
    });
    const dom = parse(body);
    const element = dom.querySelector(".ms-vb.itx");
    const attrs: string = (element.childNodes[0] as any).rawAttrs;
    const hrefTagString = 'href="';
    const hrefPos = attrs.indexOf(hrefTagString);
    const quotePos = attrs.indexOf('"', hrefPos + hrefTagString.length);
    const xlsxLink = attrs.substring(hrefPos + hrefTagString.length, quotePos);
    console.log(xlsxLink);

    // Get XLSX data
    const { body: csvBuffer } = await intranet.authenticatedCallNTLM({
      url: xlsxLink,
      login: process.env.HEIG_USERNAME,
      password: process.env.HEIG_PASSWORD,
      binary: true,
    });

    const wb = xlsx.read(csvBuffer, { type: "buffer" });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];

    // console.log(xlsx.utils.sheet_to_json(ws));
    const data = xlsx.utils
      .sheet_to_json(ws)
      .splice(2) // Remove title lines
      .map((row: XLSXRow, index) => {
        return {
          tradition: row["__EMPTY"],
          vegetarien: row["L'ORANGERAIE"],
        };
      });

    console.log(data);
    console.log(data.length);

    return res.status(StatusCodes.OK).send(body);
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.UNAUTHORIZED).send(e);
  }
};
