import { ICrossword, IWord, computeGrid } from '../types/crossword';

function make(
  id: string,
  name: string,
  words: IWord[],
  createdAt: number
): ICrossword {
  return { id, name, words: words.map(w => ({ ...w, answer: w.answer.toUpperCase() })), grid: computeGrid(words), likes: 0, createdAt };
}

// ---------------------------------------------------------------------------
// Crossword 1 – №1 (original)
// ---------------------------------------------------------------------------
const cw1Words: IWord[] = [
  // Horizontal
  { index: '1',  question: 'Вхід з порожнини рота в глотку',                                                       answer: 'ЗІВ',       row: 0,  col: 0, vertical: false },
  { index: '4',  question: 'Багато плодових дерев',                                                                  answer: 'САД',       row: 0,  col: 6, vertical: false },
  { index: '6',  question: "М'який, легкий метал сріблясто-білого кольору (Sn)",                                     answer: 'ОЛОВО',     row: 1,  col: 2, vertical: false },
  { index: '7',  question: 'Двадцять четверта літера грузинської абетки',                                            answer: 'КАР',       row: 2,  col: 0, vertical: false },
  { index: '8',  question: 'Велике приміщення для багатолюдних зборів',                                              answer: 'ЗАЛ',       row: 2,  col: 6, vertical: false },
  { index: '9',  question: 'Закріплення паянням чого-небудь у чомусь',                                               answer: 'ВПАЮВАННЯ', row: 4,  col: 0, vertical: false },
  { index: '14', question: 'Фахівець з океанології',                                                                 answer: 'ОКЕАНОЛОГ', row: 6,  col: 0, vertical: false },
  { index: '19', question: 'Протилежне добру',                                                                       answer: 'ЗЛО',       row: 8,  col: 0, vertical: false },
  { index: '20', question: 'Спільна назва мінералів — землистих сумішей гідроксидів марганцю',                       answer: 'ВАД',       row: 8,  col: 6, vertical: false },
  { index: '21', question: 'Те саме, що радіолокатор',                                                               answer: 'РАДАР',     row: 9,  col: 2, vertical: false },
  { index: '22', question: 'Сполучені Штати',                                                                        answer: 'США',       row: 10, col: 0, vertical: false },
  { index: '23', question: "Художній фільм режисера Олександра Іванівського (1928 р.)",                               answer: 'АСЯ',       row: 10, col: 6, vertical: false },
  // Vertical
  { index: '1',  question: "Актор, який зіграв Уерлі у фільмі «Звіробій» (1990)",                                    answer: 'ЗАКОВ',     row: 0,  col: 0, vertical: true },
  { index: '2',  question: 'Густий пушок з коротких волокон на поверхні деяких тканин',                              answer: 'ВОРСА',     row: 0,  col: 2, vertical: true },
  { index: '3',  question: 'Сукупність душевних якостей людини, які проявляються в її діях, поведінці',              answer: 'НОРОВ',     row: 0,  col: 4, vertical: true },
  { index: '4',  question: 'Муніципалітет у Франції, у регіоні Бретань, департамент Морбіан',                        answer: 'СОЗОН',     row: 0,  col: 6, vertical: true },
  { index: '5',  question: 'Населений пункт у Сирії, що входить до складу району Джебла провінції Латакія',          answer: 'ДАЛІЯ',     row: 0,  col: 8, vertical: true },
  { index: '10', question: 'Ще б ...!',                                                                              answer: 'ПАК',       row: 4,  col: 1, vertical: true },
  { index: '11', question: 'Штат у США',                                                                             answer: 'ЮТА',       row: 4,  col: 3, vertical: true },
  { index: '12', question: 'Розділовий сполучник',                                                                   answer: 'АБО',       row: 4,  col: 5, vertical: true },
  { index: '13', question: "Неопізнаний літаючий об'єкт",                                                            answer: 'НЛО',       row: 4,  col: 7, vertical: true },
  { index: '14', question: 'Родюче місце в пустелі або напівпустелі з буйною рослинністю і прісною водою',           answer: 'ОАЗИС',     row: 6,  col: 0, vertical: true },
  { index: '15', question: 'Місто на сході Португалії, центр однойменного округу та муніципалітету',                 answer: 'ЕВОРА',     row: 6,  col: 2, vertical: true },
  { index: '16', question: 'Те саме, що знайда',                                                                     answer: 'НАЙДА',     row: 6,  col: 4, vertical: true },
  { index: '17', question: 'Києво-Печерська ....',                                                                    answer: 'ЛАВРА',     row: 6,  col: 6, vertical: true },
  { index: '18', question: 'Гад (збірне)',                                                                            answer: 'ГАДДЯ',     row: 6,  col: 8, vertical: true },
];

