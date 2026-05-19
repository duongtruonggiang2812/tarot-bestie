export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;          // ISO
  tags: string[];
  coverEmoji: string;
  readingTime: number;   // phút
  content: string;       // HTML string
}

/** Danh sách bài blog — thêm bài mới vào đây */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "y-nghia-78-la-bai-tarot",
    title: "Ý nghĩa 78 lá bài Tarot Rider-Waite — Từ A đến Z",
    description:
      "Hướng dẫn đầy đủ ý nghĩa 22 lá Major Arcana và 56 lá Minor Arcana theo bộ Rider-Waite chuẩn quốc tế, giải thích bằng tiếng Việt dễ hiểu.",
    date: "2025-05-01",
    tags: ["tarot cơ bản", "rider-waite", "major arcana", "minor arcana"],
    coverEmoji: "🃏",
    readingTime: 12,
    content: `
<p>Bộ bài Tarot Rider-Waite gồm 78 lá được chia làm 2 phần chính...</p>
<h2>Major Arcana — 22 lá bài lớn</h2>
<p>Đại diện cho những bài học lớn trong cuộc đời, các nguyên mẫu vũ trụ...</p>
<h2>Minor Arcana — 56 lá bài nhỏ</h2>
<p>Phản ánh sự kiện hằng ngày, chia làm 4 bộ: Wands, Cups, Swords, Pentacles...</p>
    `.trim(),
  },
  {
    slug: "tarot-tinh-yeu-nhung-la-bai-can-biet",
    title: "Tarot Tình Yêu — 10 Lá Bài Quan Trọng Nhất Bạn Cần Biết",
    description:
      "Khám phá 10 lá tarot hay xuất hiện nhất trong trải bài tình yêu và ý nghĩa của chúng khi hỏi về mối quan hệ, crush, hôn nhân.",
    date: "2025-05-10",
    tags: ["tarot tình yêu", "tarot cơ bản", "lá bài"],
    coverEmoji: "💕",
    readingTime: 8,
    content: `
<p>Khi rút bài tarot về tình yêu, một số lá bài hay xuất hiện hơn các lá khác...</p>
<h2>The Lovers (VI) — Người Yêu</h2>
<p>Lá bài tình yêu kinh điển nhất, đại diện cho sự lựa chọn, cam kết và kết nối tâm hồn...</p>
<h2>Two of Cups — Hai Cốc</h2>
<p>Biểu tượng của tình yêu đôi lứa cân bằng, hòa hợp...</p>
    `.trim(),
  },
  {
    slug: "cach-doc-bai-tarot-cho-nguoi-moi-bat-dau",
    title: "Cách Đọc Bài Tarot Cho Người Mới Bắt Đầu — 5 Bước Đơn Giản",
    description:
      "Hướng dẫn chi tiết cách đọc bài tarot từ đầu: cách đặt câu hỏi, chọn trải bài, hiểu ý nghĩa lá bài và kết hợp chúng với nhau.",
    date: "2025-05-15",
    tags: ["hướng dẫn", "tarot cơ bản", "người mới"],
    coverEmoji: "🔮",
    readingTime: 10,
    content: `
<p>Tarot không phức tạp như bạn nghĩ. Chỉ cần 5 bước cơ bản là bạn có thể tự đọc bài...</p>
<h2>Bước 1: Đặt câu hỏi đúng cách</h2>
<p>Câu hỏi tốt là câu hỏi mở, tập trung vào hành động của bản thân...</p>
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
