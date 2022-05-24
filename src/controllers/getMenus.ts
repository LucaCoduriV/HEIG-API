import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import intranet from '../utils/intranet';
import { parse } from 'node-html-parser';
import xlsx from 'xlsx';
import axios from 'axios';

export default async (req: Request, res: Response) => {
  if (!process.env.HEIG_USERNAME || !process.env.HEIG_PASSWORD) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send('Please enter your HEIG credentials in your .env file.');
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  let menus: Menus = {
    monday: {
      tradition: ['Seul le menu du jour est disponible.'],
      vegetarien: ['Seul le menu du jour est disponible.'],
    },
    tuesday: {
      tradition: ['Seul le menu du jour est disponible.'],
      vegetarien: ['Seul le menu du jour est disponible.'],
    },
    wednesday: {
      tradition: ['Seul le menu du jour est disponible.'],
      vegetarien: ['Seul le menu du jour est disponible.'],
    },
    thursday: {
      tradition: ['Seul le menu du jour est disponible.'],
      vegetarien: ['Seul le menu du jour est disponible.'],
    },
    friday: {
      tradition: ['Seul le menu du jour est disponible.'],
      vegetarien: ['Seul le menu du jour est disponible.'],
    },
  };

  try {
    let result = await axios.get(
      'https://top-chef-intra-api.blacktree.io/weeks/current',
      {
        headers: {
          'x-api-key': process.env.HEIG_API_KEY,
        },
      },
    );
    console.log(result.data.days);

    const menudays = result.data.days as {
      day: Date;
      menus: {
        starter: string;
        mainCourse: string[];
        dessert: string;
        containsPork: boolean;
      }[];
    }[];
    menudays.forEach((day, index) => {
      menus[days[index]] = {
        tradition: [
          day.menus[0].starter,
          ...day.menus[0].mainCourse,
          day.menus[0].dessert,
        ],
        vegetarien: [
          day.menus[1].starter,
          ...day.menus[1].mainCourse,
          day.menus[1].dessert,
        ],
      };
    });
    return res.send(menus);
  } catch (e) {
    console.log(e);
  }

  try {
    let todayIndex = new Date().getDay() - 1;
    let result = await axios.get('https://apix.blacktree.io/top-chef/today');

    menus[days[todayIndex]] = {
      tradition: [
        ...result.data.menus[0].mainCourse,
        result.data.menus[0].dessert,
      ],
      vegetarien: [
        ...result.data.menus[1].mainCourse,
        result.data.menus[1].dessert,
      ],
    };
    return res.status(StatusCodes.OK).send(menus);
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
};