// ---------------------------------------------------------------------------
// Crossword 2 – №6 (original)
// ---------------------------------------------------------------------------
const cw2Words: IWord[] = [
  // Horizontal
  { index: '1',  question: 'Боєць десантної групи, учасник десанту',                                                 answer: 'ДЕСАНТНИК',  row: 0,  col: 0, vertical: false },
  { index: '5',  question: 'Двигун літака, вертольота',                                                              answer: 'АВІАМОТОР',  row: 2,  col: 0, vertical: false },
  { index: '9',  question: 'Кмітливий влучний вислів із сатиричним або жартівливим відтінком',                       answer: 'ДОТЕП',      row: 4,  col: 2, vertical: false },
  { index: '10', question: 'Київський військовий округ (скор.)',                                                      answer: 'КВО',        row: 5,  col: 0, vertical: false },
  { index: '11', question: 'Орган зору',                                                                             answer: 'ОКО',        row: 5,  col: 6, vertical: false },
  { index: '12', question: 'Місце на мілководді, обладнане для купання дітей',                                       answer: 'ЛАТАЧ',      row: 6,  col: 2, vertical: false },
  { index: '14', question: 'Розділ математики, що обґрунтовує логіку математичними методами',                        answer: 'ЛОГІСТИКА',  row: 8,  col: 0, vertical: false },
  { index: '17', question: 'Учасник народно-визвольної боротьби',                                                    answer: 'ГАЙДАМАКА',  row: 10, col: 0, vertical: false },
  // Vertical
  { index: '1',  question: 'Фахівець із діалектології',                                                             answer: 'ДІАЛЕКТОЛОГ', row: 0, col: 0, vertical: true },
  { index: '2',  question: 'Група довгохвостих папуг',                                                               answer: 'АРА',         row: 0, col: 3, vertical: true },
  { index: '3',  question: 'Фон',                                                                                    answer: 'ТЛО',         row: 0, col: 5, vertical: true },
  { index: '4',  question: 'Крива лінія, яка відбиває зміни будь-якого показника функції серця',                     answer: 'КАРДІОГРАМА',  row: 0, col: 8, vertical: true },
  { index: '6',  question: 'Фахівець з індології',                                                                   answer: 'ІНДОЛОГ',     row: 2, col: 2, vertical: true },
  { index: '7',  question: 'Положення в шаховій партії, за якого король не може захиститися',                        answer: 'МАТ',         row: 2, col: 4, vertical: true },
  { index: '8',  question: 'Легкі домашні або спортивні туфлі переважно без підборів',                               answer: 'ТАПОЧКИ',    row: 2, col: 6, vertical: true },
  { index: '13', question: 'Хвойне вічнозелене дерево або чагарник із твердою бурувато-червоною деревиною',          answer: 'ТИС',         row: 6, col: 4, vertical: true },
  { index: '15', question: 'Річка в Південній Азії, яка витікає з Тибету й впадає в Індійський океан',               answer: 'ІНД',         row: 8, col: 3, vertical: true },
  { index: '16', question: 'Частина якого-небудь твору, яка становить окрему книжку',                                answer: 'ТОМ',         row: 8, col: 5, vertical: true },
];

