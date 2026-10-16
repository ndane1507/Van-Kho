import type {Author} from '@/lib/validation';

type LifeData=Partial<Pick<Author,'birthDate'|'deathDate'|'birthYear'|'deathYear'|'birthplace'|'lifeNote'|'lifeStatus'|'lifeSourceUrl'|'contributors'>>;
const wikidata=(id:string)=>`https://www.wikidata.org/wiki/${id}`;

// Exact dates are used only where the record supports that precision. For historical
// figures with conflicting dates, show the shared year and explain the discrepancy.
export const authorLifeData:Record<string,LifeData>={
 'huy-can':{birthDate:'1919-05-31',deathDate:'2005-02-19',birthplace:'Xã Ân Phú, huyện Hương Sơn, tỉnh Hà Tĩnh',lifeStatus:'documented',lifeSourceUrl:'https://baotangvanhoc.vn/giai-thuong-ho-chi-minh/dot-1/nha-tho-huy-can-1919-2005/'},
 'nguyen-tuan':{birthDate:'1910-07-10',deathDate:'1987-07-28',birthplace:'Phố Hàng Bạc; quê thôn Thượng Đình, làng Mọc, Hà Nội',lifeStatus:'documented',lifeSourceUrl:'https://baotangvanhoc.vn/giai-thuong-ho-chi-minh/dot-1/nha-van-nguyen-tuan-1910-1987/'},
 'nguyen-trai':{birthYear:'1380 (năm sinh thường được ghi)',deathDate:'1442-10-07',birthplace:'Chi Ngại, Chí Linh, Hải Dương (quê gốc)',lifeStatus:'approximate',lifeNote:'Năm sinh được các tài liệu ghi theo quy ước; ông sinh tại Thăng Long và quê gốc ở Chi Ngại.',lifeSourceUrl:wikidata('Q1347181')},
 'luu-quang-vu':{birthDate:'1948-04-17',deathDate:'1988-08-29',birthplace:'Phú Thọ',lifeStatus:'documented',lifeSourceUrl:wikidata('Q6711729')},
 'nguyen-du':{birthYear:'1765/1766',deathYear:'1820',birthplace:'Tiên Điền, Nghi Xuân, Hà Tĩnh',lifeStatus:'approximate',lifeNote:'Năm sinh có dị bản 1765 và 1766; hồ sơ ghi cả hai thay vì chọn một mốc chưa thống nhất.',lifeSourceUrl:wikidata('Q313322')},
 'ho-chi-minh':{birthDate:'1890-05-19',deathDate:'1969-09-02',birthplace:'Làng Kim Liên, huyện Nam Đàn, Nghệ An',lifeStatus:'documented',lifeSourceUrl:'https://vi.wikipedia.org/wiki/H%E1%BB%93_Ch%C3%AD_Minh'},
 'do-phu':{birthYear:'712',deathYear:'770',birthplace:'Củng Nghĩa, Hà Nam, Trung Quốc',lifeStatus:'approximate',lifeNote:'Tư liệu phổ biến xác định năm sinh và mất; ngày tháng cụ thể không được xác lập thống nhất.',lifeSourceUrl:wikidata('Q33772')},
 'han-mac-tu':{birthDate:'1912-09-22',deathDate:'1940-11-11',birthplace:'Lệ Mỹ, Đồng Hới, Quảng Bình',lifeStatus:'documented',lifeSourceUrl:wikidata('Q1315921')},
 'le-dat':{birthDate:'1929-09-10',deathDate:'2008-04-21',birthplace:'Yên Bái',lifeStatus:'documented',lifeSourceUrl:wikidata('Q6711246')},
 'thach-lam':{birthDate:'1910-07-07',deathYear:'1942',birthplace:'Hà Nội; quê gia đình ở Cẩm Giàng, Hải Dương',lifeStatus:'documented',lifeNote:'Một số nguồn ghi ngày mất khác nhau trong tháng 6/1942; hồ sơ chỉ ghi năm để tránh khẳng định quá mức.',lifeSourceUrl:wikidata('Q10826167')},
 'robert-frost':{birthDate:'1874-03-26',deathDate:'1963-01-29',birthplace:'San Francisco, California, Hoa Kỳ',lifeStatus:'documented',lifeSourceUrl:wikidata('Q168728')},
 'kim-lan':{birthYear:'1920',deathDate:'2007-07-20',birthplace:'Làng Phù Lưu, Từ Sơn, Bắc Ninh',lifeStatus:'documented',lifeSourceUrl:wikidata('Q10779923')},
 'nam-cao':{birthDate:'1917-10-29',deathDate:'1951-11-30',birthplace:'Làng Đại Hoàng, Lý Nhân, Hà Nam',lifeStatus:'documented',lifeSourceUrl:wikidata('Q6961060')},
 'to-huu':{birthDate:'1920-10-04',deathDate:'2002-12-09',birthplace:'Làng Phù Lai, Quảng Thọ, Quảng Điền, Thừa Thiên Huế',lifeStatus:'documented',lifeSourceUrl:wikidata('Q7810977')},
 'pushkin':{birthDate:'1799-06-06',deathDate:'1837-02-10',birthplace:'Moskva, Nga',lifeStatus:'documented',lifeNote:'Ngày hiển thị đã quy đổi theo lịch Gregory; lịch Julius ghi 26/5/1799 và 29/1/1837.',lifeSourceUrl:'https://aspushkin.org/ru/biografiya-a.s.-pushkin/'},
 'victor-hugo':{birthDate:'1802-02-26',deathDate:'1885-05-22',birthplace:'Besançon, Pháp',lifeStatus:'documented',lifeSourceUrl:'https://maisonvictorhugo.besancon.fr/en/maison-victor-hugo-2/victor-hugo/'},
 'ngo-thi-nham':{birthDate:'1746-10-25',deathDate:'1803-03-09',birthplace:'Tả Thanh Oai, Thanh Trì, Hà Nội',lifeStatus:'documented',lifeSourceUrl:wikidata('Q1155621')},
 'martin-luther-king':{birthDate:'1929-01-15',deathDate:'1968-04-04',birthplace:'Atlanta, Georgia, Hoa Kỳ',lifeStatus:'documented',lifeSourceUrl:wikidata('Q8027')},
 'hoai-thanh':{birthDate:'1909-07-15',deathDate:'1982-03-14',birthplace:'Nghi Lộc, Nghệ An',lifeStatus:'documented',lifeSourceUrl:wikidata('Q10768859')},
 'cao-ba-quat':{birthYear:'1809',deathYear:'1855',birthplace:'Phú Thị, Gia Lâm, Hà Nội',lifeStatus:'approximate',lifeNote:'Ngày tháng sinh mất không thống nhất trong các tài liệu tiểu sử; chỉ ghi năm.',lifeSourceUrl:wikidata('Q1756323')},
 'xuan-quynh':{birthDate:'1942-10-06',deathDate:'1988-08-29',birthplace:'La Khê, Hà Đông, Hà Nội',lifeStatus:'documented',lifeSourceUrl:'https://vanvn.vn/ban-tieu-su-van-hoc-tu-khai-cua-nha-tho-xuan-quynh/'},
 'shakespeare':{birthYear:'1564',deathYear:'1616',birthplace:'Stratford-upon-Avon, Anh',lifeStatus:'approximate',lifeNote:'Ngày sinh thường được kỷ niệm 23/4; hồ sơ lịch sử xác nhận ngày rửa tội 26/4/1564. Ngày tháng thay đổi khi quy đổi giữa lịch Julius và Gregory.',lifeSourceUrl:wikidata('Q692')},
 'nguyen-huy-tuong':{birthDate:'1912-05-06',deathDate:'1960-07-25',birthplace:'Làng Dục Tú, Đông Anh, Hà Nội',lifeStatus:'documented',lifeSourceUrl:wikidata('Q7023088')},
 'hoang-phu-ngoc-tuong':{birthDate:'1937-09-09',deathDate:'2023-07-24',birthplace:'Huế',lifeStatus:'documented',lifeSourceUrl:wikidata('Q10768999')},
 'svetlana-alexievich':{birthDate:'1948-05-31',birthplace:'Ivano-Frankivsk (nay thuộc Ukraina)',lifeStatus:'living',lifeNote:'Nhà văn còn sống; sinh tại Ukraina thuộc Liên Xô khi đó.',lifeSourceUrl:wikidata('Q274334')},
 'nguyen-cong-tru':{birthDate:'1778-12-19',deathDate:'1858-12-07',birthplace:'Uy Viễn, Nghi Xuân, Hà Tĩnh',lifeStatus:'documented',lifeSourceUrl:wikidata('Q3339357')},
 'nguyen-dinh-chieu':{birthDate:'1822-07-01',deathDate:'1888-07-03',birthplace:'Gia Định',lifeStatus:'documented',lifeSourceUrl:wikidata('Q7022804')},
 'vu-trong-phung':{birthDate:'1912-10-20',deathYear:'1939',birthplace:'Hà Nội',lifeStatus:'documented',lifeNote:'Các nguồn có dị bản về ngày mất; năm mất 1939 được thống nhất hơn ngày cụ thể.',lifeSourceUrl:wikidata('Q1611010')},
 'ma-van-khang':{birthDate:'1936-12-01',birthplace:'Hà Nội',lifeStatus:'living',lifeSourceUrl:wikidata('Q1882227')},
 'dang-dung':{birthYear:'khoảng 1373',deathYear:'khoảng 1414',birthplace:'Hà Tĩnh (quê quán thường được ghi)',lifeStatus:'approximate',lifeNote:'Nhân vật lịch sử trung đại; mốc năm trong các nguồn tiểu sử có thể khác nhau.',lifeSourceUrl:wikidata('Q10841514')},
 'quang-dung':{birthYear:'1921',deathDate:'1988-10-13',birthplace:'Làng Phượng Trì, Đan Phượng, Hà Nội',lifeStatus:'documented',lifeSourceUrl:wikidata('Q10809973')},
 'thanh-thao':{birthDate:'1946-02-16',birthplace:'Mộ Đức, Quảng Ngãi',lifeStatus:'living',lifeSourceUrl:wikidata('Q10824904')},
 'nguyen-dinh-thi':{birthDate:'1924-12-20',deathDate:'2003-04-18',birthplace:'Luang Prabang, Lào',lifeStatus:'documented',lifeSourceUrl:wikidata('Q724117')},
 'doan-thi-diem':{birthYear:'1705',deathYear:'1746/1748',birthplace:'Giai Phạm, Văn Giang, Hưng Yên',lifeStatus:'approximate',lifeNote:'Tài liệu ghi năm mất khác nhau (1746 hoặc 1748); chưa có ngày sinh, ngày mất thống nhất.',lifeSourceUrl:wikidata('Q5354126')},
 'nguyen-huy-thiep':{birthDate:'1950-04-29',deathDate:'2021-03-20',birthplace:'Hà Nội',lifeStatus:'documented',lifeSourceUrl:wikidata('Q1984347')},
 'gogol':{birthDate:'1809-04-01',deathDate:'1852-03-04',birthplace:'Velyki Sorochyntsi, Ukraina',lifeStatus:'documented',lifeNote:'Ngày hiển thị theo lịch Gregory; các tài liệu cũ có thể ghi 20/3/1809 và 21/2/1852 theo lịch Julius.',lifeSourceUrl:wikidata('Q43718')},
 'long-chuong':{birthYear:'1918',deathYear:'2003',birthplace:'Hải Dương',lifeStatus:'approximate',lifeNote:'Nguồn dữ liệu hiện có mới xác nhận năm sinh và mất, chưa đủ căn cứ ghi ngày cụ thể.',lifeSourceUrl:wikidata('Q10788835')},
 'ngo-tat-to':{birthYear:'1893/1894',deathDate:'1954-04-20',birthplace:'Lộc Hà, Từ Sơn, Bắc Ninh',lifeStatus:'approximate',lifeNote:'Năm sinh có dị bản 1893–1894; hồ sơ giữ cả hai mốc.',lifeSourceUrl:wikidata('Q6842874')},
 'dao-duy-anh':{birthDate:'1904-04-25',deathDate:'1988-04-01',birthplace:'Thanh Hóa',lifeStatus:'documented',lifeSourceUrl:wikidata('Q5951559')},
 'xuan-dieu':{birthDate:'1916-02-02',deathDate:'1985-12-18',birthplace:'Gò Bồi, Tuy Phước, Bình Định',lifeStatus:'documented',lifeSourceUrl:wikidata('Q1036300')},
 'hemingway':{birthDate:'1899-07-21',deathDate:'1961-07-02',birthplace:'Oak Park, Illinois, Hoa Kỳ',lifeStatus:'documented',lifeSourceUrl:wikidata('Q23434')},
 'chekhov':{birthDate:'1860-01-29',deathDate:'1904-07-15',birthplace:'Taganrog, Nga',lifeStatus:'documented',lifeNote:'Ngày theo lịch Gregory; lịch Julius ghi 17/1/1860 và 2/7/1904.',lifeSourceUrl:'https://www.prlib.ru/history/618987'},
 'phong-tu-khai':{birthYear:'1898',deathYear:'1975',birthplace:'Đồng Hương, Chiết Giang, Trung Quốc',lifeStatus:'documented',lifeNote:'Nguồn tiểu sử xác nhận năm sinh, năm mất và nơi sinh; ngày tháng cụ thể chưa được đối chiếu.',lifeSourceUrl:'https://www.ezhejiang.gov.cn/2016-08/09/c_55448.htm'},
 'chu-van-son':{lifeStatus:'uncertain',lifeNote:'Hồ sơ hiện có xác định ông là nhà phê bình văn học, nhưng chưa tìm được nguồn tiểu sử đáng tin cậy để xác nhận ngày sinh, năm mất và quê quán. Các trường này được để trống thay vì suy đoán.'},
 'nguyen-du-truyen-ky':{birthYear:'thế kỷ XVI (không rõ năm)',birthplace:'Hải Dương (quê quán thường được ghi)',lifeStatus:'uncertain',lifeNote:'Sử liệu về Nguyễn Dữ không đủ để xác định ngày tháng năm sinh và mất; chỉ có thể đặt tác giả vào khoảng thế kỷ XVI.',lifeSourceUrl:wikidata('Q10799084')},
 'than-nhan-trung':{birthYear:'1418/1419',deathYear:'1499',birthplace:'Yên Ninh, Yên Dũng, Bắc Giang',lifeStatus:'approximate',lifeNote:'Tiểu sử trung đại chỉ xác định được gần đúng năm sinh.',lifeSourceUrl:wikidata('Q10825869')},
 'tran-tuan':{birthYear:'1967',birthplace:'Hà Nội',lifeStatus:'approximate',lifeNote:'Nguồn hiện có ghi năm sinh; chưa tìm thấy nguồn tiểu sử đủ tin cậy để xác nhận ngày sinh hoặc quê quán.',lifeSourceUrl:wikidata('Q141599504')},
 'hai-cu-nhat-ban':{lifeStatus:'documented',birthplace:'Nhật Bản (hồ sơ chung)',lifeNote:'Đây là hồ sơ chung cho ba thi nhân có thơ trong cùng bài đọc; thông tin của từng người được tách riêng bên dưới.',contributors:[
  {name:'Matsuo Bashō',life:'1644–1694',birthplace:'Iga, Nhật Bản',bio:'Thi nhân haikai, thường tổ chức cảm xúc bằng cảnh vật vắng và quan sát tinh tế.',sourceUrl:'https://www.basho-ogaki.jp/hosomiti/about/'},
  {name:'Fukuda Chiyo-ni',life:'1703–1775',birthplace:'Matsutō (nay là Hakusan), Ishikawa, Nhật Bản',bio:'Nữ thi nhân haiku thời Edo; thơ thường hướng tới sự sống, cây cỏ và cái nhìn nhẹ nhàng.',sourceUrl:'https://www.hakusan-museum.jp/chiyojohaiku/about/'},
  {name:'Kobayashi Issa',life:'1763–1828',birthplace:'Kashiwabara, Shinano (nay là Nagano), Nhật Bản',bio:'Thi nhân haiku nổi bật với giọng thơ gần gũi và lòng trắc ẩn dành cho những sinh vật nhỏ.',sourceUrl:'https://www.kobayashi-issa.jp/en/' }
 ]},
 'dan-gian':{lifeStatus:'collective',lifeNote:'Không phải một cá nhân. Tác phẩm dân gian được sáng tác, truyền miệng và biến đổi qua nhiều thế hệ; ngày sinh, ngày mất và quê quán cá nhân không áp dụng.'},
 'ho-me-ro':{lifeStatus:'uncertain',lifeNote:'Tiểu sử và niên đại của Hô-me-rơ chưa được xác lập; không có ngày sinh, ngày mất hay quê quán chắc chắn. Các giai đoạn thường nêu chỉ là giả thuyết nghiên cứu.',lifeSourceUrl:'https://www.britannica.com/biography/Homer-Greek-poet'}
};
