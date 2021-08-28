import axios from "axios";
import { parse, valid } from "node-html-parser";
import qs from "qs";
const icalToolkit = require("ical-toolkit");

export default class Gaps {
    static URL_BASE = "https://gaps.heig-vd.ch/";
    static URL_CONSULTATION_NOTES =
        Gaps.URL_BASE + "/consultation/controlescontinus/consultation.php";
    static URL_ATTENDANCE = Gaps.URL_BASE + "/consultation/etudiant/";
    static URL_TIMETABLE = Gaps.URL_BASE + "/consultation/horaires/";
    static DIR_DB_GAPS = "/heig.gaps/";
    static DIR_DB_TIMETABLE = "/heig.gaps.timetable/";

    async set_credentials(username: string, password: string): Promise<number> {
        const htmlString = "DEFAULT_STUDENT_ID = ";

        const header: any = {
            "User-Agent": "Gaps Mobile App v1.0",
        };

        const response = await axios.get(Gaps.URL_ATTENDANCE, {
            headers: header,
            auth: {
                username: username,
                password: password,
            },
        });

        const data: string = response.data;

        if (!data.includes(htmlString)) {
            throw Error("Wrong username or password");
        }

        const startIndex = data.indexOf(htmlString);
        const endIndex = data.indexOf(";", startIndex);

        return parseInt(data.substring(startIndex + htmlString.length, endIndex));
    }

    async get_notes(
        username: string,
        password: string,
        gapsId: number,
        year: number
    ): Promise<any> {
        if (!username || !password || !gapsId)
            throw Error("Username, password or gapsId is missing.");

        const response = await axios.post(
            Gaps.URL_CONSULTATION_NOTES,
            qs.stringify({
                rs: "getStudentCCs",
                rsargs: "[" + gapsId + "," + year + ",null]",
            }),
            {
                auth: {
                    username: username,
                    password: password,
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                    "User-Agent": "HEIG-API ('0.4.0')",
                },
            }
        );
        const data = JSON.parse((response.data as string).substring(2));

        const parsed = parse(data);
        const rows = parsed.querySelectorAll("tr");

        let notes: Array<Branche> = [];
        let nomBranche: string;
        let type: "cours" | "laboratoire";

        rows?.forEach((row) => {
            switch (row.childNodes.length) {
                case 1:
                    nomBranche = row.firstChild.textContent;
                    const splitted = nomBranche.split(" ");
                    nomBranche = splitted[0];
                    notes.push({
                        nom: nomBranche,
                        cours: [],
                        laboratoire: [],
                        moyenne: parseFloat(splitted[splitted.length - 1]),
                    });
                    break;
                case 6:
                    const text: any = row.firstChild.textContent;

                    if (text.includes("Cours")) {
                        type = "cours";
                    } else {
                        type = "laboratoire";
                    }
                    break;
                default:
                    const grade: any = row.childNodes[row.childNodes.length - 1].textContent;
                    const coef: any = row.childNodes[row.childNodes.length - 2].textContent;
                    const moyenne: any = row.childNodes[row.childNodes.length - 3].textContent;
                    const title: any = row.childNodes[row.childNodes.length - 4].textContent;
                    const reg = /(?<=\().\d*/g;
                    const regCoef = reg.exec(coef)[0];

                    let cvtCoef = parseFloat(regCoef);
                    let cvtGrade = parseFloat(grade);
                    let cvtMoyenne = parseFloat(moyenne);
                    notes[notes.length - 1][type].push({
                        moyenneClasse: !isNaN(cvtMoyenne) ? cvtMoyenne : 0.0,
                        titre: title,
                        note: !isNaN(cvtGrade) ? cvtGrade : 0.0,
                        coef: !isNaN(cvtCoef) ? cvtCoef : 0.0,
                    });
            }
        });

        return notes;
    }

    async get_horaires(
        username: string,
        password: string,
        year: number,
        trimestre: number,
        gapsId: number,
        type: number
    ): Promise<object> {
        const url: string = `${Gaps.URL_TIMETABLE}?annee=${year}&trimestre=${trimestre}&type=${type}&id=${gapsId}&icalendarversion=2&individual=1`;

        const response = await axios.get(url, {
            auth: {
                username: username,
                password: password,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                "User-Agent": "HEIG-API ('0.4.0')",
            },
        });

        return icalToolkit.parseToJSON(response.data);
    }

    async get_user_infos(username: string, password: string, gapsId: number): Promise<any> {
        const response = await axios.post(
            "https://gaps.heig-vd.ch/consultation/etudiant/",
            qs.stringify({
                rs: "smartReplacePart",
                rsargs: `["STUDENT_SELECT_ID","studentDataDiv","0",null,null,${gapsId},null]`, // à la base à la place de 0 il y avait 4044582100183115052 je ne sais pas pourquoi
            }),
            {
                auth: {
                    username: username,
                    password: password,
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                    "User-Agent": "HEIG-API ('0.4.0')",
                },
            }
        );

        const data = JSON.parse((response.data as string).substring(2));
        const parsed = parse(data);
        const img = parsed.querySelector("td#photo img");
        const avatar = Gaps.URL_BASE + "consultation" + img?.attributes["src"].substring(2);

        const infoStandardElements = parsed.querySelectorAll("td#infostandard td b");
        const firstname = infoStandardElements[1].innerText;
        const lastname = infoStandardElements[0].innerText;
        const birthdate = infoStandardElements[2].innerText;
        const address = infoStandardElements[3].innerText;
        const city = infoStandardElements[4].innerText;
        const phone = infoStandardElements[5].innerText;
        const email = infoStandardElements[6].innerText;

        return {
            firstname,
            lastname,
            img: avatar,
            birthdate,
            address,
            city,
            phone,
            email,
        };
    }
}
