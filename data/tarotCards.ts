export interface TarotCard {
  id: number;
  name: string;
  nameVi: string;
  number: number | string;
  arcana: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  emoji: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  isReversed?: boolean;
}

export const tarotCards: TarotCard[] = [
  // ===== MAJOR ARCANA =====
  {
    id: 0, name: "The Fool", nameVi: "Kẻ Ngốc", number: 0, arcana: "major",
    emoji: "🌟", keywords: ["mới bắt đầu", "tự do", "vô tư", "phiêu lưu"],
    uprightMeaning: "Khởi đầu mới, tinh thần phiêu lưu, sự ngây thơ và tin tưởng vào vũ trụ.",
    reversedMeaning: "Bất cẩn, thiếu kế hoạch, liều lĩnh mù quáng.",
  },
  {
    id: 1, name: "The Magician", nameVi: "Pháp Sư", number: 1, arcana: "major",
    emoji: "✨", keywords: ["quyền năng", "sáng tạo", "ý chí", "tài năng"],
    uprightMeaning: "Bạn có mọi công cụ cần thiết để thành công. Thể hiện tài năng và hành động.",
    reversedMeaning: "Lừa đảo, thao túng, lãng phí tài năng.",
  },
  {
    id: 2, name: "The High Priestess", nameVi: "Nữ Tư Tế", number: 2, arcana: "major",
    emoji: "🌙", keywords: ["trực giác", "bí ẩn", "nội tâm", "tri thức"],
    uprightMeaning: "Lắng nghe trực giác sâu thẳm. Bí mật sẽ được hé lộ.",
    reversedMeaning: "Bỏ qua trực giác, bí mật bị lộ, thiếu hiểu biết.",
  },
  {
    id: 3, name: "The Empress", nameVi: "Nữ Hoàng", number: 3, arcana: "major",
    emoji: "🌸", keywords: ["phong phú", "nữ tính", "thiên nhiên", "sáng tạo"],
    uprightMeaning: "Sự phong phú, tình mẫu tử, thiên nhiên nở rộ. Thời điểm thu hoạch.",
    reversedMeaning: "Phụ thuộc, sáng tạo bị chặn, thiếu quan tâm.",
  },
  {
    id: 4, name: "The Emperor", nameVi: "Hoàng Đế", number: 4, arcana: "major",
    emoji: "👑", keywords: ["quyền lực", "ổn định", "kỷ luật", "lãnh đạo"],
    uprightMeaning: "Quyền uy, sự ổn định, kỷ luật và cấu trúc rõ ràng.",
    reversedMeaning: "Độc đoán, cứng nhắc, mất kiểm soát.",
  },
  {
    id: 5, name: "The Hierophant", nameVi: "Giáo Hoàng", number: 5, arcana: "major",
    emoji: "⛪", keywords: ["truyền thống", "tín ngưỡng", "giáo dục", "quy ước"],
    uprightMeaning: "Tuân theo truyền thống, tìm kiếm sự hướng dẫn tâm linh.",
    reversedMeaning: "Nổi loạn, phá vỡ quy tắc, suy nghĩ độc lập.",
  },
  {
    id: 6, name: "The Lovers", nameVi: "Đôi Tình Nhân", number: 6, arcana: "major",
    emoji: "💕", keywords: ["tình yêu", "lựa chọn", "hòa hợp", "giá trị"],
    uprightMeaning: "Tình yêu lãng mạn, sự hòa hợp, lựa chọn quan trọng từ trái tim.",
    reversedMeaning: "Mất cân bằng, lựa chọn sai, bất đồng trong tình cảm.",
  },
  {
    id: 7, name: "The Chariot", nameVi: "Chiến Xa", number: 7, arcana: "major",
    emoji: "🏆", keywords: ["chiến thắng", "ý chí", "kiểm soát", "quyết tâm"],
    uprightMeaning: "Chiến thắng qua ý chí mạnh mẽ. Bạn có thể vượt qua mọi thử thách.",
    reversedMeaning: "Mất kiểm soát, thiếu định hướng, thất bại do nóng vội.",
  },
  {
    id: 8, name: "Strength", nameVi: "Sức Mạnh", number: 8, arcana: "major",
    emoji: "🦁", keywords: ["can đảm", "kiên nhẫn", "lòng trắc ẩn", "nội lực"],
    uprightMeaning: "Sức mạnh bên trong, can đảm và kiên nhẫn sẽ dẫn đến thành công.",
    reversedMeaning: "Thiếu tự tin, sợ hãi, mất kiểm soát cảm xúc.",
  },
  {
    id: 9, name: "The Hermit", nameVi: "Ẩn Sĩ", number: 9, arcana: "major",
    emoji: "🔦", keywords: ["nội tâm", "cô đơn", "tìm kiếm", "trí tuệ"],
    uprightMeaning: "Thời gian tự mình suy ngẫm, tìm kiếm sự thật bên trong.",
    reversedMeaning: "Cô lập thái quá, từ chối giúp đỡ, lạc lõng.",
  },
  {
    id: 10, name: "Wheel of Fortune", nameVi: "Bánh Xe Số Phận", number: 10, arcana: "major",
    emoji: "🎡", keywords: ["số phận", "chu kỳ", "may mắn", "thay đổi"],
    uprightMeaning: "Vận may đến, chu kỳ mới bắt đầu. Số phận đang quay theo hướng tốt.",
    reversedMeaning: "Vận xui, chống lại thay đổi, nằm dưới đáy chu kỳ.",
  },
  {
    id: 11, name: "Justice", nameVi: "Công Lý", number: 11, arcana: "major",
    emoji: "⚖️", keywords: ["công bằng", "sự thật", "nhân quả", "cân bằng"],
    uprightMeaning: "Sự thật và công bằng sẽ chiến thắng. Hậu quả của hành động.",
    reversedMeaning: "Bất công, thiên vị, trốn tránh trách nhiệm.",
  },
  {
    id: 12, name: "The Hanged Man", nameVi: "Người Treo Ngược", number: 12, arcana: "major",
    emoji: "🙃", keywords: ["hy sinh", "chờ đợi", "góc nhìn mới", "buông bỏ"],
    uprightMeaning: "Tạm dừng và nhìn mọi thứ từ góc độ khác. Hy sinh để đạt được điều lớn hơn.",
    reversedMeaning: "Trì hoãn vô ích, tử thi, không chịu buông bỏ.",
  },
  {
    id: 13, name: "Death", nameVi: "Cái Chết", number: 13, arcana: "major",
    emoji: "🦋", keywords: ["biến đổi", "kết thúc", "tái sinh", "chuyển hóa"],
    uprightMeaning: "Kết thúc một giai đoạn để bắt đầu điều mới tốt đẹp hơn. Chuyển hóa.",
    reversedMeaning: "Chống lại thay đổi, trì trệ, sợ kết thúc.",
  },
  {
    id: 14, name: "Temperance", nameVi: "Điều Độ", number: 14, arcana: "major",
    emoji: "🌈", keywords: ["cân bằng", "kiên nhẫn", "hòa hợp", "chữa lành"],
    uprightMeaning: "Cân bằng và hài hòa. Kiên nhẫn và trung dung là chìa khóa.",
    reversedMeaning: "Thiếu cân bằng, thái quá, nóng nảy.",
  },
  {
    id: 15, name: "The Devil", nameVi: "Quỷ Dữ", number: 15, arcana: "major",
    emoji: "⛓️", keywords: ["ràng buộc", "cám dỗ", "bóng tối", "vật chất"],
    uprightMeaning: "Nhận ra những ràng buộc và sự phụ thuộc trong cuộc sống.",
    reversedMeaning: "Giải phóng, cắt đứt ràng buộc, thoát khỏi tình huống xấu.",
  },
  {
    id: 16, name: "The Tower", nameVi: "Tháp Sét", number: 16, arcana: "major",
    emoji: "⚡", keywords: ["biến cố", "phá hủy", "đột biến", "giải phóng"],
    uprightMeaning: "Thay đổi bất ngờ và đột ngột. Những nền tảng sai sẽ bị phá vỡ.",
    reversedMeaning: "Tránh né thảm họa, thay đổi chậm chạp, chấn thương cũ.",
  },
  {
    id: 17, name: "The Star", nameVi: "Ngôi Sao", number: 17, arcana: "major",
    emoji: "⭐", keywords: ["hy vọng", "cảm hứng", "chữa lành", "hướng dẫn"],
    uprightMeaning: "Hy vọng và niềm tin vào tương lai. Sự chữa lành và cảm hứng.",
    reversedMeaning: "Tuyệt vọng, mất niềm tin, không thực tế.",
  },
  {
    id: 18, name: "The Moon", nameVi: "Mặt Trăng", number: 18, arcana: "major",
    emoji: "🌕", keywords: ["ảo giác", "bí ẩn", "tiềm thức", "sợ hãi"],
    uprightMeaning: "Không rõ ràng và ảo giác. Hãy tin vào trực giác và đối mặt với sợ hãi.",
    reversedMeaning: "Sự thật hé lộ, ảo giác tan biến, vượt qua sợ hãi.",
  },
  {
    id: 19, name: "The Sun", nameVi: "Mặt Trời", number: 19, arcana: "major",
    emoji: "☀️", keywords: ["vui vẻ", "thành công", "tích cực", "sức sống"],
    uprightMeaning: "Niềm vui và thành công rực rỡ. Mọi thứ đều tươi sáng và tích cực.",
    reversedMeaning: "Bi quan tạm thời, thiếu năng lượng, trễ hứa.",
  },
  {
    id: 20, name: "Judgement", nameVi: "Phán Xét", number: 20, arcana: "major",
    emoji: "📯", keywords: ["thức tỉnh", "tha thứ", "phán xét", "tái sinh"],
    uprightMeaning: "Lời kêu gọi thức tỉnh. Đánh giá lại và tái sinh.",
    reversedMeaning: "Tự nghi ngờ, sợ thay đổi, bỏ lỡ cơ hội.",
  },
  {
    id: 21, name: "The World", nameVi: "Thế Giới", number: 21, arcana: "major",
    emoji: "🌍", keywords: ["hoàn thành", "thành tựu", "tổng thể", "hòa nhập"],
    uprightMeaning: "Hoàn thành viên mãn, thành công trọn vẹn. Bước sang giai đoạn mới.",
    reversedMeaning: "Chưa hoàn chỉnh, thiếu kết thúc, trì hoãn.",
  },

  // ===== MINOR ARCANA - WANDS =====
  {
    id: 22, name: "Ace of Wands", nameVi: "Át Wands", number: 1, arcana: "minor", suit: "wands",
    emoji: "🔥", keywords: ["cảm hứng", "sáng tạo", "tiềm năng", "đam mê"],
    uprightMeaning: "Cơ hội mới đầy tiềm năng, ý tưởng sáng tạo, bắt đầu dự án mới.",
    reversedMeaning: "Trì hoãn, thiếu cảm hứng, dự án bị đình trệ.",
  },
  {
    id: 23, name: "Two of Wands", nameVi: "Hai Wands", number: 2, arcana: "minor", suit: "wands",
    emoji: "🌐", keywords: ["kế hoạch", "tương lai", "mở rộng", "quyết định"],
    uprightMeaning: "Lên kế hoạch cho tương lai, mở rộng tầm nhìn ra thế giới.",
    reversedMeaning: "Sợ hãi trước điều chưa biết, kế hoạch không rõ ràng.",
  },
  {
    id: 24, name: "Three of Wands", nameVi: "Ba Wands", number: 3, arcana: "minor", suit: "wands",
    emoji: "🚢", keywords: ["mở rộng", "cơ hội", "thương mại", "nhìn xa"],
    uprightMeaning: "Mở rộng và phát triển. Kế hoạch đang thành hình, cơ hội mới đến.",
    reversedMeaning: "Thất vọng, kế hoạch thất bại, trở về tay trắng.",
  },
  {
    id: 25, name: "Four of Wands", nameVi: "Bốn Wands", number: 4, arcana: "minor", suit: "wands",
    emoji: "🎊", keywords: ["ăn mừng", "hài hòa", "ổn định", "mừng vui"],
    uprightMeaning: "Ăn mừng thành tựu, ổn định và hạnh phúc gia đình.",
    reversedMeaning: "Xung đột gia đình, không ổn định, ăn mừng bị trì hoãn.",
  },
  {
    id: 26, name: "Five of Wands", nameVi: "Năm Wands", number: 5, arcana: "minor", suit: "wands",
    emoji: "⚔️", keywords: ["xung đột", "cạnh tranh", "căng thẳng", "thử thách"],
    uprightMeaning: "Cạnh tranh và xung đột. Hãy đứng vững lập trường.",
    reversedMeaning: "Giải quyết xung đột, tránh đối đầu, hòa giải.",
  },
  {
    id: 27, name: "Six of Wands", nameVi: "Sáu Wands", number: 6, arcana: "minor", suit: "wands",
    emoji: "🏅", keywords: ["chiến thắng", "thành công", "công nhận", "lãnh đạo"],
    uprightMeaning: "Chiến thắng và được công nhận. Thành công và được ca ngợi.",
    reversedMeaning: "Thất bại, không được công nhận, kiêu ngạo.",
  },
  {
    id: 28, name: "Seven of Wands", nameVi: "Bảy Wands", number: 7, arcana: "minor", suit: "wands",
    emoji: "🛡️", keywords: ["bảo vệ", "thách thức", "kiên trì", "lập trường"],
    uprightMeaning: "Đứng vững bảo vệ vị trí của mình trước áp lực từ bên ngoài.",
    reversedMeaning: "Bỏ cuộc, áp đảo, mất lập trường.",
  },
  {
    id: 29, name: "Eight of Wands", nameVi: "Tám Wands", number: 8, arcana: "minor", suit: "wands",
    emoji: "💨", keywords: ["nhanh chóng", "hành động", "di chuyển", "tin tức"],
    uprightMeaning: "Mọi thứ diễn ra nhanh chóng. Tin tức và hành động mau lẹ.",
    reversedMeaning: "Trì hoãn, lỡ thời cơ, thiếu hướng.",
  },
  {
    id: 30, name: "Nine of Wands", nameVi: "Chín Wands", number: 9, arcana: "minor", suit: "wands",
    emoji: "💪", keywords: ["kiên cường", "phòng thủ", "kiên nhẫn", "gần đích"],
    uprightMeaning: "Dù đã mệt mỏi, hãy tiếp tục - đích đang ở gần rồi!",
    reversedMeaning: "Kiệt sức, không chịu được nữa, cứng nhắc.",
  },
  {
    id: 31, name: "Ten of Wands", nameVi: "Mười Wands", number: 10, arcana: "minor", suit: "wands",
    emoji: "😫", keywords: ["gánh nặng", "trách nhiệm", "quá tải", "hy sinh"],
    uprightMeaning: "Gánh quá nhiều trách nhiệm. Học cách ủy thác và đặt giới hạn.",
    reversedMeaning: "Trút gánh nặng, ủy thác, thoát khỏi gánh nặng.",
  },
  {
    id: 32, name: "Page of Wands", nameVi: "Cậu Bé Wands", number: "Page", arcana: "minor", suit: "wands",
    emoji: "🌱", keywords: ["hào hứng", "khám phá", "học hỏi", "sáng tạo"],
    uprightMeaning: "Sự hào hứng và khám phá mới. Học hỏi và thử nghiệm.",
    reversedMeaning: "Thiếu trọng tâm, hấp tấp, thiếu kỹ năng.",
  },
  {
    id: 33, name: "Knight of Wands", nameVi: "Kỵ Sĩ Wands", number: "Knight", arcana: "minor", suit: "wands",
    emoji: "🏇", keywords: ["phiêu lưu", "đam mê", "táo bạo", "năng động"],
    uprightMeaning: "Hành động táo bạo và đam mê. Dũng cảm lao vào phiêu lưu.",
    reversedMeaning: "Nóng nảy, liều lĩnh, thiếu kiên nhẫn.",
  },
  {
    id: 34, name: "Queen of Wands", nameVi: "Hoàng Hậu Wands", number: "Queen", arcana: "minor", suit: "wands",
    emoji: "👸", keywords: ["tự tin", "nhiệt tình", "thu hút", "sáng tạo"],
    uprightMeaning: "Tự tin và thu hút mọi người. Lãnh đạo bằng đam mê.",
    reversedMeaning: "Kiêu ngạo, ghen tuông, không an toàn.",
  },
  {
    id: 35, name: "King of Wands", nameVi: "Vua Wands", number: "King", arcana: "minor", suit: "wands",
    emoji: "🤴", keywords: ["lãnh đạo", "tầm nhìn", "doanh nhân", "uy quyền"],
    uprightMeaning: "Lãnh đạo tài ba với tầm nhìn xa và năng lực khởi nghiệp.",
    reversedMeaning: "Độc đoán, áp đảo, thiếu kế hoạch.",
  },

  // ===== MINOR ARCANA - CUPS =====
  {
    id: 36, name: "Ace of Cups", nameVi: "Át Cups", number: 1, arcana: "minor", suit: "cups",
    emoji: "💧", keywords: ["tình yêu", "cảm xúc", "trực giác", "tình cảm mới"],
    uprightMeaning: "Tình yêu mới, cảm xúc tràn đầy, cơ hội kết nối sâu sắc.",
    reversedMeaning: "Cảm xúc bị chặn, tình yêu không được đón nhận.",
  },
  {
    id: 37, name: "Two of Cups", nameVi: "Hai Cups", number: 2, arcana: "minor", suit: "cups",
    emoji: "🥂", keywords: ["kết nối", "đối tác", "tình yêu", "hòa hợp"],
    uprightMeaning: "Kết nối đẹp đẽ và quan hệ đối tác hài hòa, tình yêu đôi lứa.",
    reversedMeaning: "Bất hòa, chia tay, mất kết nối.",
  },
  {
    id: 38, name: "Three of Cups", nameVi: "Ba Cups", number: 3, arcana: "minor", suit: "cups",
    emoji: "🎉", keywords: ["ăn mừng", "bạn bè", "cộng đồng", "vui vẻ"],
    uprightMeaning: "Ăn mừng với bạn bè, tình bạn thân thiết và niềm vui cộng đồng.",
    reversedMeaning: "Ngồi lê đôi mách, mất bạn bè, ăn mừng thái quá.",
  },
  {
    id: 39, name: "Four of Cups", nameVi: "Bốn Cups", number: 4, arcana: "minor", suit: "cups",
    emoji: "😑", keywords: ["thờ ơ", "suy ngẫm", "bỏ lỡ", "không hài lòng"],
    uprightMeaning: "Thờ ơ và thiếu nhiệt tình. Hãy chú ý đến cơ hội đang đến.",
    reversedMeaning: "Thức dậy từ trạng thái thờ ơ, nắm bắt cơ hội mới.",
  },
  {
    id: 40, name: "Five of Cups", nameVi: "Năm Cups", number: 5, arcana: "minor", suit: "cups",
    emoji: "😢", keywords: ["buồn bã", "mất mát", "hối tiếc", "đau buồn"],
    uprightMeaning: "Tập trung vào mất mát và buồn đau. Nhưng vẫn còn điều tốt đẹp ở lại.",
    reversedMeaning: "Chấp nhận, bước tiếp, tìm lại hy vọng.",
  },
  {
    id: 41, name: "Six of Cups", nameVi: "Sáu Cups", number: 6, arcana: "minor", suit: "cups",
    emoji: "🌻", keywords: ["hoài niệm", "tuổi thơ", "ký ức", "vô tư"],
    uprightMeaning: "Hoài niệm về quá khứ tốt đẹp, sự ngây thơ và những kỷ niệm đẹp.",
    reversedMeaning: "Sống trong quá khứ, không chịu lớn, ký ức đau.",
  },
  {
    id: 42, name: "Seven of Cups", nameVi: "Bảy Cups", number: 7, arcana: "minor", suit: "cups",
    emoji: "🌀", keywords: ["ảo tưởng", "lựa chọn", "mơ mộng", "ảo giác"],
    uprightMeaning: "Quá nhiều lựa chọn và ảo tưởng. Cần tập trung và nhìn thực tế.",
    reversedMeaning: "Nhìn thực tế, vượt qua ảo tưởng, quyết định rõ ràng.",
  },
  {
    id: 43, name: "Eight of Cups", nameVi: "Tám Cups", number: 8, arcana: "minor", suit: "cups",
    emoji: "🚶", keywords: ["rời bỏ", "tìm kiếm", "thất vọng", "hành trình nội tâm"],
    uprightMeaning: "Rời bỏ điều không còn phục vụ bạn để tìm kiếm điều sâu sắc hơn.",
    reversedMeaning: "Sợ thay đổi, ở lại trong tình huống xấu, thiếu mục đích.",
  },
  {
    id: 44, name: "Nine of Cups", nameVi: "Chín Cups", number: 9, arcana: "minor", suit: "cups",
    emoji: "😊", keywords: ["mãn nguyện", "hạnh phúc", "ước muốn", "thỏa mãn"],
    uprightMeaning: "Ước muốn thành hiện thực, hài lòng và hạnh phúc. Chúc mừng bạn!",
    reversedMeaning: "Không thỏa mãn, tham lam, hạnh phúc bị trì hoãn.",
  },
  {
    id: 45, name: "Ten of Cups", nameVi: "Mười Cups", number: 10, arcana: "minor", suit: "cups",
    emoji: "🌈", keywords: ["hạnh phúc gia đình", "hòa hợp", "viên mãn", "yêu thương"],
    uprightMeaning: "Hạnh phúc gia đình viên mãn, tình yêu và hòa hợp.",
    reversedMeaning: "Mất hòa hợp gia đình, xung đột, mơ tưởng về hạnh phúc.",
  },
  {
    id: 46, name: "Page of Cups", nameVi: "Cậu Bé Cups", number: "Page", arcana: "minor", suit: "cups",
    emoji: "🐟", keywords: ["sáng tạo", "trực giác", "nhạy cảm", "tin nhắn"],
    uprightMeaning: "Tin tức về tình cảm, sáng tạo nghệ thuật, nhạy cảm và trực giác.",
    reversedMeaning: "Cảm xúc bất ổn, thiếu sáng tạo, trẻ con.",
  },
  {
    id: 47, name: "Knight of Cups", nameVi: "Kỵ Sĩ Cups", number: "Knight", arcana: "minor", suit: "cups",
    emoji: "🤵", keywords: ["lãng mạn", "duyên dáng", "nghệ thuật", "lý tưởng"],
    uprightMeaning: "Người lãng mạn và duyên dáng. Theo đuổi lý tưởng và sáng tạo.",
    reversedMeaning: "Không thực tế, ủy mị, hay nói xấu.",
  },
  {
    id: 48, name: "Queen of Cups", nameVi: "Hoàng Hậu Cups", number: "Queen", arcana: "minor", suit: "cups",
    emoji: "🧜", keywords: ["nhạy cảm", "trực giác", "chữa lành", "đồng cảm"],
    uprightMeaning: "Người mẹ tình cảm và trực giác cao. Chữa lành bằng lòng đồng cảm.",
    reversedMeaning: "Cảm xúc thái quá, phụ thuộc, thiếu ranh giới.",
  },
  {
    id: 49, name: "King of Cups", nameVi: "Vua Cups", number: "King", arcana: "minor", suit: "cups",
    emoji: "🧙", keywords: ["cân bằng cảm xúc", "khôn ngoan", "trắc ẩn", "ngoại giao"],
    uprightMeaning: "Cân bằng cảm xúc và lý trí. Lãnh đạo bằng lòng trắc ẩn.",
    reversedMeaning: "Cảm xúc bị kìm nén, thao túng, thiếu cân bằng.",
  },

  // ===== MINOR ARCANA - SWORDS =====
  {
    id: 50, name: "Ace of Swords", nameVi: "Át Swords", number: 1, arcana: "minor", suit: "swords",
    emoji: "⚔️", keywords: ["sự thật", "rõ ràng", "đột phá", "sức mạnh trí tuệ"],
    uprightMeaning: "Sự thật và sự rõ ràng. Đột phá qua ảo giác, tư duy sắc bén.",
    reversedMeaning: "Hỗn loạn, nói dối, tư duy mờ nhạt.",
  },
  {
    id: 51, name: "Two of Swords", nameVi: "Hai Swords", number: 2, arcana: "minor", suit: "swords",
    emoji: "🚧", keywords: ["bế tắc", "quyết định khó", "né tránh", "cân bằng"],
    uprightMeaning: "Đứng trước quyết định khó khăn, không thể trốn tránh mãi.",
    reversedMeaning: "Nhìn rõ tình hình, quyết định cuối cùng, thông tin hé lộ.",
  },
  {
    id: 52, name: "Three of Swords", nameVi: "Ba Swords", number: 3, arcana: "minor", suit: "swords",
    emoji: "💔", keywords: ["đau tim", "phản bội", "buồn bã", "mất mát"],
    uprightMeaning: "Đau lòng và thất vọng. Đây là thời gian khó nhưng sẽ qua.",
    reversedMeaning: "Chữa lành, buông bỏ đau đớn, tha thứ.",
  },
  {
    id: 53, name: "Four of Swords", nameVi: "Bốn Swords", number: 4, arcana: "minor", suit: "swords",
    emoji: "😴", keywords: ["nghỉ ngơi", "phục hồi", "suy ngẫm", "rút lui"],
    uprightMeaning: "Cần nghỉ ngơi và phục hồi. Tạm dừng để lấy lại sức.",
    reversedMeaning: "Kiệt sức, không thể nghỉ, bồn chồn.",
  },
  {
    id: 54, name: "Five of Swords", nameVi: "Năm Swords", number: 5, arcana: "minor", suit: "swords",
    emoji: "😈", keywords: ["xung đột", "thất bại", "chiến thắng trống rỗng", "bất lương"],
    uprightMeaning: "Chiến thắng bằng mọi giá nhưng mất nhiều hơn được.",
    reversedMeaning: "Hòa giải, thua cuộc một cách có phẩm giá, thay đổi.",
  },
  {
    id: 55, name: "Six of Swords", nameVi: "Sáu Swords", number: 6, arcana: "minor", suit: "swords",
    emoji: "🛶", keywords: ["chuyển tiếp", "thoát khỏi khó khăn", "hành trình", "bình yên"],
    uprightMeaning: "Ra đi khỏi khó khăn, tiến về phía trước, hành trình hướng đến bình yên.",
    reversedMeaning: "Không thể thoát, trì hoãn chuyển tiếp, trống rỗng.",
  },
  {
    id: 56, name: "Seven of Swords", nameVi: "Bảy Swords", number: 7, arcana: "minor", suit: "swords",
    emoji: "🥷", keywords: ["lừa dối", "chiến lược", "né tránh", "bí mật"],
    uprightMeaning: "Ai đó có thể đang lừa dối. Cần chiến lược tinh vi.",
    reversedMeaning: "Sự thật bị lộ, trung thực, hậu quả của lừa dối.",
  },
  {
    id: 57, name: "Eight of Swords", nameVi: "Tám Swords", number: 8, arcana: "minor", suit: "swords",
    emoji: "🙈", keywords: ["bị bịt mắt", "bị bẫy", "suy nghĩ tiêu cực", "nạn nhân"],
    uprightMeaning: "Cảm thấy bị mắc kẹt nhưng thực ra bạn có thể thoát - hãy thay đổi tư duy.",
    reversedMeaning: "Giải phóng, thấy rõ, thoát khỏi hạn chế.",
  },
  {
    id: 58, name: "Nine of Swords", nameVi: "Chín Swords", number: 9, arcana: "minor", suit: "swords",
    emoji: "😰", keywords: ["lo lắng", "ác mộng", "tội lỗi", "suy nghĩ quá mức"],
    uprightMeaning: "Lo lắng và suy nghĩ tiêu cực quá mức. Tìm kiếm giúp đỡ.",
    reversedMeaning: "Cải thiện lo lắng, nhìn ra ánh sáng, chữa lành.",
  },
  {
    id: 59, name: "Ten of Swords", nameVi: "Mười Swords", number: 10, arcana: "minor", suit: "swords",
    emoji: "🌅", keywords: ["kết thúc đau đớn", "phản bội", "chạm đáy", "tái sinh"],
    uprightMeaning: "Kết thúc khó khăn, nhưng bình minh đang đến. Sẵn sàng tái sinh.",
    reversedMeaning: "Thoát khỏi đáy, phục hồi, không chịu đầu hàng.",
  },
  {
    id: 60, name: "Page of Swords", nameVi: "Cậu Bé Swords", number: "Page", arcana: "minor", suit: "swords",
    emoji: "📰", keywords: ["tò mò", "nhanh nhẹn", "thông tin", "cảnh giác"],
    uprightMeaning: "Tò mò và thông minh. Tin tức mới, cần cảnh giác.",
    reversedMeaning: "Nói xấu, thông tin sai, thiếu chu đáo.",
  },
  {
    id: 61, name: "Knight of Swords", nameVi: "Kỵ Sĩ Swords", number: "Knight", arcana: "minor", suit: "swords",
    emoji: "🌪️", keywords: ["hành động nhanh", "tham vọng", "thẳng thắn", "quyết đoán"],
    uprightMeaning: "Hành động mau lẹ và quyết đoán. Tham vọng mạnh mẽ.",
    reversedMeaning: "Nóng nảy, hung hăng, thiếu kiên nhẫn.",
  },
  {
    id: 62, name: "Queen of Swords", nameVi: "Hoàng Hậu Swords", number: "Queen", arcana: "minor", suit: "swords",
    emoji: "🗡️", keywords: ["độc lập", "thông minh", "thẳng thắn", "kinh nghiệm"],
    uprightMeaning: "Thông minh và kinh nghiệm. Thẳng thắn và rõ ràng.",
    reversedMeaning: "Lạnh lùng, cay nghiệt, thiếu đồng cảm.",
  },
  {
    id: 63, name: "King of Swords", nameVi: "Vua Swords", number: "King", arcana: "minor", suit: "swords",
    emoji: "👨‍⚖️", keywords: ["trí tuệ", "công lý", "uy quyền", "sự thật"],
    uprightMeaning: "Lãnh đạo bằng trí tuệ và công bằng. Quyết định dứt khoát.",
    reversedMeaning: "Độc đoán, tàn nhẫn, sử dụng quyền lực xấu.",
  },

  // ===== MINOR ARCANA - PENTACLES =====
  {
    id: 64, name: "Ace of Pentacles", nameVi: "Át Pentacles", number: 1, arcana: "minor", suit: "pentacles",
    emoji: "🌿", keywords: ["cơ hội tài chính", "thịnh vượng", "cơ hội mới", "vật chất"],
    uprightMeaning: "Cơ hội tài chính mới, thịnh vượng và sự ổn định vật chất.",
    reversedMeaning: "Cơ hội bị bỏ lỡ, tài chính kém, vật chất thiếu thốn.",
  },
  {
    id: 65, name: "Two of Pentacles", nameVi: "Hai Pentacles", number: 2, arcana: "minor", suit: "pentacles",
    emoji: "⚖️", keywords: ["cân bằng", "thích nghi", "thời gian", "quản lý"],
    uprightMeaning: "Quản lý nhiều việc cùng lúc. Cần cân bằng và linh hoạt.",
    reversedMeaning: "Mất cân bằng, quá tải, tài chính bất ổn.",
  },
  {
    id: 66, name: "Three of Pentacles", nameVi: "Ba Pentacles", number: 3, arcana: "minor", suit: "pentacles",
    emoji: "🔨", keywords: ["hợp tác", "kỹ năng", "học hỏi", "làm việc nhóm"],
    uprightMeaning: "Hợp tác để đạt thành quả lớn. Kỹ năng được công nhận.",
    reversedMeaning: "Thiếu hợp tác, kỹ năng kém, không được công nhận.",
  },
  {
    id: 67, name: "Four of Pentacles", nameVi: "Bốn Pentacles", number: 4, arcana: "minor", suit: "pentacles",
    emoji: "🤑", keywords: ["tích lũy", "keo kiệt", "bảo mật", "kiểm soát"],
    uprightMeaning: "Giữ chặt tài sản, an toàn tài chính nhưng có thể quá keo kiệt.",
    reversedMeaning: "Rộng rãi hơn, buông bỏ kiểm soát, chi tiêu.",
  },
  {
    id: 68, name: "Five of Pentacles", nameVi: "Năm Pentacles", number: 5, arcana: "minor", suit: "pentacles",
    emoji: "🌨️", keywords: ["khó khăn", "mất mát", "nghèo đói", "cô đơn"],
    uprightMeaning: "Giai đoạn khó khăn tài chính. Tìm kiếm sự giúp đỡ, đừng bỏ cuộc.",
    reversedMeaning: "Phục hồi, vượt qua khó khăn, sự giúp đỡ đến.",
  },
  {
    id: 69, name: "Six of Pentacles", nameVi: "Sáu Pentacles", number: 6, arcana: "minor", suit: "pentacles",
    emoji: "💝", keywords: ["cho đi", "nhận lại", "từ thiện", "cân bằng"],
    uprightMeaning: "Sự hào phóng và cân bằng trong cho đi nhận lại.",
    reversedMeaning: "Cho đi có điều kiện, mất cân bằng, nợ nần.",
  },
  {
    id: 70, name: "Seven of Pentacles", nameVi: "Bảy Pentacles", number: 7, arcana: "minor", suit: "pentacles",
    emoji: "🌾", keywords: ["kiên nhẫn", "đầu tư dài hạn", "đánh giá", "chờ đợi"],
    uprightMeaning: "Kiên nhẫn chờ kết quả đầu tư. Đánh giá hướng đi.",
    reversedMeaning: "Thiếu kiên nhẫn, đầu tư kém, lãng phí công sức.",
  },
  {
    id: 71, name: "Eight of Pentacles", nameVi: "Tám Pentacles", number: 8, arcana: "minor", suit: "pentacles",
    emoji: "🔧", keywords: ["thủ công", "học nghề", "chuyên môn", "tập trung"],
    uprightMeaning: "Chăm chỉ rèn luyện kỹ năng. Sự chuyên tâm tạo nên thành công.",
    reversedMeaning: "Thiếu tập trung, lười biếng, kém chất lượng.",
  },
  {
    id: 72, name: "Nine of Pentacles", nameVi: "Chín Pentacles", number: 9, arcana: "minor", suit: "pentacles",
    emoji: "🦜", keywords: ["độc lập", "xa xỉ", "thành quả", "tự lực"],
    uprightMeaning: "Thành công và độc lập tài chính. Thưởng thức thành quả lao động.",
    reversedMeaning: "Tự lập bị đe dọa, mất tài sản, không độc lập.",
  },
  {
    id: 73, name: "Ten of Pentacles", nameVi: "Mười Pentacles", number: 10, arcana: "minor", suit: "pentacles",
    emoji: "🏡", keywords: ["di sản", "thịnh vượng gia đình", "ổn định", "truyền thống"],
    uprightMeaning: "Thịnh vượng lâu dài và di sản gia đình. Ổn định vật chất.",
    reversedMeaning: "Xung đột gia đình, mất di sản, bất ổn tài chính.",
  },
  {
    id: 74, name: "Page of Pentacles", nameVi: "Cậu Bé Pentacles", number: "Page", arcana: "minor", suit: "pentacles",
    emoji: "📚", keywords: ["học hỏi", "cơ hội", "thực tế", "mới bắt đầu"],
    uprightMeaning: "Cơ hội học hỏi và phát triển. Bắt đầu với sự thực tế.",
    reversedMeaning: "Lãng phí cơ hội, thiếu tập trung, không thực tế.",
  },
  {
    id: 75, name: "Knight of Pentacles", nameVi: "Kỵ Sĩ Pentacles", number: "Knight", arcana: "minor", suit: "pentacles",
    emoji: "🐎", keywords: ["siêng năng", "thực tế", "trách nhiệm", "bảo thủ"],
    uprightMeaning: "Chăm chỉ và có trách nhiệm. Từng bước vững chắc đến thành công.",
    reversedMeaning: "Lười biếng, bảo thủ thái quá, thiếu linh hoạt.",
  },
  {
    id: 76, name: "Queen of Pentacles", nameVi: "Hoàng Hậu Pentacles", number: "Queen", arcana: "minor", suit: "pentacles",
    emoji: "🌹", keywords: ["thực tế", "chăm sóc", "phong phú", "bảo mật"],
    uprightMeaning: "Người mẹ thực tế và hào phóng. Tạo ra môi trường ấm áp.",
    reversedMeaning: "Quá lo lắng về tiền, thiếu an toàn, không biết chăm sóc.",
  },
  {
    id: 77, name: "King of Pentacles", nameVi: "Vua Pentacles", number: "King", arcana: "minor", suit: "pentacles",
    emoji: "💰", keywords: ["thịnh vượng", "doanh nhân", "an toàn", "thực tế"],
    uprightMeaning: "Thành công tài chính vững chắc. Nhà kinh doanh tài ba.",
    reversedMeaning: "Tham lam, vật chất quá mức, quản lý kém.",
  },
];

export function getRandomCards(count: number): TarotCard[] {
  const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    ...card,
    isReversed: Math.random() > 0.5,
  }));
}

export const spreadLayouts = {
  love: {
    name: "Tình Yêu",
    emoji: "💕",
    positions: ["Hiện tại của tình yêu", "Thách thức cần vượt qua", "Lời khuyên cho tình yêu", "Kết quả tiềm năng"],
  },
  career: {
    name: "Sự Nghiệp",
    emoji: "💼",
    positions: ["Tình trạng hiện tại", "Cơ hội phía trước", "Thách thức công việc", "Hướng đi tốt nhất"],
  },
  finance: {
    name: "Tài Chính",
    emoji: "💰",
    positions: ["Tình hình tài chính", "Cơ hội tài chính", "Rủi ro cần tránh", "Lời khuyên tài chính"],
  },
  self: {
    name: "Bản Thân",
    emoji: "🌸",
    positions: ["Con người thật của bạn", "Những gì bạn cần buông bỏ", "Điểm mạnh cần phát huy", "Hành trình phía trước"],
  },
};
