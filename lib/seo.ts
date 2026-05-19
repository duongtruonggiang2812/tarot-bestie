export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://tarot-app-ashy-phi.vercel.app";

export const SITE_NAME = "Tarot Bestie";

export const SEO = {
  title: {
    default: "Tarot Bestie — Xem Bói Tarot AI Tiếng Việt Miễn Phí",
    template: "%s | Tarot Bestie",
  },
  description:
    "Rút bài tarot online miễn phí, Thần Bài giải mã tiếng Việt chuẩn xác. Xem tình yêu, sự nghiệp, tài chính với 4 reader cá tính: Bà Đồng, Bestie, Nhà Tâm Lý, Thiên Thần.",
  keywords: [
    "tarot online",
    "xem bói tarot",
    "tarot tiếng việt",
    "bói tarot miễn phí",
    "tarot ai",
    "xem bói online",
    "tarot tình yêu",
    "tarot sự nghiệp",
    "tarot gen z",
    "đọc bài tarot",
  ],
  og: {
    image: `${SITE_URL}/og-image.png`,
    type: "website" as const,
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image" as const,
  },
};

/** JSON-LD: WebApplication schema cho trang chủ */
export const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SEO.description,
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Web",
  inLanguage: "vi",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "VND",
  },
};

/** JSON-LD: Organization */
export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [],
};

/** JSON-LD: FAQ cho trang chủ */
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Tarot Bestie là gì?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tarot Bestie là ứng dụng xem bói tarot online bằng AI tiếng Việt, miễn phí. Bạn rút bài từ bộ 78 lá Rider-Waite và nhận diễn giải chi tiết từ AI theo phong cách bạn chọn.",
      },
    },
    {
      "@type": "Question",
      name: "Tarot Bestie có miễn phí không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Có! Rút bài và xem tổng quan hoàn toàn miễn phí. Thần Bài giải mã chi tiết và chat hỏi thêm sử dụng xu — bạn nhận 3 xu miễn phí mỗi ngày khi điểm danh.",
      },
    },
    {
      "@type": "Question",
      name: "Có những reader nào trên Tarot Bestie?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tarot Bestie có 4 reader: Bà Đồng Huyền Bí (huyền học, trực giác), Bestie Thẳng Thắn (thực tế, Gen Z), Nhà Tâm Lý (phân tích, nội tâm), và Thiên Thần (chữa lành, yêu thương). Mỗi reader có phong cách đọc bài khác nhau.",
      },
    },
    {
      "@type": "Question",
      name: "Tarot AI có chính xác không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tarot Bestie sử dụng AI để diễn giải bài dựa trên ý nghĩa truyền thống của từng lá bài Rider-Waite, kết hợp với ngữ cảnh câu hỏi của bạn. Kết quả mang tính tham khảo và giúp bạn nhìn nhận vấn đề từ góc độ khác.",
      },
    },
    {
      "@type": "Question",
      name: "Làm sao để nhận xu miễn phí?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Đăng nhập và điểm danh mỗi ngày để nhận 3 xu miễn phí. Xu có thể mua thêm qua chuyển khoản ngân hàng với giá từ 30.000đ.",
      },
    },
  ],
};
