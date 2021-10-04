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

    // console.log(xlsx.utils.sheet_to_json(ws));
    const rows = xlsx.utils
      .sheet_to_json(ws)
      .splice(2) // Remove title lines
      .slice(0, -1) // Remove last line: schedules
      .map((row: XLSXRow) => {
        return {
          tradition: row['__EMPTY'],
          vegetarien: row["L'ORANGERAIE"],
        };
      });

    const delimiters = ['Crème de', 'Soupe', 'Potage'];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const menus: Menus = {};
    let dayId = -1;

    for (const row of rows) {
      let day = menus[days[dayId]];
      // New day
      let newDay = false;
      for (const delimiter of delimiters) {
        if (row.tradition.includes(delimiter)) {
          newDay = true;
          break;
        }
      }

      if (newDay) {
        day = menus[days[++dayId]] = {
          tradition: [],
          vegetarien: [],
        };
      }

      if (row.tradition) {
        day.tradition.push(row.tradition);
      }
      if (row.vegetarien) {
        day.vegetarien.push(row.vegetarien);
      }
    }

    return res.status(StatusCodes.OK).send(menus);
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.UNAUTHORIZED).send(e);
  }
};
