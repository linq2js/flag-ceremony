import type { HistoricalEvent } from "../store/types";
import type { Language } from "../i18n";

// Vietnam historical events - bilingual
const vietnamHistoricalEvents: Record<string, { en: HistoricalEvent[]; vi: HistoricalEvent[] }> = {
  "01-01": {
    en: [
      { year: "1955", event: "Ho Chi Minh's New Year message calling for national unity" },
      { year: "1975", event: "New Year's offensive operations during the Vietnam War" },
    ],
    vi: [
      { year: "1955", event: "Thư chúc mừng năm mới của Chủ tịch Hồ Chí Minh kêu gọi đoàn kết dân tộc" },
      { year: "1975", event: "Các chiến dịch tấn công năm mới trong kháng chiến chống Mỹ" },
    ],
  },
  "01-06": {
    en: [
      { year: "1946", event: "First general election in Vietnam - Birth of the National Assembly" },
    ],
    vi: [
      { year: "1946", event: "Tổng tuyển cử đầu tiên ở Việt Nam - Ngày thành lập Quốc hội" },
    ],
  },
  "01-21": {
    en: [
      { year: "1968", event: "Battle of Khe Sanh begins - major battle of the Vietnam War" },
    ],
    vi: [
      { year: "1968", event: "Chiến dịch Khe Sanh bắt đầu - trận đánh lớn trong kháng chiến chống Mỹ" },
    ],
  },
  "01-27": {
    en: [
      { year: "1973", event: "Paris Peace Accords signed, ending direct U.S. military involvement in Vietnam" },
    ],
    vi: [
      { year: "1973", event: "Hiệp định Paris được ký kết, chấm dứt sự can thiệp quân sự trực tiếp của Mỹ tại Việt Nam" },
    ],
  },
  "01-30": {
    en: [
      { year: "1968", event: "Tet Offensive begins - turning point of the Vietnam War" },
    ],
    vi: [
      { year: "1968", event: "Tổng tiến công Tết Mậu Thân bắt đầu - bước ngoặt của cuộc kháng chiến" },
    ],
  },
  "02-03": {
    en: [
      { year: "1930", event: "Communist Party of Vietnam founded by Ho Chi Minh" },
    ],
    vi: [
      { year: "1930", event: "Đảng Cộng sản Việt Nam được thành lập bởi Nguyễn Ái Quốc" },
    ],
  },
  "02-17": {
    en: [
      { year: "1979", event: "China-Vietnam War begins - China invades northern Vietnam" },
    ],
    vi: [
      { year: "1979", event: "Chiến tranh biên giới phía Bắc bắt đầu - Trung Quốc xâm lược Việt Nam" },
    ],
  },
  "03-08": {
    en: [
      { year: "1965", event: "First U.S. combat troops land in Da Nang" },
    ],
    vi: [
      { year: "1965", event: "Quân chiến đấu Mỹ đầu tiên đổ bộ vào Đà Nẵng" },
    ],
  },
  "03-26": {
    en: [
      { year: "1931", event: "Vietnam Youth Revolutionary League founded" },
    ],
    vi: [
      { year: "1931", event: "Đoàn Thanh niên Cách mạng Việt Nam được thành lập" },
    ],
  },
  "04-30": {
    en: [
      { year: "1975", event: "Fall of Saigon - Reunification of Vietnam, end of Vietnam War" },
      { year: "1975", event: "Liberation Day - Victory in the Resistance War Against America" },
    ],
    vi: [
      { year: "1975", event: "Giải phóng Sài Gòn - Thống nhất đất nước, kết thúc chiến tranh Việt Nam" },
      { year: "1975", event: "Ngày Giải phóng miền Nam - Đại thắng mùa Xuân" },
    ],
  },
  "05-01": {
    en: [
      { year: "1975", event: "International Workers' Day - First celebration in unified Vietnam" },
    ],
    vi: [
      { year: "1975", event: "Ngày Quốc tế Lao động - Lần đầu kỷ niệm tại Việt Nam thống nhất" },
    ],
  },
  "05-07": {
    en: [
      { year: "1954", event: "Battle of Dien Bien Phu ends - decisive French defeat" },
    ],
    vi: [
      { year: "1954", event: "Chiến thắng Điện Biên Phủ - Đại thắng lịch sử" },
    ],
  },
  "05-13": {
    en: [
      { year: "1954", event: "Dien Bien Phu - French forces surrender to Viet Minh" },
    ],
    vi: [
      { year: "1954", event: "Điện Biên Phủ - Quân Pháp đầu hàng Việt Minh" },
    ],
  },
  "05-19": {
    en: [
      { year: "1890", event: "Birth of Ho Chi Minh - Father of the Nation" },
      { year: "1941", event: "Viet Minh founded to fight for Vietnamese independence" },
    ],
    vi: [
      { year: "1890", event: "Ngày sinh Chủ tịch Hồ Chí Minh - Cha già dân tộc" },
      { year: "1941", event: "Mặt trận Việt Minh được thành lập để đấu tranh giành độc lập" },
    ],
  },
  "06-01": {
    en: [
      { year: "1950", event: "International Children's Day - First celebrated in Vietnam" },
    ],
    vi: [
      { year: "1950", event: "Ngày Quốc tế Thiếu nhi - Lần đầu được tổ chức tại Việt Nam" },
    ],
  },
  "07-20": {
    en: [
      { year: "1954", event: "Geneva Accords signed - Vietnam temporarily divided at 17th parallel" },
    ],
    vi: [
      { year: "1954", event: "Hiệp định Genève được ký - Việt Nam tạm thời chia cắt tại vĩ tuyến 17" },
    ],
  },
  "07-27": {
    en: [
      { year: "1947", event: "Vietnamese War Invalids and Martyrs Day established" },
    ],
    vi: [
      { year: "1947", event: "Ngày Thương binh Liệt sĩ Việt Nam" },
    ],
  },
  "08-19": {
    en: [
      { year: "1945", event: "August Revolution begins - Uprising in Hanoi" },
    ],
    vi: [
      { year: "1945", event: "Cách mạng Tháng Tám bắt đầu - Khởi nghĩa tại Hà Nội" },
    ],
  },
  "08-25": {
    en: [
      { year: "1945", event: "Emperor Bao Dai abdicates, ending the Nguyen Dynasty" },
    ],
    vi: [
      { year: "1945", event: "Vua Bảo Đại thoái vị, chấm dứt triều Nguyễn" },
    ],
  },
  "09-02": {
    en: [
      { year: "1945", event: "Vietnamese Independence Day - Ho Chi Minh declares independence" },
      { year: "1969", event: "President Ho Chi Minh passes away" },
    ],
    vi: [
      { year: "1945", event: "Ngày Quốc khánh - Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập" },
      { year: "1969", event: "Chủ tịch Hồ Chí Minh từ trần" },
    ],
  },
  "09-03": {
    en: [
      { year: "1945", event: "First government meeting of the Democratic Republic of Vietnam" },
    ],
    vi: [
      { year: "1945", event: "Phiên họp Chính phủ đầu tiên của nước Việt Nam Dân chủ Cộng hòa" },
    ],
  },
  "09-23": {
    en: [
      { year: "1945", event: "Southern Resistance Day - Beginning of resistance war in the South" },
    ],
    vi: [
      { year: "1945", event: "Ngày Nam Bộ kháng chiến - Bắt đầu cuộc kháng chiến ở miền Nam" },
    ],
  },
  "10-10": {
    en: [
      { year: "1954", event: "Liberation of Hanoi - French troops withdraw from the capital" },
    ],
    vi: [
      { year: "1954", event: "Giải phóng Thủ đô - Quân Pháp rút khỏi Hà Nội" },
    ],
  },
  "10-20": {
    en: [
      { year: "1930", event: "Vietnamese Women's Day - Founding of Vietnam Women's Union" },
    ],
    vi: [
      { year: "1930", event: "Ngày Phụ nữ Việt Nam - Thành lập Hội Liên hiệp Phụ nữ Việt Nam" },
    ],
  },
  "11-20": {
    en: [
      { year: "1982", event: "Vietnamese Teachers' Day established" },
    ],
    vi: [
      { year: "1982", event: "Ngày Nhà giáo Việt Nam được thiết lập" },
    ],
  },
  "12-19": {
    en: [
      { year: "1946", event: "National Resistance Day - Beginning of First Indochina War" },
    ],
    vi: [
      { year: "1946", event: "Ngày Toàn quốc kháng chiến - Bắt đầu cuộc kháng chiến chống Pháp" },
    ],
  },
  "12-22": {
    en: [
      { year: "1944", event: "Vietnam People's Army founded by Vo Nguyen Giap" },
    ],
    vi: [
      { year: "1944", event: "Quân đội Nhân dân Việt Nam được thành lập bởi Đại tướng Võ Nguyên Giáp" },
    ],
  },
  "12-25": {
    en: [
      { year: "1972", event: "Christmas Bombings of Hanoi - Operation Linebacker II" },
    ],
    vi: [
      { year: "1972", event: "\"Điện Biên Phủ trên không\" - Chiến thắng B-52 tại Hà Nội" },
    ],
  },
  "12-26": {
    en: [
      { year: "1972", event: "Hanoi-Haiphong Christmas Bombings continue - 12 days of bombing" },
    ],
    vi: [
      { year: "1972", event: "Chiến dịch 12 ngày đêm bảo vệ Hà Nội tiếp tục" },
    ],
  },
};

// Generate default Vietnam-related events for dates without specific events
const generateDefaultVietnamEvents = (lang: Language, month: number, day: number): HistoricalEvent[] => {
  const events: HistoricalEvent[] = [];
  
  if (lang === "vi") {
    events.push({
      year: "",
      event: "Hãy tìm hiểu thêm về lịch sử Việt Nam vẻ vang qua các trang sách và bảo tàng.",
    });
  } else {
    events.push({
      year: "",
      event: "Explore the glorious history of Vietnam through books and museums.",
    });
  }
  
  return events;
};

export const getHistoricalEvents = (lang: Language): HistoricalEvent[] => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const key = `${month}-${day}`;

  const dayEvents = vietnamHistoricalEvents[key];
  if (dayEvents) {
    return dayEvents[lang];
  }
  
  return generateDefaultVietnamEvents(lang, now.getMonth() + 1, now.getDate());
};

export const formatDate = (date: Date, lang: Language): string => {
  if (lang === "vi") {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (date: Date, lang: Language): string => {
  const locale = lang === "vi" ? "vi-VN" : "en-US";
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getMonthName = (monthIndex: number, lang: Language): string => {
  if (lang === "vi") {
    return `Tháng ${monthIndex + 1}`;
  }
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthIndex];
};