// ---------------------------------------------------------------------------
// Crossword 3 – Природа
// ---------------------------------------------------------------------------
const cw3Words: IWord[] = [
  { index: '1', question: 'Рослина з яскравими червоними квітами',     answer: 'МАК',    row: 0, col: 0, vertical: false },
  { index: '2', question: 'Матір',                                      answer: 'МАМА',   row: 0, col: 0, vertical: true  },
  { index: '3', question: 'Сукупність дерев на певній площі',           answer: 'АЙ',     row: 1, col: 1, vertical: false },
  { index: '4', question: 'Велика водойма',                             answer: 'МОРЕ',   row: 3, col: 0, vertical: false },
  { index: '5', question: 'Маленька комаха, що живе в мурашнику',       answer: 'МУРАХ',  row: 0, col: 2, vertical: true  },
];

// ---------------------------------------------------------------------------
// Crossword 4 – Тварини
// ---------------------------------------------------------------------------
const cw4Words: IWord[] = [
  { index: '1', question: 'Цар звірів',                                 answer: 'ЛЕВ',     row: 0, col: 0, vertical: false },
  { index: '2', question: 'Великий ссавець із хоботом',                 answer: 'СЛОН',    row: 2, col: 0, vertical: false },
  { index: '3', question: 'Хижий птах з гострим зором',                 answer: 'ЛЕЛЕКА',  row: 0, col: 2, vertical: true  },
  { index: '4', question: 'Свійська тварина, яка дає молоко',           answer: 'КОРОВА',  row: 0, col: 0, vertical: true  },
  { index: '5', question: 'Морська тварина з панциром',                 answer: 'КРАБ',    row: 4, col: 0, vertical: false },
];

// ---------------------------------------------------------------------------
// Crossword 5 – Міста України
// ---------------------------------------------------------------------------
const cw5Words: IWord[] = [
  { index: '1', question: 'Столиця України',                            answer: 'КИЇВ',    row: 0, col: 0, vertical: false },
  { index: '2', question: 'Місто-герой на півдні України',              answer: 'КИЇВ',    row: 0, col: 0, vertical: true  },
  { index: '3', question: 'Місто на Дніпрі, обласний центр',           answer: 'ІВАНІВ',  row: 1, col: 1, vertical: true  },
  { index: '4', question: 'Місто на заході України, культурна столиця', answer: 'ЛЬВІВ',   row: 2, col: 0, vertical: false },
  { index: '5', question: 'Портове місто на Чорному морі',             answer: 'ОДЕСА',   row: 4, col: 0, vertical: false },
];

// ---------------------------------------------------------------------------
// Crossword 6 – Музика
// ---------------------------------------------------------------------------
const cw6Words: IWord[] = [
  { index: '1', question: 'Струнний щипковий інструмент',               answer: 'АРФА',    row: 0, col: 0, vertical: false },
  { index: '2', question: 'Ударний інструмент',                         answer: 'АРФА',    row: 0, col: 0, vertical: true  },
  { index: '3', question: 'Клавішний інструмент',                       answer: 'ФОРТЕПІАНО', row: 2, col: 0, vertical: false },
  { index: '4', question: 'Духовий інструмент',                         answer: 'ФЛЕЙТА',  row: 0, col: 3, vertical: true  },
  { index: '5', question: 'Твір для оркестру',                          answer: 'ОПЕРА',   row: 4, col: 0, vertical: false },
];

