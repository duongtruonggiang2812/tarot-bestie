#!/usr/bin/env python3
"""Seed 10 blog posts vào Supabase via REST API"""

import json
import urllib.request
import urllib.error

SUPABASE_URL = "https://oobwiyxvianhpftffjmc.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vYndpeXh2aWFuaHBmdGZmam1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTA3NjkyOCwiZXhwIjoyMDk0NjUyOTI4fQ.2i7IFPnbwDGVUVjgArV6qiSLgyIDKkuLC7OtqlZML_U"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

posts = [
    {
        "slug": "tarot-gen-z-tai-sao-gioi-tre-viet-nam-me-man-xem-boi-bai",
        "title": "Tarot Gen Z: Tại Sao Giới Trẻ Việt Nam Đang Mê Mẩn Xem Bói Bài?",
        "description": "Gen Z Việt Nam đang dùng tarot như một công cụ tự khám phá bản thân, không phải mê tín. Phân tích xu hướng tâm linh mới và lý do khoa học đằng sau sức hút này.",
        "cover_emoji": "✨",
        "reading_time": 10,
        "tags": ["tarot gen z", "xu hướng", "giới trẻ", "tâm lý học"],
        "published": True,
        "published_at": "2025-05-01T08:00:00Z",
        "content": """<p>Scroll qua TikTok hay Instagram bất kỳ ngày nào, bạn đều thấy: tarot. Những video "Rút 1 lá cho năng lượng hôm nay" triệu view, cộng đồng xem bói online mọc lên như nấm, hashtag #tarot tiếng Việt đã chạm hàng trăm triệu lượt xem. Câu hỏi đặt ra: tại sao một bộ bài 500 tuổi lại bỗng dưng chiếm lĩnh màn hình điện thoại của Gen Z Việt Nam?</p>

<h2>Tarot không phải mê tín — đó là ngôn ngữ của nội tâm</h2>

<p>Sai lầm phổ biến nhất là gán tarot vào nhóm "mê tín dị đoan". Nhưng hỏi bất kỳ bạn trẻ nào đang dùng tarot thường xuyên, câu trả lời sẽ ngạc nhiên bạn: họ không xem tarot như tiên tri tương lai, mà dùng nó như <strong>gương phản chiếu nội tâm</strong>.</p>

<p>Nhà tâm lý học Carl Jung từng nghiên cứu sâu về các biểu tượng trong tarot và gọi chúng là "nguyên mẫu tập thể" — những hình ảnh phổ quát ẩn sâu trong vô thức con người. Khi nhìn vào lá The Tower và thấy nỗi sợ về sự thay đổi đột ngột trong cuộc sống của mình, não bạn không bị "thao túng" — nó đang <em>kết nối với chính mình</em>.</p>

<blockquote style="border-left: 3px solid #7c3aed; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #6b7280;">"Tôi không tin tarot có thể đoán tương lai. Nhưng sau mỗi lần đọc bài, tôi hiểu mình hơn một chút." — Minh Châu, 22 tuổi, sinh viên TP.HCM</blockquote>

<h2>3 Lý Do Khoa Học Giải Thích Sức Hút Của Tarot Với Gen Z</h2>

<h3>1. Khủng hoảng bản sắc và nhu cầu tự hiểu mình</h3>
<p>Theo nghiên cứu của APA (Hiệp hội Tâm lý Mỹ) năm 2023, Gen Z là thế hệ trải qua mức độ lo âu và trầm cảm cao nhất trong lịch sử hiện đại. Áp lực từ mạng xã hội, sự so sánh liên tục, thị trường việc làm bất ổn sau COVID — tất cả tạo ra một thế hệ đang <strong>khủng hoảng bản sắc</strong>.</p>
<p>Tarot cung cấp một không gian an toàn để đặt câu hỏi: "Mình thực sự muốn gì?", "Mình đang sợ điều gì?", "Điều gì đang cản trở mình tiến lên?" Không có câu trả lời đúng hay sai. Chỉ có <em>bạn</em> và 78 lá bài.</p>

<h3>2. Phản ứng với văn hóa "productivity toxic"</h3>
<p>Gen Z vừa là thế hệ hustle culture mạnh nhất, vừa là thế hệ đầu tiên <em>phản kháng</em> lại nó. "Quiet quitting", "slow living", "main character energy" — tất cả là biểu hiện của việc tìm kiếm ý nghĩa bên ngoài KPI và target.</p>
<p>Tarot cho phép bạn ngồi yên 15 phút, rút một lá bài, và <em>nghĩ về cảm xúc của mình</em>. Trong thế giới mà mọi thứ đều cần tối ưu hóa, đây là hành động cực kỳ cách mạng.</p>

<h3>3. Cộng đồng và ngôn ngữ chung</h3>
<p>Khi bạn nói "hôm nay mình rút được The High Priestess", một người dùng tarot khác ngay lập tức hiểu bạn đang nói về trực giác, bí ẩn nội tâm, và sự chờ đợi. Đó là một ngôn ngữ biểu tượng dùng chung, tạo ra cảm giác thuộc về cộng đồng — thứ Gen Z đang tìm kiếm mạnh mẽ nhất.</p>

<h2>Tarot Ở Việt Nam: Từ Bí Ẩn Đến Mainstream</h2>
<p>5 năm trước, nói đến tarot ở Việt Nam là nói về những buổi xem bài kín đáo, phong bì tiền mặt, và bầu không khí huyền bí. Hôm nay, bạn có thể rút bài tarot online trong 3 phút, nhận diễn giải chi tiết bằng tiếng Việt thuần, và chat hỏi thêm không giới hạn.</p>
<p>Sự thay đổi này không phải ngẫu nhiên. Nó đến từ sự gặp gỡ giữa nhu cầu thực sự của giới trẻ, công nghệ dễ tiếp cận, và cộng đồng tarot tiếng Việt ngày càng lớn mạnh.</p>

<h2>Nên Bắt Đầu Từ Đâu?</h2>
<ol>
  <li><strong>Tuần 1:</strong> Rút 1 lá mỗi sáng và suy nghĩ về ý nghĩa của nó trong ngày hôm đó</li>
  <li><strong>Tuần 2-3:</strong> Bắt đầu tìm hiểu ý nghĩa cơ bản của 22 lá Major Arcana</li>
  <li><strong>Tháng 2:</strong> Thử trải bài 3 lá (Quá khứ - Hiện tại - Tương lai)</li>
  <li><strong>Khi sẵn sàng:</strong> Khám phá 56 lá Minor Arcana theo từng bộ</li>
</ol>
<p>Bạn không cần tin vào siêu nhiên để dùng tarot hiệu quả. Bạn chỉ cần <strong>tin vào bản thân</strong> đủ để nghe những gì nội tâm đang cố nói.</p>"""
    },
    {
        "slug": "10-la-bai-tarot-canh-bao-moi-quan-he-toxic",
        "title": "10 Lá Bài Tarot Cảnh Báo Mối Quan Hệ Toxic — Bạn Có Đang Bỏ Qua?",
        "description": "Những lá bài tarot này xuất hiện không phải để dọa bạn, mà để bạn nhìn thẳng vào sự thật. Nếu chúng liên tục xuất hiện trong trải bài tình yêu, đã đến lúc cần suy nghĩ nghiêm túc.",
        "cover_emoji": "💔",
        "reading_time": 9,
        "tags": ["tarot tình yêu", "toxic relationship", "cảnh báo", "lá bài"],
        "published": True,
        "published_at": "2025-05-05T08:00:00Z",
        "content": """<p>Bạn đã rút bài về mối quan hệ của mình và cảm thấy có gì đó... không ổn. Có những lá bài cứ xuất hiện đi xuất hiện lại. Bài viết này không phải để phán xét hay dọa bạn — mà để giúp bạn <strong>nhìn thẳng vào điều mà trực giác bạn đã cảm nhận từ lâu</strong>.</p>

<h2>Nhóm 1: Cảnh Báo Mạnh — Cần Xem Lại Ngay</h2>

<h3>1. Three of Swords — Đau Tim, Phản Bội, Rạn Nứt</h3>
<p>Lá bài này không vòng vo: có sự đau đớn, mất mát, hoặc phản bội trong mối quan hệ này. Khi xuất hiện trong trải bài về người bạn đang hẹn hò, đây là dấu hiệu của sự thiếu trung thực, tam giác tình cảm, hoặc những tổn thương chưa được chữa lành đang ảnh hưởng đến cả hai.</p>
<p><strong>Câu hỏi cần tự hỏi:</strong> Bạn có đang giả vờ không thấy điều mình thực sự thấy không?</p>

<h3>2. The Tower — Sụp Đổ Bất Ngờ</h3>
<p>The Tower không báo trước — nó xuất hiện và mọi thứ thay đổi hoàn toàn. Trong bối cảnh tình yêu, lá này cảnh báo về một sự thật đang bị che giấu sắp bị lộ ra, hoặc cấu trúc của mối quan hệ đang xây trên nền móng không vững chắc.</p>

<h3>3. Five of Swords — Thắng Bằng Mọi Giá</h3>
<p>Đây là lá bài của xung đột không lành mạnh, của người luôn cần phải "thắng" trong các cuộc tranh luận. Khi một người liên tục hạ thấp bạn để cảm thấy tốt hơn về bản thân họ — đó không phải là tình yêu.</p>

<h3>4. Eight of Swords — Bị Nhốt, Không Thể Rời Đi</h3>
<p>Hình ảnh trên lá: một người bị bịt mắt, bao quanh bởi kiếm, nhưng thực ra không bị trói. Lá này nói về cảm giác <strong>bị mắc kẹt trong mối quan hệ do chính nỗi sợ của bạn</strong> — sợ cô đơn, sợ thay đổi, sợ bị phán xét. Đây là dấu hiệu cổ điển của trauma bonding.</p>

<h2>Nhóm 2: Cảnh Báo Vừa — Cần Chú Ý Và Lắng Nghe</h2>

<h3>5. The Devil — Nghiện, Phụ Thuộc, Ràng Buộc Không Lành Mạnh</h3>
<p>The Devil không phải về cái ác — nó về những ràng buộc mà bạn chọn ở lại dù biết chúng không tốt cho mình. Tình yêu dựa trên sự sợ hãi, kiểm soát, hoặc phụ thuộc tài chính/cảm xúc đều thuộc nhóm này.</p>

<h3>6. Seven of Cups — Ảo Tưởng, Không Thực Tế</h3>
<p>Bạn có đang yêu người <em>thực sự</em> trước mặt bạn, hay đang yêu hình ảnh bạn muốn họ là? Seven of Cups cảnh báo về những kỳ vọng không thực tế và từ chối nhìn nhận thực tế.</p>

<h3>7. Two of Swords — Né Tránh, Không Chịu Đối Mặt</h3>
<p>Lá này hỏi thẳng: bạn đang né tránh quyết định gì? Tiếp tục trong mối quan hệ thiếu kết nối vì sợ thay đổi không bao giờ là giải pháp lâu dài.</p>

<h3>8. King of Swords (Ngược) — Lạnh Lùng, Kiểm Soát, Thiếu Cảm Xúc</h3>
<p>Khi ngược chiều, King of Swords đại diện cho người dùng lý trí và lời nói như vũ khí — sắc bén, lạnh lùng, thiếu đồng cảm. Đây là dấu hiệu của thao túng tâm lý (gaslighting).</p>

<h2>Nhóm 3: Tín Hiệu Nhỏ — Đừng Bỏ Qua</h2>

<h3>9. Five of Pentacles — Bị Bỏ Lại Ngoài Lạnh</h3>
<p>Cảm giác cô đơn ngay trong mối quan hệ — không được ưu tiên, không được lắng nghe, không được thấy. Đây là dấu hiệu của khoảng cách cảm xúc cần được giải quyết.</p>

<h3>10. The Moon — Bí Ẩn, Không Rõ Ràng, Thiếu Tin Tưởng</h3>
<p>The Moon xuất hiện khi có điều gì đó không được nói ra, khi trực giác của bạn đang kêu cứu nhưng bạn không chắc mình đang sợ thực hay sợ bóng. Câu hỏi cần đặt ra: Tại sao bạn không tin tưởng được?</p>

<h2>Khi Nào Nên "Lắng Nghe" Cảnh Báo Từ Tarot?</h2>
<p>Một lá bài xuất hiện một lần không phải là "dấu hiệu". Nhưng nếu bạn nhận thấy cùng một lá bài xuất hiện 3+ lần, hay kết hợp nhiều lá cảnh báo trong một trải bài — đó không phải bài nói, đó là <strong>trực giác của bạn đang dùng bài như cái cớ để nói lên điều bạn đã biết từ lâu</strong>.</p>"""
    },
    {
        "slug": "y-nghia-la-bai-death-khong-dang-so-nhu-ban-nghi",
        "title": "Ý Nghĩa Lá Bài Death (XIII) — Tại Sao Nó Không Đáng Sợ Như Bạn Nghĩ",
        "description": "Rút được lá Death là điềm xấu? Hoàn toàn không. Đây là một trong những lá bài mạnh mẽ và tích cực nhất trong tarot khi bạn hiểu đúng ý nghĩa thực sự của nó.",
        "cover_emoji": "🌑",
        "reading_time": 8,
        "tags": ["major arcana", "death card", "ý nghĩa lá bài", "tarot cơ bản"],
        "published": True,
        "published_at": "2025-05-08T08:00:00Z",
        "content": """<p>Khoảnh khắc bạn lật lá bài và thấy một bộ xương cưỡi ngựa trắng — tim bạn có thể đập nhanh hơn một chút. Đó là phản ứng tự nhiên. <strong>Nhưng đây là sự thật mà hầu hết người mới học tarot không được nói ngay từ đầu: lá Death hiếm khi nói về cái chết thực sự.</strong></p>
<p>Trên thực tế, nhiều người đọc bài giàu kinh nghiệm coi Death là một trong những lá bài <em>tích cực nhất</em> trong bộ bài.</p>

<h2>Hình Ảnh Trên Lá Bài: Đọc Đúng Biểu Tượng</h2>
<ul>
  <li><strong>Lá cờ hoa hồng trắng:</strong> Sự tinh khiết, mới mẻ sau biến đổi — không phải kết thúc</li>
  <li><strong>Con ngựa trắng:</strong> Sức mạnh, sự chuyển đổi mang theo năng lượng thuần khiết</li>
  <li><strong>Mặt trời mọc đằng xa:</strong> Sau mỗi kết thúc, có một bình minh mới</li>
  <li><strong>Đứa trẻ không sợ hãi:</strong> Sự trong sáng chấp nhận thay đổi một cách tự nhiên</li>
</ul>

<h2>Ý Nghĩa Thực Sự Của Lá Death</h2>
<p>Lá Death đại diện cho <strong>sự chuyển hóa không thể tránh khỏi</strong>. Trong vũ trụ, không có gì mất đi — chỉ có sự thay đổi hình thái. Mùa đông chết để mùa xuân ra đời. Con người cũ của bạn phải "chết" để bạn của ngày mai có thể tồn tại.</p>

<blockquote style="border-left: 3px solid #7c3aed; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #6b7280;">"Lá Death không hỏi bạn muốn thay đổi không. Nó nói rằng sự thay đổi đã đến, và câu hỏi duy nhất là bạn sẽ chào đón nó hay chống lại nó." — Biddy Tarot</blockquote>

<h3>Trong Các Ngữ Cảnh Khác Nhau</h3>
<p><strong>Tình yêu:</strong> Một giai đoạn trong mối quan hệ đang kết thúc — nhưng đó có thể là giai đoạn lãng mạn ban đầu nhường chỗ cho tình yêu trưởng thành hơn. Hoặc nếu mối quan hệ đã không còn phục vụ cả hai, đây là tín hiệu đã đến lúc buông tay.</p>
<p><strong>Sự nghiệp:</strong> Con đường cũ đã hết. Đây là lúc để rẽ nhánh — chuyển nghề, thăng tiến lên cấp độ mới, hoặc buông bỏ dự án không còn phù hợp.</p>
<p><strong>Bản thân:</strong> Một phiên bản cũ của bạn đang chết đi — những niềm tin hạn chế, thói quen cũ, bản sắc lỗi thời.</p>

<h2>Death Xuôi và Ngược</h2>
<p><strong>Death xuôi:</strong> Sự thay đổi đang đến hoặc đang diễn ra. Hãy buông bỏ cái cũ. Đây là cơ hội tái sinh.</p>
<p><strong>Death ngược:</strong> Bạn đang cưỡng lại sự thay đổi. Bám víu vào quá khứ hoặc tình huống đã hết hạn.</p>

<h2>Điều Cần Biết Về Đạo Đức Tarot</h2>
<p>Về cái chết theo nghĩa đen — trong tarot chuyên nghiệp, một lá bài đơn lẻ KHÔNG bao giờ được dùng để dự đoán điều này. Nếu bạn từng gặp ai nói vậy — đó là <strong>lạm dụng tarot</strong>, không phải đọc bài chuyên nghiệp.</p>
<p>Death không phải kẻ thù. Death là <strong>người bạn đường can đảm</strong>, nhắc bạn rằng: không có mùa xuân nào mà không có mùa đông trước đó.</p>"""
    },
    {
        "slug": "boi-tarot-co-chinh-xac-khong-khoa-hoc-va-tam-ly-hoc",
        "title": "Bói Tarot Có Chính Xác Không? Khoa Học và Tâm Lý Học Nói Gì",
        "description": "Câu hỏi 'tarot có thật không' đã tốn nhiều mực viết. Bài này không bảo vệ hay bác bỏ tarot — mà phân tích trung thực từ góc độ khoa học nhận thức, tâm lý học và neuroscience.",
        "cover_emoji": "🔬",
        "reading_time": 9,
        "tags": ["tarot có chính xác không", "tâm lý học", "nghiên cứu", "khoa học"],
        "published": True,
        "published_at": "2025-05-12T08:00:00Z",
        "content": """<p>Đây là câu hỏi mà hầu hết người mới dùng tarot đều thầm hỏi nhưng ngại nói thẳng: <em>"Cái này có thật không, hay mình đang tự lừa dối?"</em></p>
<p>Câu trả lời trung thực? <strong>Phức tạp hơn cả "có" lẫn "không".</strong> Và điều đó không có nghĩa là tarot vô dụng — hoàn toàn ngược lại.</p>

<h2>Khoa Học Nói Gì Về Tarot?</h2>
<h3>Không có bằng chứng về khả năng tiên tri</h3>
<p>Thẳng thắn mà nói: không có nghiên cứu khoa học nào được peer-reviewed chứng minh rằng tarot có khả năng dự đoán tương lai theo nghĩa siêu nhiên. Các thí nghiệm kiểm soát về khả năng ngoại cảm đều cho kết quả không khác với cơ hội ngẫu nhiên.</p>
<p>Nhưng quan trọng là: <strong>hầu hết người dùng tarot nghiêm túc không tuyên bố nó có khả năng tiên tri siêu nhiên</strong>. Đó là hiểu lầm phổ biến nhất về tarot.</p>

<h2>Tâm Lý Học Nhận Thức: Tại Sao Tarot Thực Sự Có Tác Dụng</h2>
<h3>1. Projective Test — Nhìn Vào Gương Tâm Trí</h3>
<p>Các nhà tâm lý học từ lâu đã sử dụng kỹ thuật "projective test" — cho bệnh nhân nhìn vào hình ảnh mơ hồ và mô tả những gì họ thấy. Kết quả tiết lộ những lo âu, mong muốn, và xung đột tiềm thức.</p>
<p>Tarot hoạt động theo nguyên tắc tương tự. Khi bạn nhìn vào lá The Moon và tự hỏi "lá này đang nói về điều gì trong cuộc sống của mình?" — <strong>não bạn đang tự trả lời câu hỏi đó bằng chính kiến thức và cảm xúc của mình</strong>.</p>

<h3>2. Narrative Therapy — Kể Chuyện Để Chữa Lành</h3>
<p>Liệu pháp tường thuật cho rằng con người hiểu cuộc sống của mình thông qua những câu chuyện. Tarot cung cấp framework để tái cấu trúc cách nhìn của mình về tình huống — đây là kỹ thuật tâm lý học được công nhận.</p>

<h3>3. Externalization — Đặt Vấn Đề Ra Ngoài Để Nhìn Rõ Hơn</h3>
<p>Trong tâm lý học, "externalization" giúp bạn nhìn vấn đề như thể nó đứng ngoài bạn. Khi rút một lá bài và nói "lá này đại diện cho nỗi sợ của tôi", bạn đang externalize nỗi sợ đó — giúp não bạn phân tích nó khách quan hơn.</p>

<h2>Vậy Tarot Có "Chính Xác" Không?</h2>
<table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
  <tr style="background: rgba(124,58,237,0.08);">
    <th style="padding: 10px; text-align: left;">Câu hỏi</th>
    <th style="padding: 10px; text-align: left;">Câu trả lời</th>
  </tr>
  <tr style="border-bottom: 1px solid rgba(124,58,237,0.1);">
    <td style="padding: 10px;">Tarot có tiên tri tương lai siêu nhiên không?</td>
    <td style="padding: 10px;">Chưa có bằng chứng khoa học</td>
  </tr>
  <tr style="border-bottom: 1px solid rgba(124,58,237,0.1);">
    <td style="padding: 10px;">Tarot có giúp tự hiểu bản thân không?</td>
    <td style="padding: 10px;">Có — được tâm lý học ủng hộ</td>
  </tr>
  <tr style="border-bottom: 1px solid rgba(124,58,237,0.1);">
    <td style="padding: 10px;">Tarot có giúp đưa ra quyết định tốt hơn không?</td>
    <td style="padding: 10px;">Có thể, đặc biệt khi dùng đúng cách</td>
  </tr>
  <tr>
    <td style="padding: 10px;">Tarot có thay thế được tư vấn chuyên nghiệp không?</td>
    <td style="padding: 10px;">Không</td>
  </tr>
</table>
<p>Dùng tarot như một <strong>công cụ phản tư, không phải oracle siêu nhiên</strong> — đó là cách dùng vừa trung thực, vừa thực sự có lợi.</p>"""
    },
    {
        "slug": "cach-dat-cau-hoi-tarot-chuan-ket-qua-chinh-xac",
        "title": "Cách Đặt Câu Hỏi Tarot Đúng Chuẩn — Bí Quyết Để Kết Quả Không Bao Giờ Mơ Hồ",
        "description": "Kết quả tarot mơ hồ? 80% lỗi nằm ở câu hỏi. Hướng dẫn chi tiết cách đặt câu hỏi tarot chuẩn cho từng chủ đề: tình yêu, sự nghiệp, tài chính, bản thân.",
        "cover_emoji": "💭",
        "reading_time": 8,
        "tags": ["hướng dẫn", "câu hỏi tarot", "tarot cơ bản", "người mới"],
        "published": True,
        "published_at": "2025-05-15T08:00:00Z",
        "content": """<p>Bạn đã từng rút bài và nhận được kết quả mà cảm thấy không biết áp dụng vào đâu? Vấn đề gần như chắc chắn nằm ở <strong>câu hỏi, không phải bài</strong>. Tarot là công cụ phản chiếu — và gương chỉ phản chiếu đúng khi bạn đứng đúng góc.</p>

<h2>Nguyên Tắc Vàng: Câu Hỏi Tốt Tập Trung Vào Bạn</h2>
<p>❌ <strong>Câu hỏi hướng ngoại:</strong> "Anh ấy có thích mình không?" / "Công ty có thăng chức cho mình không?"</p>
<p>✅ <strong>Câu hỏi hướng nội:</strong> "Tôi cần làm gì để tạo kết nối tốt hơn với anh ấy?" / "Năng lực nào tôi cần phát triển để được xem xét thăng chức?"</p>
<p>Lý do: Tarot không đọc được tâm trí người khác. Nhưng nó rất giỏi phản chiếu những gì <em>bạn</em> đang trải qua và cần làm.</p>

<h2>4 Khung Câu Hỏi Hiệu Quả Nhất</h2>
<h3>1. "Tôi cần biết gì về..."</h3>
<p>Câu hỏi mở nhất, thường cho kết quả giàu thông tin nhất.<br/>📌 <em>"Tôi cần biết gì về mối quan hệ của mình với [tên] ngay lúc này?"</em></p>

<h3>2. "Làm thế nào để tôi..."</h3>
<p>Hướng đến hành động. Tốt nhất khi bạn đã biết vấn đề nhưng chưa biết hướng xử lý.<br/>📌 <em>"Làm thế nào để tôi vượt qua sự trì hoãn và bắt đầu dự án mới này?"</em></p>

<h3>3. "Điều gì đang cản trở tôi..."</h3>
<p>Lý tưởng khi bạn cảm thấy mắc kẹt.<br/>📌 <em>"Điều gì đang cản trở tôi tự tin hơn trong các cuộc phỏng vấn xin việc?"</em></p>

<h3>4. "Hãy cho tôi thấy..."</h3>
<p>Dùng khi cần góc nhìn tổng quan.<br/>📌 <em>"Hãy cho tôi thấy năng lượng tổng quan của mối quan hệ này trong 3 tháng tới."</em></p>

<h2>Câu Hỏi Mẫu Theo Chủ Đề</h2>
<h3>Tình Yêu 💕</h3>
<ul>
  <li>"Bài học tôi cần học từ mối quan hệ cũ này là gì?"</li>
  <li>"Điều gì đang ngăn tôi tìm kiếm tình yêu mới?"</li>
  <li>"Tôi cần thay đổi gì trong bản thân để thu hút mối quan hệ lành mạnh hơn?"</li>
</ul>
<h3>Sự Nghiệp 💼</h3>
<ul>
  <li>"Tài năng nào của tôi đang chưa được khai thác trong công việc hiện tại?"</li>
  <li>"Yếu tố nào đang tạo ra trở ngại lớn nhất trong sự nghiệp của tôi lúc này?"</li>
</ul>
<h3>Bản Thân 🌸</h3>
<ul>
  <li>"Điều tôi cần chú ý đến nhất trong giai đoạn này của cuộc đời?"</li>
  <li>"Phần nào của bản thân tôi cần được chữa lành?"</li>
</ul>

<h2>Trước Khi Rút Bài: 60 Giây Quan Trọng</h2>
<ol>
  <li>Ngồi im 30 giây, hít thở sâu</li>
  <li>Viết ra câu hỏi theo đúng một trong các khung trên</li>
  <li>Đọc lại và hỏi bản thân: <em>"Câu hỏi này thực sự hỏi về điều gì?"</em></li>
  <li>Khi cảm thấy câu hỏi "đúng" — lúc đó mới rút bài</li>
</ol>
<p>Bài tarot không thể tốt hơn câu hỏi của bạn. Nhưng với câu hỏi đúng, nó có thể mở ra những góc nhìn bạn chưa bao giờ nghĩ đến.</p>"""
    },
    {
        "slug": "tarot-su-nghiep-7-la-bai-bao-hieu-da-den-luc-chuyen-viec",
        "title": "Tarot Sự Nghiệp: 7 Lá Bài Báo Hiệu Đã Đến Lúc Chuyển Việc",
        "description": "Những lá bài tarot này không phải ngẫu nhiên xuất hiện. Nếu bạn đang hỏi về sự nghiệp và liên tục thấy chúng, vũ trụ có thể đang gửi một tín hiệu rõ ràng.",
        "cover_emoji": "💼",
        "reading_time": 8,
        "tags": ["tarot sự nghiệp", "chuyển việc", "sự nghiệp", "lá bài"],
        "published": True,
        "published_at": "2025-05-18T08:00:00Z",
        "content": """<p>Bạn đang ngồi trong cuộc họp thứ mười lần trong tuần cảm thấy trống rỗng. Màn hình laptop mở LinkedIn nhiều hơn email công ty. Bạn biết có điều gì đó cần thay đổi — nhưng chưa dám quyết định.</p>
<p>Đây là 7 lá bài thường xuất hiện khi tarot đang nói: <strong>"Bước đi đi. Đã đến lúc rồi."</strong></p>

<h2>1. The Fool — Bắt Đầu Mới, Nhảy Vào Điều Chưa Biết</h2>
<p>The Fool là tín hiệu mạnh mẽ nhất rằng: <strong>một chương mới đang gọi bạn</strong>. Bạn không cần phải có đầy đủ thông tin hay kế hoạch hoàn hảo. Vũ trụ đang bảo bạn: bước đi trước, bản đồ sẽ xuất hiện sau.</p>

<h2>2. The Tower — Cấu Trúc Cũ Đang Sụp Đổ</h2>
<p>Nếu The Tower xuất hiện trong câu hỏi về công việc hiện tại: hoặc môi trường làm việc đang trải qua biến động lớn, hoặc nền tảng bạn đang đứng không còn vững. Thông điệp: <strong>đừng bám víu vào thứ đã bắt đầu lung lay</strong>.</p>

<h2>3. Eight of Cups — Bỏ Lại Những Gì Không Còn Phục Vụ Bạn</h2>
<p>Hình ảnh trên lá: một người lặng lẽ rời đi, bỏ lại 8 chiếc cốc xếp đầy — không phải vì chúng hỏng, mà vì <em>điều anh ấy tìm kiếm không nằm ở đây nữa</em>. Lá này không hỏi "công việc này có ổn không?" — nó hỏi: "Tâm hồn bạn có ổn không khi tiếp tục ở đây?"</p>

<h2>4. Three of Wands — Tầm Nhìn Xa Hơn Đường Chân Trời</h2>
<p>Lá này báo hiệu: có cơ hội tốt hơn đang đến — nhưng bạn cần <em>sẵn sàng nhìn ra xa hơn</em> thay vì cúi đầu với công việc hiện tại. Đây là lúc mở rộng mạng lưới, tìm kiếm cơ hội bên ngoài.</p>

<h2>5. The Hermit — Cần Thời Gian Phản Tư</h2>
<p>The Hermit không nói "bỏ việc ngay". Nó nói: <strong>"Ngồi xuống và thực sự suy nghĩ về điều bạn muốn trước khi bước tiếp."</strong> Đây là giai đoạn cần chiêm nghiệm — viết journal, trò chuyện với mentor, dành thời gian một mình.</p>

<h2>6. Five of Pentacles — Cảm Giác Thiếu Thốn Dù Đang Có Việc</h2>
<p>Lá bài xuất hiện khi bạn đang có việc làm nhưng cảm thấy nghèo nàn về <strong>sự công nhận, tăng trưởng, ý nghĩa, hay sức khỏe tâm thần</strong>. Một công việc trả lương tốt nhưng khiến bạn héo mòn từng ngày không phải "may mắn".</p>

<h2>7. The Star — Hy Vọng Và Định Hướng Mới</h2>
<p>The Star nói: "Có một con đường phù hợp hơn với bạn thật sự — có liên quan đến hy vọng, đam mê, và cảm giác đúng đắn." Đây là lúc để tin tưởng và theo đuổi điều bạn thực sự muốn làm.</p>

<h2>Checklist Thực Tế Song Song Với Tarot</h2>
<ul>
  <li>✅ Ít nhất 3-6 tháng quỹ khẩn cấp</li>
  <li>✅ CV và portfolio đã được cập nhật</li>
  <li>✅ 2-3 cuộc trò chuyện informational với người trong lĩnh vực muốn chuyển sang</li>
  <li>✅ Rõ ràng về lý do <em>chạy đến đâu</em>, không chỉ <em>chạy trốn khỏi đâu</em></li>
</ul>"""
    },
    {
        "slug": "major-arcana-22-la-bai-lon-y-nghia-chi-tiet",
        "title": "Major Arcana: Hành Trình 22 Lá Bài Lớn — Ý Nghĩa Chi Tiết Từng Lá",
        "description": "Hướng dẫn đầy đủ 22 lá Major Arcana từ The Fool đến The World. Ý nghĩa xuôi, ngược, biểu tượng chính và cách ứng dụng trong cuộc sống hằng ngày.",
        "cover_emoji": "🌟",
        "reading_time": 15,
        "tags": ["major arcana", "ý nghĩa lá bài", "tarot cơ bản", "rider-waite"],
        "published": True,
        "published_at": "2025-05-20T08:00:00Z",
        "content": """<p>Major Arcana — 22 lá bài lớn — là trái tim của bộ tarot. Chúng đại diện cho những lực lượng vũ trụ, những bài học sâu sắc của cuộc đời, và hành trình tâm linh của con người. Khi Major Arcana xuất hiện trong trải bài, hãy chú ý đặc biệt: vũ trụ đang nói điều gì đó quan trọng.</p>

<h2>0 — The Fool: Khởi Đầu Thuần Khiết</h2>
<p><strong>Xuôi:</strong> Khởi đầu mới, tự do, niềm tin, phiêu lưu, sự ngây thơ sáng tạo.<br/><strong>Ngược:</strong> Liều lĩnh thiếu cân nhắc, bỏ qua rủi ro quan trọng.</p>

<h2>I — The Magician: Pháp Sư</h2>
<p><strong>Xuôi:</strong> Ý chí, khả năng, hành động, sáng tạo, tập trung, dùng tài năng đúng chỗ.<br/><strong>Ngược:</strong> Thao túng, lãng phí tài năng, thiếu tập trung.</p>

<h2>II — The High Priestess: Nữ Tăng Lữ</h2>
<p><strong>Xuôi:</strong> Trực giác, bí ẩn nội tâm, kiến thức ẩn, sự chờ đợi khôn ngoan, tiềm thức.<br/><strong>Ngược:</strong> Bỏ qua trực giác, nội tâm bị bóp nghẹt.</p>

<h2>III — The Empress: Nữ Hoàng</h2>
<p><strong>Xuôi:</strong> Nữ tính, sáng tạo, thiên nhiên, sự nuôi dưỡng, phong phú.<br/><strong>Ngược:</strong> Phụ thuộc, sáng tạo bị chặn, vấn đề về tự yêu bản thân.</p>

<h2>IV — The Emperor: Hoàng Đế</h2>
<p><strong>Xuôi:</strong> Quyền lực, cấu trúc, ổn định, kỷ luật, hình mẫu cha.<br/><strong>Ngược:</strong> Độc đoán, cứng nhắc, lạm dụng quyền lực.</p>

<h2>V — The Hierophant: Giáo Hoàng</h2>
<p><strong>Xuôi:</strong> Truyền thống, tôn giáo, thể chế, đạo đức, học hỏi từ thầy.<br/><strong>Ngược:</strong> Phá vỡ quy tắc, đạo đức giả, giáo điều.</p>

<h2>VI — The Lovers: Người Yêu</h2>
<p><strong>Xuôi:</strong> Tình yêu, sự lựa chọn, giá trị, liên kết tâm hồn, thống nhất đối lập.<br/><strong>Ngược:</strong> Bất hòa, lựa chọn sai, giá trị lệch lạc.</p>

<h2>VII — The Chariot: Cỗ Xe</h2>
<p><strong>Xuôi:</strong> Ý chí, kiểm soát, chiến thắng, tự kỷ luật, vượt qua trở ngại.<br/><strong>Ngược:</strong> Thiếu kiểm soát, hung hăng, thất bại do bướng bỉnh.</p>

<h2>VIII — Strength: Sức Mạnh</h2>
<p><strong>Xuôi:</strong> Can đảm nội tâm, kiên nhẫn, lòng trắc ẩn, kiểm soát bản năng.<br/><strong>Ngược:</strong> Tự ti, sợ hãi, thiếu kiên nhẫn.</p>

<h2>IX — The Hermit: Ẩn Sĩ</h2>
<p><strong>Xuôi:</strong> Chiêm nghiệm, cô đơn có chủ đích, tìm kiếm nội tâm, trí tuệ.<br/><strong>Ngược:</strong> Cô lập quá mức, né tránh xã hội, mất phương hướng.</p>

<h2>X — Wheel of Fortune: Bánh Xe Số Phận</h2>
<p><strong>Xuôi:</strong> Vận may, chuyển biến, chu kỳ, vận mệnh, cơ hội bất ngờ.<br/><strong>Ngược:</strong> Vận xui, chống lại thay đổi, vòng lặp xấu.</p>

<h2>XI — Justice: Công Lý</h2>
<p><strong>Xuôi:</strong> Sự công bằng, hậu quả tự nhiên, trách nhiệm, sự thật.<br/><strong>Ngược:</strong> Bất công, thiên vị, trốn tránh hậu quả.</p>

<h2>XII — The Hanged Man: Người Treo Ngược</h2>
<p><strong>Xuôi:</strong> Buông bỏ, góc nhìn mới, hy sinh tự nguyện, chờ đợi có ý thức.<br/><strong>Ngược:</strong> Kéo dài không cần thiết, không chịu buông.</p>

<h2>XIII — Death: Tử Thần</h2>
<p><strong>Xuôi:</strong> Kết thúc một chương, chuyển hóa, buông bỏ cái cũ, tái sinh.<br/><strong>Ngược:</strong> Chống lại thay đổi, trì hoãn cái tất yếu.</p>

<h2>XIV — Temperance: Điều Độ</h2>
<p><strong>Xuôi:</strong> Cân bằng, kiên nhẫn, hòa hợp, mục đích dài hạn, dung hòa đối lập.<br/><strong>Ngược:</strong> Mất cân bằng, thái quá, thiếu kiên nhẫn.</p>

<h2>XV — The Devil: Ác Quỷ</h2>
<p><strong>Xuôi:</strong> Nghiện, phụ thuộc, ảo tưởng, bị ràng buộc bởi vật chất.<br/><strong>Ngược:</strong> Thoát ra, giải phóng, từ chối nô lệ.</p>

<h2>XVI — The Tower: Tháp</h2>
<p><strong>Xuôi:</strong> Sụp đổ đột ngột, phá hủy nền móng giả, sự thật bùng phát.<br/><strong>Ngược:</strong> Trì hoãn sụp đổ, kháng cự thay đổi tất yếu.</p>

<h2>XVII — The Star: Ngôi Sao</h2>
<p><strong>Xuôi:</strong> Hy vọng, chữa lành, cảm hứng, sự tái sinh sau đau khổ, niềm tin.<br/><strong>Ngược:</strong> Thất vọng, mất hy vọng, mất kết nối với linh hồn.</p>

<h2>XVIII — The Moon: Mặt Trăng</h2>
<p><strong>Xuôi:</strong> Ảo giác, tiềm thức, sợ hãi, bí ẩn, trực giác sâu.<br/><strong>Ngược:</strong> Nỗi sợ tan dần, sự thật lộ ra, vượt qua lo âu.</p>

<h2>XIX — The Sun: Mặt Trời</h2>
<p><strong>Xuôi:</strong> Vui vẻ, thành công, sống động, sự thật, sức sống, tích cực.<br/><strong>Ngược:</strong> Lạc quan thái quá, tự mãn, năng lượng suy yếu.</p>

<h2>XX — Judgement: Phán Xét</h2>
<p><strong>Xuôi:</strong> Sự thức tỉnh, đánh giá lại, tha thứ, lời gọi từ bên trong, cơ hội thứ hai.<br/><strong>Ngược:</strong> Tự phán xét gay gắt, bỏ lỡ cơ hội, trì hoãn thay đổi.</p>

<h2>XXI — The World: Thế Giới</h2>
<p><strong>Xuôi:</strong> Hoàn thành, thành tựu, tích hợp, toàn vẹn, kết thúc một chu kỳ lớn.<br/><strong>Ngược:</strong> Chưa hoàn thành, thiếu đóng cửa (closure).</p>

<p>Major Arcana là câu chuyện của mỗi chúng ta — The Fool bắt đầu hành trình không biết gì, và The World là khi chúng ta hoàn thành một vòng tròn, sẵn sàng bắt đầu một hành trình mới với hiểu biết sâu sắc hơn.</p>"""
    },
    {
        "slug": "trai-bai-tarot-1-la-3-la-celtic-cross-nen-chon-loai-nao",
        "title": "Trải Bài Tarot 1 Lá, 3 Lá Hay Celtic Cross? Hướng Dẫn Chọn Đúng Cho Từng Tình Huống",
        "description": "Không phải kiểu trải bài nào cũng phù hợp với mọi câu hỏi. So sánh chi tiết 3 kiểu trải bài phổ biến nhất và khi nào nên dùng từng loại để có kết quả tốt nhất.",
        "cover_emoji": "🎴",
        "reading_time": 8,
        "tags": ["trải bài tarot", "celtic cross", "hướng dẫn", "tarot cơ bản"],
        "published": True,
        "published_at": "2025-05-22T08:00:00Z",
        "content": """<p>Một trong những câu hỏi phổ biến nhất của người mới học tarot: <em>"Tôi nên rút mấy lá?"</em> Câu trả lời: <strong>không có kiểu nào "đúng tuyệt đối" — chỉ có kiểu phù hợp hay không phù hợp với câu hỏi của bạn.</strong></p>

<h2>Trải Bài 1 Lá — Đơn Giản, Tập Trung</h2>
<p><strong>Thời gian đọc:</strong> 2-5 phút</p>
<h3>Phù hợp nhất cho:</h3>
<ul>
  <li>Câu hỏi tập trung, rõ ràng: "Tôi cần tập trung vào điều gì hôm nay?"</li>
  <li>Năng lượng trong ngày (daily card)</li>
  <li>Người mới bắt đầu — đủ thời gian học sâu từng lá một</li>
</ul>
<p><strong>Cách đọc:</strong> Chỉ một lá — nhưng đọc sâu. Nhìn vào hình ảnh, cảm nhận đầu tiên của bạn là gì? Hãy tin vào phản ứng tức thì trước khi tra cứu ý nghĩa.</p>

<h2>Trải Bài 3 Lá — Cân Bằng Giữa Đơn Giản và Chiều Sâu</h2>
<p><strong>Thời gian đọc:</strong> 10-20 phút</p>
<table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
  <tr style="background: rgba(124,58,237,0.08);">
    <th style="padding: 8px;">Vị trí 1</th><th style="padding: 8px;">Vị trí 2</th><th style="padding: 8px;">Vị trí 3</th><th style="padding: 8px;">Dùng cho</th>
  </tr>
  <tr style="border-bottom: 1px solid rgba(124,58,237,0.1);">
    <td style="padding: 8px;">Quá khứ</td><td style="padding: 8px;">Hiện tại</td><td style="padding: 8px;">Tương lai</td><td style="padding: 8px;">Xem dòng chảy tổng quan</td>
  </tr>
  <tr style="border-bottom: 1px solid rgba(124,58,237,0.1);">
    <td style="padding: 8px;">Tình huống</td><td style="padding: 8px;">Hành động</td><td style="padding: 8px;">Kết quả</td><td style="padding: 8px;">Ra quyết định</td>
  </tr>
  <tr>
    <td style="padding: 8px;">Tôi</td><td style="padding: 8px;">Họ</td><td style="padding: 8px;">Mối quan hệ</td><td style="padding: 8px;">Tình yêu/quan hệ</td>
  </tr>
</table>

<h2>Celtic Cross (10 Lá) — Phân Tích Toàn Diện</h2>
<p><strong>Thời gian đọc:</strong> 45-90 phút</p>
<p>Celtic Cross gồm 10 vị trí: Tình huống hiện tại · Trở ngại · Nền tảng · Quá khứ gần · Khả năng tốt nhất · Tương lai gần · Bạn · Ảnh hưởng bên ngoài · Hy vọng/nỗi sợ · Kết quả cuối cùng.</p>
<p><strong>Chỉ dùng khi:</strong> Tình huống thực sự phức tạp, bạn đã quen đọc bài 3-6 tháng, có đủ thời gian tập trung.</p>

<h2>Khuyến Nghị Theo Trình Độ</h2>
<table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
  <tr style="background: rgba(124,58,237,0.08);">
    <th style="padding: 8px;">Giai đoạn</th><th style="padding: 8px;">Kiểu trải bài</th><th style="padding: 8px;">Mục tiêu</th>
  </tr>
  <tr style="border-bottom: 1px solid rgba(124,58,237,0.1);">
    <td style="padding: 8px;">Tháng 1-2</td><td style="padding: 8px;">1 lá mỗi ngày</td><td style="padding: 8px;">Học biểu tượng, xây trực giác</td>
  </tr>
  <tr style="border-bottom: 1px solid rgba(124,58,237,0.1);">
    <td style="padding: 8px;">Tháng 3-6</td><td style="padding: 8px;">3 lá</td><td style="padding: 8px;">Học kể chuyện qua nhiều lá</td>
  </tr>
  <tr>
    <td style="padding: 8px;">6+ tháng</td><td style="padding: 8px;">Celtic Cross</td><td style="padding: 8px;">Phân tích đa chiều</td>
  </tr>
</table>
<p><strong>Quy tắc cuối cùng:</strong> kiểu trải bài tốt nhất là kiểu bạn đủ hiểu để đọc đúng.</p>"""
    },
    {
        "slug": "tarot-va-tu-vi-5-diem-khac-biet-ban-can-biet",
        "title": "Tarot và Tử Vi: 5 Điểm Khác Biệt Quan Trọng — Dùng Cái Nào Khi Nào?",
        "description": "Tarot và tử vi đều là công cụ tự khám phá nhưng hoạt động theo nguyên tắc hoàn toàn khác nhau. So sánh chi tiết để bạn biết khi nào nên dùng cái nào.",
        "cover_emoji": "⭐",
        "reading_time": 7,
        "tags": ["tarot và tử vi", "so sánh", "tâm linh", "kiến thức"],
        "published": True,
        "published_at": "2025-05-25T08:00:00Z",
        "content": """<p>Câu hỏi "tarot hay tử vi chính xác hơn?" thực ra là câu hỏi sai. Chúng không cạnh tranh với nhau — chúng là hai công cụ hoàn toàn khác nhau, phục vụ các mục đích khác nhau.</p>

<h2>1. Tĩnh vs Động</h2>
<p><strong>Tử vi:</strong> Dựa trên ngày giờ sinh — bản đồ sao lúc bạn chào đời không bao giờ thay đổi. Cung cấp <em>bối cảnh nền</em>: xu hướng tính cách, thời điểm thuận/nghịch lợi trong cuộc đời.</p>
<p><strong>Tarot:</strong> Dựa trên khoảnh khắc hiện tại — mỗi lần rút bài là snapshot của năng lượng <em>lúc này, hôm nay</em>. Cùng một câu hỏi ở 2 thời điểm khác nhau có thể cho kết quả khác nhau.</p>
<p><em>Ví dụ:</em> Tử vi có thể nói "năm 2025 thuận lợi cho sự nghiệp" (xu hướng dài hạn). Tarot sẽ nói "tuần này cần dọn dẹp xung đột trong nhóm trước khi tiến lên" (hành động cụ thể).</p>

<h2>2. Số phận vs Tự do ý chí</h2>
<p><strong>Tử vi truyền thống</strong> thường có xu hướng deterministic hơn — "vận mệnh" được đọc từ các sao.</p>
<p><strong>Tarot</strong> về cơ bản là công cụ của <em>free will</em>. Kết quả không phải là "đây là tương lai của bạn" mà là "nếu bạn tiếp tục theo hướng hiện tại, đây là xu hướng". Bạn luôn có thể thay đổi.</p>

<h2>3. Cách Tiếp Cận Kiến Thức</h2>
<p><strong>Tử vi:</strong> Hệ thống được mã hóa chặt chẽ, có quy tắc rõ ràng, kết quả tương đối nhất quán giữa các astrologer.</p>
<p><strong>Tarot:</strong> Linh hoạt hơn — cách giải thích phụ thuộc vào trực giác của người đọc và ngữ cảnh cụ thể. Hai người đọc cùng một trải bài có thể cho kết quả khác nhau — và cả hai đều có thể đúng.</p>

<h2>4. Thông Tin Cần Thiết</h2>
<p><strong>Tử vi:</strong> Cần biết chính xác ngày, giờ, nơi sinh. Không có thông tin này, kết quả kém tin cậy.</p>
<p><strong>Tarot:</strong> Không cần thông tin cá nhân nào. Bạn có thể rút bài hoàn toàn ẩn danh và vẫn nhận được kết quả có giá trị.</p>

<h2>5. Mục Đích Sử Dụng Tốt Nhất</h2>
<table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
  <tr style="background: rgba(124,58,237,0.08);">
    <th style="padding: 8px; text-align: left;">Dùng Tử Vi khi...</th>
    <th style="padding: 8px; text-align: left;">Dùng Tarot khi...</th>
  </tr>
  <tr style="border-bottom: 1px solid rgba(124,58,237,0.1);">
    <td style="padding: 8px;">Muốn hiểu tính cách sâu sắc, điểm mạnh/yếu bẩm sinh</td>
    <td style="padding: 8px;">Cần quyết định nhanh về tình huống hiện tại</td>
  </tr>
  <tr style="border-bottom: 1px solid rgba(124,58,237,0.1);">
    <td style="padding: 8px;">Hỏi về thời điểm — khi nào nên hành động</td>
    <td style="padding: 8px;">Cần góc nhìn mới về cảm xúc và nội tâm</td>
  </tr>
  <tr>
    <td style="padding: 8px;">Xem xu hướng dài hạn theo năm</td>
    <td style="padding: 8px;">Muốn hỏi "tôi cần làm gì ngay bây giờ?"</td>
  </tr>
</table>

<h2>Kết Hợp Cả Hai — Cách Dùng Thông Minh Nhất</h2>
<ol>
  <li>Đọc tử vi để hiểu "tháng này năng lượng chung của mình là gì?" (bối cảnh vĩ mô)</li>
  <li>Dùng tarot hằng tuần để "điều hướng trong bối cảnh đó" (hành động vi mô)</li>
</ol>
<p>Không cần chọn một. Cần hiểu từng cái mạnh ở đâu để dùng đúng chỗ.</p>"""
    },
    {
        "slug": "fools-journey-hanh-trinh-ke-kho-bi-an-dang-sau-78-la-tarot",
        "title": "The Fool's Journey: Hành Trình Của Kẻ Khờ — Bí Ẩn Triết Học Đằng Sau 78 Lá Tarot",
        "description": "Tại sao 78 lá tarot không phải 78 ý nghĩa riêng lẻ, mà là một câu chuyện hoàn chỉnh? Khám phá triết học sâu sắc đằng sau bộ bài cổ đại này.",
        "cover_emoji": "🌈",
        "reading_time": 11,
        "tags": ["the fool", "major arcana", "lịch sử tarot", "triết học tarot"],
        "published": True,
        "published_at": "2025-05-28T08:00:00Z",
        "content": """<p>Hầu hết người học tarot bắt đầu bằng cách học thuộc ý nghĩa từng lá một. Đó là cách tiếp cận ổn — nhưng bỏ qua một điều kỳ diệu: <strong>78 lá tarot không phải là từ điển, mà là một bộ tiểu thuyết.</strong> Và nhân vật chính là The Fool — Kẻ Khờ số 0.</p>

<h2>Ai Là The Fool?</h2>
<p>The Fool không phải người ngốc nghếch. Số 0 trong toán học đứng trước tất cả, là <em>tiềm năng thuần khiết</em>. The Fool là bạn trước khi cuộc đời bắt đầu định hình — trước khi bị ảnh hưởng bởi kinh nghiệm, nỗi sợ, kỳ vọng của xã hội.</p>
<p>Và hành trình của The Fool qua 21 lá Major Arcana còn lại là hành trình của <em>mỗi con người</em> — từ ngây thơ hồn nhiên đến trí tuệ trưởng thành, từ không biết gì đến hiểu tất cả và sẵn sàng bắt đầu lại.</p>

<h2>Giai Đoạn 1: Thế Giới Vật Chất (I - VII)</h2>
<p>The Fool gặp những nhân vật đầu tiên đại diện cho <strong>cấu trúc của thế giới trần gian</strong>:</p>
<p><strong>The Magician (I)</strong> — Bài học đầu tiên: bạn có mọi công cụ cần thiết. Ý chí và hành động.</p>
<p><strong>The High Priestess (II)</strong> — Không phải mọi thứ đều hiển thị. Hãy học lắng nghe nội tâm.</p>
<p><strong>The Empress (III)</strong> — Trải nghiệm sự nuôi dưỡng, thiên nhiên, sự sáng tạo phồn thịnh.</p>
<p><strong>The Emperor (IV)</strong> — Học cấu trúc, kỷ luật, quyền lực, giới hạn cần thiết.</p>
<p><strong>The Hierophant (V)</strong> — Gặp hệ thống, truyền thống, xã hội. Học luật lệ để sau này quyết định tuân thủ hay phá vỡ.</p>
<p><strong>The Lovers (VI)</strong> — Lần đầu tiên đối mặt với lựa chọn thực sự dựa trên giá trị cá nhân.</p>
<p><strong>The Chariot (VII)</strong> — Học kiểm soát, ý chí, chiến thắng. Bước ra khỏi gia đình và xã hội để khẳng định bản thân.</p>

<h2>Giai Đoạn 2: Thế Giới Nội Tâm (VIII - XIV)</h2>
<p><strong>Strength (VIII)</strong> — Đối mặt với con thú trong bản thân — không phải để chiến đấu, mà để thuần phục bằng tình yêu.</p>
<p><strong>The Hermit (IX)</strong> — Cô đơn có chủ đích để tìm sự thật bên trong.</p>
<p><strong>Wheel of Fortune (X)</strong> — Nhận ra rằng cuộc đời có chu kỳ. Không phải mọi thứ đều trong tầm kiểm soát.</p>
<p><strong>Justice (XI)</strong> — Đối mặt với hậu quả thực sự của các lựa chọn. Học trách nhiệm.</p>
<p><strong>The Hanged Man (XII)</strong> — Buông bỏ ý chí kiểm soát. Cho phép bản thân nhìn thế giới lộn ngược — và thấy sự thật mới.</p>
<p><strong>Death (XIII)</strong> — Chết đi phiên bản cũ. Không thể tiến lên nếu không để lại cái đã hết thời.</p>
<p><strong>Temperance (XIV)</strong> — Tích hợp những bài học, tìm sự cân bằng giữa các thái cực.</p>

<h2>Giai Đoạn 3: Thế Giới Tâm Linh (XV - XXI)</h2>
<p><strong>The Devil (XV)</strong> — Đối mặt trực tiếp với những ràng buộc tự mình đặt ra.</p>
<p><strong>The Tower (XVI)</strong> — Sụp đổ hoàn toàn. Mọi thứ giả tạo phải sụp đổ để cái thật có thể đứng vững.</p>
<p><strong>The Star (XVII)</strong> — Sau sụp đổ, hy vọng và chữa lành. Ánh sáng sau bóng tối.</p>
<p><strong>The Moon (XVIII)</strong> — Đi qua bóng tối của tiềm thức, ảo giác, nỗi sợ hãi sâu nhất.</p>
<p><strong>The Sun (XIX)</strong> — Giác ngộ, vui mừng, ánh sáng. Hiểu rõ bản thân và thế giới.</p>
<p><strong>Judgement (XX)</strong> — Nghe tiếng gọi thiêng liêng, đánh giá lại toàn bộ hành trình, tha thứ và được tha thứ.</p>
<p><strong>The World (XXI)</strong> — Hoàn thành. Tích hợp toàn bộ bài học. Và sẵn sàng... bắt đầu lại với một The Fool mới.</p>

<h2>Tại Sao Điều Này Quan Trọng?</h2>
<p>Khi bạn biết The Fool's Journey, mỗi lá bài không còn là "ý nghĩa riêng lẻ" mà là <strong>một nhân vật trong câu chuyện lớn hơn</strong>. Câu hỏi không chỉ là "lá này nghĩa là gì?" mà là:</p>
<blockquote style="border-left: 3px solid #7c3aed; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #6b7280;">"Tôi đang ở giai đoạn nào trong hành trình của mình? Bài học nào tôi đang trải qua? Và bài học tiếp theo tôi cần chuẩn bị cho là gì?"</blockquote>
<p>Đây là lý do tại sao tarot, khi được dùng đúng cách, là công cụ tự phát triển sâu sắc đến vậy. Không phải vì nó đoán tương lai — mà vì nó kể câu chuyện của bạn bằng ngôn ngữ của vũ trụ.</p>"""
    },
]

def insert_post(post):
    url = f"{SUPABASE_URL}/rest/v1/blog_posts"
    data = json.dumps(post).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        return e.code, body

def check_exists(slug):
    url = f"{SUPABASE_URL}/rest/v1/blog_posts?slug=eq.{slug}&select=id"
    req = urllib.request.Request(url, headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
    })
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return len(data) > 0

print("🌱  Bắt đầu seed 10 bài blog...\n")
ok = 0
skip = 0
fail = 0

for post in posts:
    slug = post["slug"]
    if check_exists(slug):
        print(f"⏭️  Bỏ qua (đã tồn tại): {slug}")
        skip += 1
        continue
    status, err = insert_post(post)
    if status in (200, 201):
        print(f"✅  Đã thêm: {post['title'][:60]}...")
        ok += 1
    else:
        print(f"❌  Lỗi [{status}] {slug}: {err[:120] if err else ''}")
        fail += 1

print(f"\n🎉  Xong! Thêm mới: {ok} | Bỏ qua: {skip} | Lỗi: {fail}")
