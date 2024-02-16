import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getConditionalClass(statusAttempt: string, consent: string) {
  // Handle cases where "Door Knock Attempt" is part of the string
  if (statusAttempt.includes("Door Knock Attempt")) {
    return "bg-blue-200 text-blue-900";
  }

  switch (statusAttempt) {
    case "No Attempt":
      return "bg-gray-300 text-gray-800";
    case "Drop Type Unverified":
    case "Drop Type Unverified Needs Verification":
      return "bg-yellow-200 text-yellow-900";
    case "Consent Final":
      return consent.toLowerCase() === "yes"
        ? "bg-green-200 text-green-900"
        : consent.toLowerCase() === "no"
        ? "bg-red-200 text-red-900"
        : "bg-gray-200 text-gray-900";
    case "Consent Final Yes":
      return "bg-green-200 text-green-900";
    case "Consent Final No":
      return "bg-red-200 text-red-900";
    case "engineer visit required":
      return "bg-teal-200 text-teal-900";
    case "Home Does Not Exist":
      return "bg-black-200 text-black-900";
    default:
      return "border-2 border-black text-blue-900";
  }
}


export const defaultValues = {
  defaultPerPage: 20,
  defaultPage: 1,
}
export const SalesForce = {
  URL: "https://bellconsent.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttps%253A%252F%252Fbellconsent.lightning.force.com%252Flightning%252Fn%252FBell",
  username: "yalmeida.rj@gmail.com",
  password: "rYeEsydWN!8808168eXkA9gV47A",
  iFrameXpath:
    "/html/body/div[4]/div[1]/section/div[1]/div/div[2]/div[1]/div/div/div/div/div/div/force-aloha-page/div/iframe",
  selectTagSelector:
    "body > div.container.map.noPad > div:nth-child(2) > div > div.row.mapSearch.ng-scope > div.col-lg-10.col-md-12.col-sm-12.col-xs-12 > div > div.col-lg-3.col-md-3.col-sm-3 > select",
  view100RecordsSelector:
    "body > div.container.map.noPad > div:nth-child(2) > div > div.row.mapTable.ng-scope > div.col-lg-10.col-md-12.col-sm-12.col-xs-12 > div > div.ng-scope.ng-isolate-scope > div > ul > li:nth-child(7) > div > button:nth-child(4)",
  view100RecordsSelectorXpath:
    "/html/body/div[1]/div[2]/div/div[5]/div[2]/div/div[2]/div/ul/li[7]/div/button[4]",

  tableSelector:
    "body > div.container.map.noPad > div:nth-child(2) > div > div.row.mapTable.ng-scope > div.col-lg-10.col-md-12.col-sm-12.col-xs-12 > div",
  // body > div.container.map.noPad > div:nth-child(2) > div > div.row.mapSearch.ng-scope > div.col-lg-10.col-md-12.col-sm-12.col-xs-12 > div > div.col-lg-3.col-md-3.col-sm-3 > select > option:nth-child(1)
  siteOptions: {'ALTOON41_2012A': '1', 'ALTOON41_3013C': '2', 'ALTOON41_3023B': '3', 'ALTOON41_3041A': '4', 'ALTOON41_4021A': '5', 'ANCSON04_1931A': '6', 'AURRON91_3031A': '7', 'BARION18_1891A': '8', 'BARION18_4022AA': '9', 'BARION18_4342A': '10', 'BLNHON15_1011A': '11', 'BLNHON15_1013A': '12', 'BLNHON15_3012A': '13', 'BLRVON02_1613A': '14', 'BLRVON02_3611A': '15', 'BLRVON02_3613A': '16', 'BLRVON02_3621A': '17', 'BLRVON02_3634A': '18', 'BMTNON37_2712A': '19', 'BMVLON08_1014B': '20', 'BMVLON08_1111B': '21', 'BRKLON97_1802A': '22', 'BRKLON97_3021A': '23', 'BRKLON97_3024A': '24', 'BRKLON97_3032A': '25', 'BRKLON97_3611A': '26', 'BRKLON97_3612A': '27', 'BRKLON97_3811A': '28', 'BRKLON97_4601A': '29', 'BRKLON97_4604A': '30', 'BRKLON97_4821D': '31', 'BURLON02_2026A': '32', 'BURLON02_2061B': '33', 'BURLON02_2093A': '34', 'BURLON03_1061A': '35', 'CALDON28_3801A': '36', 'CPBDON20_2841A': '37', 'CPBDON20_2871A': '38', 'DNDSON12_1821AA': '39', 'DNDSON12_1821AAA': '40', 'DNDSON12_1921AA': '41', 'ELVAON01_3831B': '42', 'ELVAON01_3841A': '43', 'EMVLON52_2621A': '44', 'EMVLON52_3611A': '45', 'ESSXON03_2011A': '46', 'ESSXON03_2011B': '47', 'ESSXON03_3021A': '48', 'ESSXON03_3043A': '49', 'ESSXON03_4012A': '50', 'ESSXON03_4021A': '51', 'ETLKON02_3133A': '52', 'GALTON04_2861A': '53', 'GLPHON22_1062A': '54', 'GMLYON20_1021A': '55', 'GMLYON20_3011A': '56', 'GMLYON20_3112A': '57', 'GMLYON20_3115A': '58', 'GMLYON20_3122A': '59', 'GMLYON20_3131A': '60', 'GMLYON20_3191A': '61', 'GMLYON20_3831A': '62', 'GMLYON20_3836A': '63', 'HMPNON67_1811A': '64', 'HMPNON67_1822AA': '65', 'HMTNON02_3033A': '66', 'HMTNON02_3045A': '67', 'HMTNON02_3046A': '68', 'HMTNON02_3113A': '69', 'HMTNON02_4051A': '70', 'HMTNON02_4062A': '71', 'HMTNON02_4085A': '72', 'HMTNON02_4222A': '73', 'HMTNON02_4224A': '74', 'HMTNON14_1322A': '75', 'HMTNON14_1522A': '76', 'HMTNON14_1711A': '77', 'HMTNON14_3311A': '78', 'HMTNON14_3316A': '79', 'HMTNON14_5123B': '80', 'HMTNON14_5132A': '81', 'HMTNON14_7101A': '82', 'HMTNON14_7221A': '83', 'HMTNON14_7232A': '84', 'HMTNON14_7422A': '85', 'HRRWON04_1012A': '86', 'JKVLON05_1043A': '87', 'JKVLON05_1043B': '88', 'JKVLON05_1059A': '89', 'KGCYON87_3611CC': '90', 'KGVLON05_4802A': '91', 'KNBGON21_1811A': '92', 'KNBGON21_1851B': '93', 'KNBGON21_2011A': '94', 'KNTAON16_2321A': '95', 'KTNRON06_3161B': '96', 'KTNRON06_3704A': '97', 'KTNRON06_3709A': '98', 'KTNRON06_3723A': '99', 'KTNRON06_3911A': '100', 'KTNRON06_3942C': '101', 'KTNRON06_3951C': '102', 'KTNRON06_3961B': '103', 'KTNRON06_3972A': '104', 'KTNRON06_3983A': '105', 'KTNRON08_4101A': '106', 'LMTNON07_2011A': '107', 'LMTNON07_2012A': '108', 'LMTNON07_2013A': '109', 'LMTNON07_4013A': '110', 'LONDON14_1032A': '111', 'LONDON14_1042A': '112', 'LONDON14_1071A': '113', 'LONDON14_1083A': '114', 'LONDON14_1091A': '115', 'LONDON14_1095A': '116', 'LONDON14_1111D': '117', 'LONDON14_1121A': '118', 'LONDON14_1223B': '119', 'LONDON14_1241B': '120', 'LONDON14_1244A': '121', 'LONDON14_1291B': '122', 'LONDON14_1316A': '123', 'LONDON14_1372A': '124', 'LONDON14_2073C': '125', 'MAPLON23_1102B': '126', 'MAPLON23_1133A': '127', 'MAPLON23_2035A': '128', 'MAPLON23_2041A': '129', 'MAPLON23_2061A': '130', 'MAPLON23_2062A': '131', 'MAPLON23_3311A': '132', 'MAPLON23_3312A': '133', 'MAPLON23_3314B': '134', 'MAPLON23_3401A': '135', 'MAPLON23_3401B': '136', 'MAPLON23_3401C': '137', 'MLTNON25_4504A': '138', 'MNSTON31_3681AA': '139', 'MNSTON31_3692A': '140', 'MRHMON24_2811A': '141', 'NOTLON09_1016A': '142', 'NRBAON24_1811A': '143', 'NRBAON24_2821A': '144', 'NWMKON85_1034A': '145', 'ORLNON06_2173A': '146', 'ORLNON06_3641A': '147', 'OSHWON95_1171A': '148', 'OSHWON95_1251A': '149', 'OSHWON95_1261A': '150', 'OSHWON95_2801C': '151', 'OTWAON01_5041A': '152', 'OTWAON10_2422A': '153', 'OTWAON10_5111A': '154', 'PCNGON62_1011A': '155', 'PCNGON62_1021B': '156', 'PCNGON62_1031A': '157', 'PCNGON62_1061A': '158', 'PCNGON62_1063A': '159', 'PCNGON62_1106A': '160', 'PCNGON62_1109A': '161', 'PCNGON62_1112A': '162', 'PLGVON53_1831A': '163', 'PLGVON53_1832A': '164', 'PLGVON53_3011A': '165', 'PWSNON31_2801A': '166', 'PWSNON31_4801A': '167', 'PWSNON31_4812A': '168', 'RMHLON34_3015B': '169', 'RMHLON34_3025B': '170', 'RMHLON34_3051A': '171', 'RMHLON34_3101A': '172', 'RMHLON34_3206A': '173', 'SFVLON28_1033A': '174', 'SFVLON28_3506A': '175', 'SFVLON28_3508A': '176', 'SFVLON34_1032A': '177', 'SFVLON34_1033B': '178', 'SSVLON39_1521A': '179', 'SSVLON39_3021A': '180', 'STCTON10_1771B': '181', 'STRDON29_4812A': '182', 'STTNON82_1031A': '183', 'STTNON82_1042A': '184', 'STTNON82_1042AA': '185', 'STTNON82_1051A': '186', 'STTNON82_1201A': '187', 'STTNON82_1211AA': '188', 'STTNON82_2601A': '189', 'TCMSON20_2121A': '190', 'TNHLON40_1021A': '191', 'TNHLON40_3024A': '192', 'TNHLON40_3101A': '193', 'TNHLON40_3102A': '194', 'TNHLON40_3103A': '195', 'TNHLON40_3104A': '196', 'TNHLON40_4021A': '197', 'TNHLON40_4041A': '198', 'TNHLON40_4043A': '199', 'TNHLON40_4081A': '200', 'TNHLON40_4101A': '201', 'TNHLON40_4111A': '202', 'TNHLON40_4121A': '203', 'TNHLON40_4122A': '204', 'TNHLON40_4162A': '205', 'TNHLON40_4212A': '206', 'TNHLON40_4252A': '207', 'TNHLON40_4261A': '208', 'TRCKON40_1601A': '209', 'TRCKON40_1601AA': '210', 'TRCKON40_1801A': '211', 'TRCKON40_1801AA': '212', 'TRCKON40_4801A': '213', 'TRCKON40_4801AA': '214', 'UNVLON55_1052A': '215', 'VCTAON41_1020A': '216', 'VCTAON41_1811A': '217', 'WDBGON48_2111A': '218', 'WDBGON48_2201B': '219', 'WNDSON13_3123A': '220', 'WNPGMB06_101-7': '221', 'WNPGMB06_401-2': '222', 'WNPGMB06_406-1': '223', 'WTBYON94_2013A': '224', 'WTBYON94_2013B': '225', 'WTBYON94_2044A': '226', 'WTBYON94_2051C': '227', 'WTBYON94_3013B': '228', 'WTBYON94_3064A': '229'},

  puppeterApi: {
    url: "https://tdxpuppeteernodeweb.onrender.com",
    endpoint: "/search",
  },
};