// ---------------------------------------------------------------------------
// Crossword 7 – Спорт
// ---------------------------------------------------------------------------
const cw7Words: IWord[] = [
  { index: '1', question: 'Командна гра з м\'ячем на полі 11 на 11',    answer: 'ФУТБОЛ',   row: 0, col: 0, vertical: false },
  { index: '2', question: 'Перший символ – Ф',                          answer: 'ФОРВАРД',  row: 0, col: 0, vertical: true  },
  { index: '3', question: 'Змагання з плавання',                        answer: 'БАСЕЙН',   row: 0, col: 5, vertical: true  },
  { index: '4', question: 'Боротьба на килимі',                         answer: 'БОЙ',      row: 4, col: 0, vertical: false },
  { index: '5', question: 'Зимовий вид спорту на ковзанах',             answer: 'КЕРЛІНГ',  row: 6, col: 0, vertical: false },
];

// ---------------------------------------------------------------------------
// Crossword 8 – Їжа
// ---------------------------------------------------------------------------
const cw8Words: IWord[] = [
  { index: '1', question: 'Традиційна українська страва зі буряка',      answer: 'БОРЩ',    row: 0, col: 0, vertical: false },
  { index: '2', question: 'Починається з Б',                             answer: 'БУБЛИК',  row: 0, col: 0, vertical: true  },
  { index: '3', question: 'Тісто зі смачною начинкою',                   answer: 'ВАРЕНИК', row: 0, col: 3, vertical: true  },
  { index: '4', question: 'Кисломолочний продукт',                       answer: 'РЯЖАНКА', row: 4, col: 0, vertical: false },
  { index: '5', question: 'Солодка страва з яєць та цукру',              answer: 'БЕЗЕ',    row: 6, col: 0, vertical: false },
];

// ---------------------------------------------------------------------------
// Crossword 9 – Письменники
// ---------------------------------------------------------------------------
const cw9Words: IWord[] = [
  { index: '1', question: 'Автор «Кобзаря»',                             answer: 'ШЕВЧЕНКО', row: 0, col: 0, vertical: false },
  { index: '2', question: 'Перша буква – Ш',                             answer: 'ШПАГА',    row: 0, col: 0, vertical: true  },
  { index: '3', question: 'Автор «Лісової пісні»',                       answer: 'ЄВЧЕНКО',  row: 0, col: 7, vertical: true  },
  { index: '4', question: 'Відомий байкар',                              answer: 'ГЛІБОВ',   row: 2, col: 0, vertical: false },
  { index: '5', question: 'Автор «Захара Беркута»',                      answer: 'ФРАНКО',   row: 4, col: 0, vertical: false },
];

// ---------------------------------------------------------------------------
// Crossword 10 – Географія
// ---------------------------------------------------------------------------
const cw10Words: IWord[] = [
  { index: '1', question: 'Найбільший океан',                            answer: 'ТИХИЙ',    row: 0, col: 0, vertical: false },
  { index: '2', question: 'Перша буква – Т',                             answer: 'ТАЙГА',    row: 0, col: 0, vertical: true  },
  { index: '3', question: 'Найвища гора світу',                          answer: 'ЕВЕРЕСТ',  row: 0, col: 4, vertical: true  },
  { index: '4', question: 'Найбільша річка Африки',                      answer: 'НІЛ',      row: 4, col: 0, vertical: false },
  { index: '5', question: 'Найбільший материк',                          answer: 'ЄВРАЗІЯ',  row: 6, col: 0, vertical: false },
];

export const EMBEDDED_CROSSWORDS: ICrossword[] = [
  make('cw1', '№1', cw1Words, 1700000001000),
  make('cw2', '№2', cw2Words, 1700000002000),
  make('cw3', '№3 Природа',    cw3Words,  1700000003000),
  make('cw4', '№4 Тварини',    cw4Words,  1700000004000),
  make('cw5', '№5 Міста',      cw5Words,  1700000005000),
  make('cw6', '№6 Музика',     cw6Words,  1700000006000),
  make('cw7', '№7 Спорт',      cw7Words,  1700000007000),
  make('cw8', '№8 Їжа',        cw8Words,  1700000008000),
  make('cw9', '№9 Письменники', cw9Words, 1700000009000),
  make('cw10', '№10 Географія', cw10Words, 1700000010000),
];
