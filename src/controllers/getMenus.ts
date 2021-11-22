import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import intranet from '../utils/intranet';
import { parse } from 'node-html-parser';
import xlsx from 'xlsx';

export default async (req: Request, res: Response) => {
  if (!process.env.HEIG_USERNAME || !process.env.HEIG_PASSWORD) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send('Please enter your HEIG credentials in your .env file.');
  }

  try {
    // Get Excel file link
    const { body } = await intranet.authenticatedCallNTLM({
      url: 'https://intra.heig-vd.ch/campus/cafeterias/Pages/menusetprix.aspx',
      login: process.env.HEIG_USERNAME,
      password: process.env.HEIG_PASSWORD,
    });
    const dom = parse(body);
    const element = dom.querySelector('.ms-vb.itx');
    const attrs: string = (element.childNodes[0] as any).rawAttrs;
    const hrefTagString = 'href="';
    const hrefPos = attrs.indexOf(hrefTagString);
    const quotePos = attrs.indexOf('"', hrefPos + hrefTagString.length);
    const xlsxLink = attrs.substring(hrefPos + hrefTagString.length, quotePos);
    console.log(xlsxLink);

    if (!xlsxLink)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send('Excel file not found on the Intranet page.');

    // Get XLSX data
    const { body: csvBuffer } = await intranet.authenticatedCallNTLM({
      url: xlsxLink,
      login: process.env.HEIG_USERNAME,
      password: process.env.HEIG_PASSWORD,
      binary: true,
    });

    const wb = xlsx.read(csvBuffer, { type: 'buffer' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];

    const rows = xlsx.utils
      .sheet_to_json(ws, { blankrows: true })
      .splice(8) // Remove title lines
      .slice(0, -1) // Remove last line: schedules
      .map((row: XLSXRow) => {
        return {
          tradition: row['__EMPTY'],
          vegetarien: row["L'ORANGERAIE"],
        };
      });

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const menus: Menus = {};
    let index = 0;

    for (const day of days) {
      console.log(day);
      menus[day] = { tradition: [], vegetarien: [] };
      for (let i = index; i < index + 6; i++) {
        if (rows[i].tradition) menus[day].tradition.push(rows[i].tradition);
        if (rows[i].vegetarien) menus[day].vegetarien.push(rows[i].vegetarien);
      }
      index += 7;
    }

    return res.status(StatusCodes.OK).send(menus);
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
};
