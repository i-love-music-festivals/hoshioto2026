/**
 * ==========================================
 * 【設定・データエリア】
 * JS（データ側） = ここではデータを定義するだけで、画面の描画は行いません。
 * 今後、別のフェスに流用する場合は、ここだけ書き換えてください。
 * ==========================================
 */

// --- 1. アプリケーション全体の設定 ---
const APP_CONFIG = {
    festivalName: "hoshioto'26<br>非公式アプリ",
    officialUrl: "https://hoshioto.net/",
    storagePrefix: "hoshioto_2026_", 
    startHour: 9, 
    endHour: 33,  // 深夜32:00（翌朝8:00）までカバーするため 
    days: [
        { id: 'day1', label: '5/23 (土)' }
    ],
    mapImages: [
        "https://i-love-music-festivals.github.io/hoshioto2026/map.jpg",
        "https://i-love-music-festivals.github.io/hoshioto2026/bustimetable.jpg"
    ],
    weather: {
        areaName: "岡山県井原市青野町周辺の天気",
        iframeUrl: "https://weathernews.jp/onebox/34.626872/133.470407/q=岡山県井原市青野町",
        linkUrl: "https://weathernews.jp/onebox/34.626872/133.470407/q=岡山県井原市青野町"
    },
    source: {
        text: "出典：hoshioto",
        url: "https://hoshioto.net/"
    },
    settings: {
        priorityStageOrder: true
    },
    ui: {
        officialLinkText: "<span class='small-text'>公式</span>HP",
        disclaimer: "※各アーティストのジャンルはAIによる判定です。<br>※最新情報は公式HPで確認してください。",
        searchPlaceholder: "出演アーティストを検索（前方一致）...",
        searchEmptyMsg: "見つかりませんでした。",
        searchModalTitlePrefix: "「", 
        searchModalTitleSuffix: "」の出演情報",
        searchModalClose: "×",       
        tabFood: "フード",
        tabMap: "マップ",
        tabWeather: "天気",
        tabMemo: "メモ",
        mapZoomIn: "＋",             
        mapZoomOut: "－",            
        mapZoomReset: "Reset",       
        foodHeader: "フードエリア一覧",
        foodFavListTitle: "★ 食べたいものリスト",
        foodEmptyMsg: "右上にある星マーク(★)を押すと、ここに追加されます。<br>カードはメニュー部分をドラッグして並べ替え可能です。",
        weatherOfflineMsg: "<p>現在オフラインです。<br>天気情報を取得するにはインターネットの接続が必要です。</p>",
        weatherNotice: "※サイト側のセキュリティ制限等でうまく表示されない場合は、<br><a href='{WEATHER_URL}' target='_blank' rel='noopener noreferrer' id='weatherLinkText'>こちらからウェザーニュースを開いて</a>ご確認ください。",
        memoHeader: "メモ",
        memoNotice: "※注意点※<br>・ブラウザのキャッシュ（履歴データ）クリアを行うと、マイタイムテーブル等を含めてメモの内容も消えてしまいます。<br>・他のデバイス（スマホからPCなど）への共有はできません。",
        memoPlaceholder: "ライブの感想やメモを自由に書き込めます。\n入力すると自動保存されます。"
    }
};

// --- 2. ステージ情報定義 ---
const stagesInfo = [
    { id: 'moon', name: 'MOON GARDEN', color: '#D4AC0D' },
    { id: 'center', name: 'センター・オブ・ジ・イバラ', color: '#E74C3C' },
    { id: 'forest', name: 'FOREST PARK', color: '#27AE60' },
    { id: 'busker', name: 'BUSKER AREA', color: '#8E44AD' },
    { id: 'sky', name: 'SKY FIELD', color: '#2980B9' },
    { id: 'budou', name: '葡萄浪漫館 YOU SEE A-GO GO', color: '#8E44AD' },
    { id: 'rest', name: '休憩処', color: '#5D6D7E' }
];

// --- 3. データ作成用ヘルパー関数 ---
// タイムテーブルのデータを短く書くための関数（e = event）
const e = (name, start, end, genre = "", options = {}) => ({ name, start, end, genre, ...options });

function getFavId(dayKey, stageId, artistName) {
    const cleanName = artistName.replace(/<[^>]*>/g, '').replace(/[^a-zA-Z0-9ぁ-んァ-ヶー一-龠]/g, '');
    return `${dayKey}_${stageId}_${cleanName}`;
}

// ==========================================
// --- 4. フードデータ一覧 ---
const foodList = [
    {
        name: "hoshiotoオフィシャルショップ",
        menu: [
            { name: "①hoshiotoオフィシャルショップ", menus: ["グッズ販売"], message: `hoshioto’26オフィシャルグッズを今年も販売します！過去のグッズも少し置いておりますので是非チェックを！<br>大人気のガチャガチャもここで出来ます！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/official1.jpg" },
            { name: "②星音焙煎研究所", menus: ["オリジナル珈琲"], message: `hoshiotoのオフィシャルショップの珈琲屋。<br>hoshiotoイベントでしか飲めない珈琲と今年はチョコレートも販売予定！<br>珈琲は各方面で絶賛されています。<br>豆の販売もありますのでお土産にどうぞ！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/official2.jpg" },
            { name: "③斎藤酒店", menus: ["アルコール", "ソフトドリンク"], message: `hoshiotoオフィシャルドリンク店！<br>ソフトドリンク多種あります！<br>入り口付近にあり、ステージにも近いので利用しやすいお店です。<br>※泥酔者には販売できませんのであしからず<br>節度持って飲みましょう！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/official3.jpg" },
            { name: "④ワイン・クラフトビール販売", menus: ["ワイン", "クラフトビール"], message: "岡山県井原市美星町でニュージーランド産のオーガニックワインとクラフトビールを専門的に販売しています！", img: "https://i-love-music-festivals.github.io/hoshioto2026/official4.jpg" },
            { name: "⑤近藤康平＆monaワークショップ", menus: ["アロマワークショップ"], message: `アロマワークショップ 厳選されたオーガニック精油の中から好きな香りを選んで自分だけの特別な香りを製作するワークショップです。<br>さらに完成したフレグランスボトルには近藤康平がひとつひとつペイントするスペシャルバージョンです！<br>アロマワークショップは、香りのブレンディングのコツをお伝えするので初めてでももちろん大丈夫です。`, img: "https://i-love-music-festivals.github.io/hoshioto2026/official5.jpg" }
        ]
    },
    {
        name: "飲食店",
        menu: [
            { name: "①葡萄浪漫館 食堂", menus: ["各種定食", "ソフトクリーム"], message: `会場の葡萄浪漫館の店内にある食堂。お手頃価格の定食やうどん・そば、そしてソフトクリームもあります！<br>​名物葡萄ソフトクリームはかなりオススメです！！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/hood1.jpg" },
            { name: "②秀よし屋", menus: ["焼き鳥"], message: `1回目から出店しているご存知「ふ〜ちゃん焼き」の秀よし屋。<br>新鮮な親鶏を使い　にんにく塩風味に味付けした噛めば噛むほど肉の濃い旨みが味わえる他にない焼き鳥　ふ～ちゃん焼。この味、やみつきになります！！<br>hoshiotoに来たらぜひ食べてみてください！<br>売り切れる可能性高いのでお早めに！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/hood2.jpg" },
            { name: "③御食事処 星の郷", menus: ["美星バーガー"], message: `1回目から出店しているもはやhoshioto名物となっている地元井原市美星町の「美星バーガー」<br>地元食材をふんだんに使っているバーガーです！<br>​コレを食べないとhoshiotoに行った気がしないとまで言われてます！今年も是非！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/hood3.jpg" },
            { name: "④2ndLife Dining Place", menus: ["ダイニングバー"], message: `燻製したルーにトッピングの燻製を乗せており、他には無い味わいになっています！<br>シェフの作る本気イベント飯です！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/hood4.jpg" },
            { name: "⑤36’s crepe", menus: ["クレープ"], message: `もちもち生地にたっぷりクリーム！20種類以上の多彩なクレープをお楽しみください。<br>毎年「大人限定！ラムレーズンチョコ生クリーム」が人気です。`, img: "https://i-love-music-festivals.github.io/hoshioto2026/hood5.jpg" },
            { name: "⑥E.mate", menus: ["タコス"], message: "福山市ひさまつ通りでダイニングバーをしています。タコスでイベント出店していて好評をいただいております！", img: "https://i-love-music-festivals.github.io/hoshioto2026/hood6.jpg" },
            { name: "⑦PASION", menus: ["タコス", "そばめし"], message: `美味しい手作りタコスとそばめし！<br>1回目からの皆勤出店！<br>目の前にて”焼きたて熱々”をお作りいたします。<br>焼きたて作り立てにこだわった料理をお楽しみください！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/hood7.jpg" },
            { name: "⑧M's store", menus: ["からあげ", "かき氷"], message: "香川県小豆島キッチンカーM’s storeです。小豆島のオリーブ香草塩は、風味良くとても美味しいからあげとなっております！", img: "https://i-love-music-festivals.github.io/hoshioto2026/hood8.jpg" },
            { name: "⑨台湾飯", menus: ["台湾料理"], message: "台湾調味料を使用し台湾人から教わった料理を日本人向けに食べやすく少しアレンジ。子供から大人まで楽しめる中四国初の本格台湾料理キッチンカー。", img: "https://i-love-music-festivals.github.io/hoshioto2026/hood9.jpg" },
            { name: "⑩Halea～ハレア～", menus: ["バーガー", "スイーツ", "ドリンク"], message: `味・見た目ともに◎の”スライダーガーバー”が流行りのアサイーボウル等をメインにお子様が喜ぶくまボトルタピオカドリンクも！<br>”映え”と”流行”を意識した商品をお届けします！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/hood10.jpg" },
            { name: "⑪酒場食堂BEN", menus: ["まぜそば"], message: "大阪南船場に2006年オープン。大阪からはるばる毎年出店させて頂いてます酒場食堂BENです。", img: "https://i-love-music-festivals.github.io/hoshioto2026/hood11.jpg" },
            { name: "⑫無農薬玄米カレーコブカフェ", menus: ["無農薬玄米カレー"], message: `コブカフェでは、秋田県産の無農薬玄米を使用し、保存料や着色料を使わず、小麦粉は不使用でアレルギーの方でも安心。薬膳コーディネイターとスパイス香辛料アドバイザーの資格を持つ店主が独自にブレンドしたスパイスカレーはお子様でも安心。`, img: "https://i-love-music-festivals.github.io/hoshioto2026/hood12.jpg" },
            { name: "⑬craft kitchen", menus: ["ホルモンうどん"], message: "焼きたて、揚げたてのアツアツをご提供します。ぜひご賞味ください！", img: "https://i-love-music-festivals.github.io/hoshioto2026/hood13.jpg" },
            { name: "⑭明洞焼肉食堂", menus: ["韓国屋台飯"], message: `大阪コリアタウンにも卸している肉屋から仕入れた肉で作る韓国焼肉のサムギョプサルとビビンバのお店です。<br>ごきげんな音楽と満天の星空のお供にビビンバを是非！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/hood15.jpg" },
            { name: "⑮岡本商店", menus: ["イカ焼き"], message: "イカ焼き、タン串、フランクフルトなど、鉄板焼きをメインに販売させていただきます。是非たべてみてください！", img: "https://i-love-music-festivals.github.io/hoshioto2026/hood16.jpg" },
            { name: "⑯岡山足守 芋屋蜜三郎", menus: ["焼き芋"], message: `岡山・足守の歴史ある町並みに佇む「芋屋蜜三郎」当店は、素材の力を信じる焼き芋及び焼き芋スイーツ専門店です。「第2回全国焼き芋選手権」にて、【入賞】果たしたお芋の魅力を最大限に引き出す熟成・焼きの技術。全国が認めた至極の「幻の焼き芋」を使ったスイーツやトルティーヤをぜひご堪能ください。`, img: "https://i-love-music-festivals.github.io/hoshioto2026/hood17.jpg" }
        ]
    },
    {
        name: "雑貨店・ワークショップ",
        menu: [
            { name: "①Thirtyz Kendama Crew", menus: ["けん玉のワークショップ"], message: `広島県福山市を中心として活動しているけん玉パフォーマンスチームです。<br>今や外遊びのホビーとして、また最強のコミュニケーションのツールとしても最高のKENDAMA! 歳の差、性別、国籍関係なく遊べるけん玉は最高のコミュニケーションツールのひとつになる事間違いなし！<br>この機会に初心者の技から世界レベルの技までを見て触れて楽しんでください。`, img: "https://i-love-music-festivals.github.io/hoshioto2026/workshop1.jpg" },
            { name: "②itsumokotsumo", menus: ["雑貨屋"], message: "いつもこつもは岡山弁でいつも、いつでもを意味します。いつもこつも新しい発見を探して井原市美星町にて星空をイメージしたアクセサリーや、「田舎暮らしがちょっと楽しくなる」をコンセプトに農機具をメインにした一部の人に刺さるデザインでオリジナルTシャツや雑貨を制作しています。", img: "https://i-love-music-festivals.github.io/hoshioto2026/workshop2.jpg" },
            { name: "③Lauleʼa", menus: ["ハンドメイドアクセサリー"], message: "Lauleʼaは、ハワイ語で「幸せ」を意味するハンドメイドアクセサリーブランド。天然石・パール・ビーズを使った上品な大人向けアクセサリーで、月のような透明感と癒しが魅力です。当日はワークショップで実際に作って楽しめ、自分用・ギフト・思い出作りにぴったりです！", img: "https://i-love-music-festivals.github.io/hoshioto2026/workshop3.jpg" },
            { name: "④時空研究所", menus: ["ワークショップ"], message: `日々、気になったものを研究して調べたり作ったりしています。<br>hoshioto,26おもいっきり楽しみたいです。<br>どうぞよろしくお願いします。`, img: "https://i-love-music-festivals.github.io/hoshioto2026/workshop4.jpg" },
            { name: "⑤きせつのおはなし", menus: ["雑貨屋"], message: `きせつをテーマにしたネイルチップや小物を販売しています。<br>今回はhoshiotoなので、星をテーマにした作品を販売します。`, img: "https://i-love-music-festivals.github.io/hoshioto2026/workshop5.jpg" },
            { name: "⑥ぼくらのスマイルキッズプロジェクト", menus: ["子供のワークショップ"], message: "今回は塗手形アートうちわのワークショップをおこないます！歌のステージも3回あるので、是非そちらも見に来てくださいね。", img: "https://i-love-music-festivals.github.io/hoshioto2026/workshop6.jpg" },
            { name: "⑦イメージ似顔絵缶バッチ！手のひら文庫社", menus: ["イメージ似顔絵缶バッチ"], message: `3分の間に即興で似顔絵を描いて缶バッチに仕上げます。<br>ペットなどのお写真からでもOK！<br>出来た似顔絵を直ぐに帽子などに付けることができます！<br>オリジナルバッチでフェス気分を盛り上げてくれます！`, img: "https://i-love-music-festivals.github.io/hoshioto2026/workshop7.jpg" },
            { name: "⑧さくらギター", menus: ["ワークショップ"], message: `楽器は非常に繊細なものであり、気温や湿度によって状態が変わってきます。いつでも弾きたい時に弾ける状態を保つには定期的なメンテナンスが必要です。<br>さくらギターではご自分のお持ちの楽器をお持ち頂き、弾きやすくなるメンテナンスをさせて頂きます。<br>ぜひ体験してほしいです。`, img: "https://i-love-music-festivals.github.io/hoshioto2026/workshop8.jpg" }
        ]
    }
];

// --- 5. タイムテーブル・出演アーティストデータ ---
// e("アーティスト名", "開始", "終了", "ジャンル", { オプション }) 
// オプション例: { hideEndTime: true } で終了時間を隠す
const timetableData = {
    day1: {
        date: "2026-05-23",
        moon: [
            e("DawnLuLu（オーディション特別賞）", "10:00", "10:30", "Pop"),
            e("真舟とわ", "11:10", "12:00", "Acoustic"),
            e("さとう。", "12:40", "13:30", "Pop"),
            e("もっさ（ネクライトーキー）", "14:10", "15:00", "Acoustic/Pop"),
            e("荒谷翔大", "15:40", "16:30", "Pop"),
            e("天々高々", "17:10", "18:05", "Rock"),
            e("日食なつこ", "18:45", "19:40", "Piano/Pop")
        ],
        center: [
            e("ぼくらのスマイルキッズプロジェクト", "10:30", "11:00", "Family"),
            e("土屋雄太", "12:00", "12:40", "Acoustic"),
            e("猪原純", "13:30", "14:10", "Acoustic"),
            e("大平伸正", "15:00", "15:40", "Acoustic"),
            e("mekakushe", "16:30", "17:10", "Pop"),
            e("ゆうさり（独奏）", "18:05", "18:45", "Acoustic"),
            e("タカハシコウキ（peridots）", "19:40", "20:20", "Rock/Acoustic")
        ],
        forest: [
            e("the paddles", "10:30", "11:20", "Rock"),
            e("ハク。", "11:55", "12:45", "Pop"),
            e("bacho", "13:20", "14:10", "Rock"),
            e("グソクムズ", "14:45", "15:35", "Pop/Rock"),
            e("石崎ひゅーい", "16:10", "17:05", "Pop"),
            e("sleepy.ab× 近藤康平(ライブペインティング) × mona(調香師)", "17:45", "18:40", "Alternative"),
            e("TOMOVSKY", "19:20", "20:15", "Rock")
        ],
        busker: [
            e("●ぼくらのスマイルキッズプロジェクト<br><br>●大道芸人S4<br><br>●伝承パフォーマー ぢゃぁ（けん玉）<br><br>※パフォーマンス時間は当日の状況によります。", "11:00", "20:00", "Performance", { hideEndTime: true, isLightBg: true })
        ],
        sky: [
            e("大舌勲（井原市長）開催宣言", "09:30", "09:40", "", { isLightBg: true, hideTime: true }),
            e("ターコイズ（オーディショングランプリ）", "09:40", "10:10", "Rock"),
            e("SCOOBIE DO", "10:50", "11:40", "Funk/Rock"),
            e("BRADIO", "12:20", "13:10", "Funk/Rock"),
            e("鶴", "13:50", "14:40", "Rock"),
            e("TENDOUJI", "15:20", "16:10", "Indie Rock"),
            e("四星球", "16:50", "17:40", "Comic Rock"),
            e("ドミコ", "18:20", "19:15", "Garage Rock"),
            e("Homecomings", "19:55", "20:50", "Indie Pop"),
            e("星空メッセンジャー ササキユウタ presents 天体観測会", "21:30", "22:30", "Event", { hideEndTime: true }),
            e("藤井裕士によるラジオ体操", "32:00", "32:10", "", { isLightBg: true, hideTime: true })
        ],
        budou: [
            e("メリケンサック（LOCAL LIVEHOUSE act）", "10:00", "10:30", "Rock"),
            e("きのこ島（LOCAL LIVEHOUSE act）", "11:00", "11:30", "Rock"),
            e("laetrile（LOCAL LIVEHOUSE act）", "12:00", "12:30", "Rock"),
            e("上川周平とじゃがいもフィルハーモニー（LOCAL LIVEHOUSE act）", "13:00", "13:30", "Acoustic"),
            e("sakisakihungry（LOCAL LIVEHOUSE act）", "14:00", "14:30", "Rock"),
            e("o_all", "15:00", "15:40", "Rock"),
            e("クリトリック・リス", "16:00", "16:50", "Electronic"),
            e("鈴木実貴子ズ", "17:20", "18:15", "Acoustic"),
            e("New Sprint（オーディション特別賞）", "18:35", "19:05", "Rock"),
            e("おとなりアイニー（オーディション特別賞）", "19:35", "20:05", "Rock")
        ],
        rest: [
            e("ビア怪談1<br><span class='guest-item'>●恐怖新聞健太郎<br>●ノンストップくそ＆シガー<br>●テルシ</span>", "12:30", "13:00", ""),
            e("ビア怪談2<br><span class='guest-item'>●恐怖新聞健太郎<br>●ノンストップくそ＆シガー<br>●テルシ</span>", "13:30", "14:00", ""),
            e("hoshioto TALK SESSION（永井純一 × 藤井裕士）", "14:30", "15:00", ""),
            e("ビア怪談3<br><span class='guest-item'>●恐怖新聞健太郎<br>●ノンストップくそ＆シガー<br>●テルシ</span>", "16:50", "17:20", ""),
            e("ビア怪談4<br><span class='guest-item'>●恐怖新聞健太郎<br>●ノンストップくそ＆シガー<br>●テルシ</span>", "18:05", "18:35", ""),
            e("hoshioto TALK SESSION / ササキユウタ（星空メッセンジャー）", "19:05", "19:35", "")
        ]
    }
};

// --- 検索用：読み仮名辞書 ---
const artistYomiDict = {
    "DawnLuLu（オーディション特別賞）": "どーんるる",
    "真舟とわ": "まふねとわ",
    "さとう。": "さとう",
    "もっさ（ネクライトーキー）": "もっさ",
    "荒谷翔大": "あらたにしょうた",
    "天々高々": "てんてんたかたか",
    "日食なつこ": "にっしょくなつこ",
    "ぼくらのスマイルキッズプロジェクト": "ぼくらのすまいるきっずぷろじぇくと",
    "土屋雄太": "ひじやゆうた",
    "猪原純": "いのはらじゅん",
    "大平伸正": "おおひらのぶまさ",
    "mekakushe": "めかくしー",
    "ゆうさり（独奏）": "ゆうさり",
    "タカハシコウキ（peridots）": "たかはしこうき",
    "the paddles": "ざぱどるず",
    "ハク。": "はく",
    "bacho": "ばちょう",
    "グソクムズ": "ぐそくむず",
    "石崎ひゅーい": "いしざきひゅーい",
    "sleepy.ab× 近藤康平(ライブペインティング) × mona(調香師)": "すりーぴー",
    "TOMOVSKY": "ともふすきー",
    "大舌勲（井原市長）開催宣言": "おおしたいさお",
    "ターコイズ（オーディショングランプリ）": "たーこいず",
    "SCOOBIE DO": "すくーびーどぅー",
    "BRADIO": "ぶらでぃお",
    "鶴": "つる",
    "TENDOUJI": "てんどうじ",
    "四星球": "すーしんちゅう",
    "ドミコ": "どみこ",
    "Homecomings": "ほーむかみんぐす",
    "星空メッセンジャー ササキユウタ presents 天体観測会": "ほしぞらめっせんじゃー",
    "藤井裕士によるラジオ体操": "ふじいゆうし",
    "メリケンサック（LOCAL LIVEHOUSE act）": "めりけんさっく",
    "きのこ島（LOCAL LIVEHOUSE act）": "きのこじま",
    "laetrile（LOCAL LIVEHOUSE act）": "れーとりる",
    "上川周平とじゃがいもフィルハーモニー（LOCAL LIVEHOUSE act）": "かみかわしゅうへい",
    "sakisakihungry（LOCAL LIVEHOUSE act）": "さきさきはんぐりー",
    "o_all": "おーる",
    "クリトリック・リス": "くりとりっくりす",
    "鈴木実貴子ズ": "すずきみきこず",
    "New Sprint（オーディション特別賞）": "にゅーすぷりんと",
    "おとなりアイニー（オーディション特別賞）": "おとなりあいにー",
    "hoshioto TALK SESSION（永井純一 × 藤井裕士）": "ほしおととーくせっしょん",
    "hoshioto TALK SESSION / ササキユウタ（星空メッセンジャー）": "ほしおととーくせっしょん"
};

// --- 公式HPリンク辞書 ---
const artistLinkDict = {
    "DawnLuLu（オーディション特別賞）": "https://dawnlulu.fanpla.jp/",
    "真舟とわ": "https://lit.link/mafunetowa",
    "さとう。": "https://sato-darari.jp/",
    "もっさ（ネクライトーキー）": "https://necrytalkie.jp/",
    "荒谷翔大": "https://aratanishota.com/",
    "天々高々": "https://lit.link/tententakataka",
    "日食なつこ": "https://nisshoku-natsuko.com/",
    "ぼくらのスマイルキッズプロジェクト": "https://www.skp2015.com/",
    "土屋雄太": "https://hijilab.com/",
    "猪原純": "https://www.inohara-jun-web.com/",
    "大平伸正": "https://ohiranobumasa.com/",
    "mekakushe": "https://www.mekakushe.com/",
    "ゆうさり（独奏）": "https://linktr.ee/yuusarimusic",
    "タカハシコウキ（peridots）": "https://peridotsonline.bitfan.id/",
    "the paddles": "https://thepaddles.themedia.jp/",
    "ハク。": "https://hakumaru.com/",
    "bacho": "https://bacho.jp/",
    "グソクムズ": "https://www.gusokumuzu.com/",
    "石崎ひゅーい": "https://www.ishizakihuwie.com/",
    "sleepy.ab× 近藤康平(ライブペインティング) × mona(調香師)": "https://sleepyab.info/", 
    "TOMOVSKY": "http://www.tomovsky.com/",
    "大舌勲（井原市長）開催宣言": "",
    "ターコイズ（オーディショングランプリ）": "https://lit.link/bR3u5vaolkQjClQEZfpP8bUEiy63",
    "SCOOBIE DO": "https://scoobie-do.com/",
    "BRADIO": "https://bradio.jp/",
    "鶴": "https://afrock.jp/",
    "TENDOUJI": "https://tendoujifc.com/",
    "四星球": "http://su-xing-cyu.com/",
    "ドミコ": "https://www.domico-music.com/",
    "Homecomings": "https://homecomings.jp/",
    "星空メッセンジャー ササキユウタ presents 天体観測会": "",
    "藤井裕士によるラジオ体操": "",
    "メリケンサック（LOCAL LIVEHOUSE act）": "",
    "きのこ島（LOCAL LIVEHOUSE act）": "",
    "laetrile（LOCAL LIVEHOUSE act）": "",
    "上川周平とじゃがいもフィルハーモニー（LOCAL LIVEHOUSE act）": "",
    "sakisakihungry（LOCAL LIVEHOUSE act）": "https://linkco.re/SUuugbAg",
    "o_all": "",
    "クリトリック・リス": "http://clitoricris.jp/",
    "鈴木実貴子ズ": "https://mikikotomikikotomikiko.jimdofree.com/",
    "New Sprint（オーディション特別賞）": "https://newsprint.ryzm.jp/",
    "おとなりアイニー（オーディション特別賞）": "https://fanlink.tv/otonari-ainy",
    "hoshioto TALK SESSION（永井純一 × 藤井裕士）": "",
    "hoshioto TALK SESSION / ササキユウタ（星空メッセンジャー）": ""
};

// --- Spotifyリンク辞書 ---
const artistSpotifyDict = {
    "DawnLuLu（オーディション特別賞）": "https://open.spotify.com/embed/artist/6pu1Xc7nbInln7ZNig7Plw?utm_source=generator&theme=0",
    "真舟とわ": "https://open.spotify.com/embed/artist/0NbUuPAkS2Dv0SK7857Cl4?utm_source=generator&theme=0",
    "さとう。": "https://open.spotify.com/embed/artist/42olGDHZaEPtRmxwEZPY31?utm_source=generator&theme=0",
    "もっさ（ネクライトーキー）": "https://open.spotify.com/embed/artist/45ew0KWgCA7evVgCydrZws?utm_source=generator&theme=0",
    "荒谷翔大": "https://open.spotify.com/embed/artist/3H8pmg8yKsqyghjN9h1As2?utm_source=generator&theme=0",
    "天々高々": "https://open.spotify.com/embed/artist/3ejKKPUtIqLJnepED0qdsv?utm_source=generator&theme=0",
    "日食なつこ": "https://open.spotify.com/embed/artist/4GnFg9D7Ds99UI0r5t9PZK?utm_source=generator&theme=0",
    "土屋雄太": "",
    "猪原純": "https://open.spotify.com/embed/artist/6kJeK3cEVY7x6iJdKZFTa7?utm_source=generator&theme=0",
    "大平伸正": "https://open.spotify.com/embed/artist/7ajjjWSDtZ8zW7y7UNKrGa?utm_source=generator&theme=0",
    "mekakushe": "https://open.spotify.com/embed/artist/0CWyD7hgBLQ7dIUGEDkAWz?utm_source=generator&theme=0",
    "ゆうさり（独奏）": "https://open.spotify.com/embed/artist/5maAP01A7kSizjklOLYNa8?utm_source=generator&theme=0",
    "タカハシコウキ（peridots）": "https://open.spotify.com/embed/artist/34RWJpOtNFOV2uePdGUvat?utm_source=generator&theme=0",
    "the paddles": "https://open.spotify.com/embed/artist/49QNPOMtx2yZmOxXGqJ1MO?utm_source=generator&theme=0",
    "ハク。": "https://open.spotify.com/embed/artist/5qJEtz7aC2nwA9LsjfkGVM?utm_source=generator&theme=0",
    "bacho": "https://open.spotify.com/embed/artist/1c9fnFUQTYFLSVc1AYvSXu?utm_source=generator&theme=0",
    "グソクムズ": "https://open.spotify.com/embed/artist/2pApTGoH8Np1rgRBPu4WJk?utm_source=generator&theme=0",
    "石崎ひゅーい": "https://open.spotify.com/embed/artist/4NZJF1Qong0IAWBRE2EjTr?utm_source=generator&theme=0",
    "sleepy.ab× 近藤康平(ライブペインティング) × mona(調香師)": "https://open.spotify.com/embed/artist/6K5m40eGoEYPBOg7hSLjwy?utm_source=generator&theme=0",
    "TOMOVSKY": "https://open.spotify.com/embed/artist/7Etxqxb78W7KK7kQmJHUU8?utm_source=generator&theme=0",
    "ターコイズ（オーディショングランプリ）": "https://open.spotify.com/embed/artist/53DqiGWA6vyRx9pNAw4zme?utm_source=generator&theme=0",
    "SCOOBIE DO": "https://open.spotify.com/embed/artist/5W6Mi5J8L2fUefI1Krcacu?utm_source=generator&theme=0",
    "BRADIO": "https://open.spotify.com/embed/artist/4bykb0rz2eT2t2kzihCsne?utm_source=generator&theme=0",
    "鶴": "https://open.spotify.com/embed/artist/2xIDcsETrIHk7z47yash8a?utm_source=generator&theme=0",
    "TENDOUJI": "https://open.spotify.com/embed/artist/7kOS7xo3ryc1MmhfP0fNnX?utm_source=generator&theme=0",
    "四星球": "https://open.spotify.com/embed/artist/2SU7W9Mkvei3bZkF3XuOjP?utm_source=generator&theme=0",
    "ドミコ": "https://open.spotify.com/embed/artist/0CQuAKiUYqH0OK020E3miJ?utm_source=generator&theme=0",
    "Homecomings": "https://open.spotify.com/embed/artist/3iyF2P8al32bYI6e3YF56K?utm_source=generator&theme=0",
    "メリケンサック（LOCAL LIVEHOUSE act）": "",
    "きのこ島（LOCAL LIVEHOUSE act）": "",
    "laetrile（LOCAL LIVEHOUSE act）": "https://open.spotify.com/embed/artist/0Cy8Uj5CG6JVpMWIBg0gJR?utm_source=generator&theme=0",
    "上川周平とじゃがいもフィルハーモニー（LOCAL LIVEHOUSE act）": "https://open.spotify.com/embed/artist/4zj6a0jR4BLpdIbMauiS6l?utm_source=generator&theme=0",
    "sakisakihungry（LOCAL LIVEHOUSE act）": "https://open.spotify.com/embed/artist/5mFVPhVnIpIiKYbbpH69kP?utm_source=generator&theme=0",
    "o_all": "https://open.spotify.com/embed/artist/2feMmIO3uan7F9DEUOI0aZ?utm_source=generator&theme=0",
    "クリトリック・リス": "https://open.spotify.com/embed/artist/3GK8f8cFEFGQEJUKWc7bLn?utm_source=generator&theme=0",
    "鈴木実貴子ズ": "https://open.spotify.com/embed/artist/68EAsONs8fA8C8e3I4qcV0?utm_source=generator&theme=0",
    "New Sprint（オーディション特別賞）": "https://open.spotify.com/embed/artist/5hd5BWJtSZZVnIUYdB7Ztq?utm_source=generator&theme=0",
    "おとなりアイニー（オーディション特別賞）": "https://open.spotify.com/embed/artist/3i4rPyjKFYK7Xg3ksYOW3s?utm_source=generator&theme=0"
};

/**
 * ==========================================
 * 【システム・ロジックエリア】
 * JS（ロジック側） = データに従って画面を作るだけの処理群です
 * ==========================================
 */

// 検索用：カタカナや濁点などの表記ゆれを吸収する関数
function normalizeForSearch(str) {
    if (!str) return "";
    let normalized = str.replace(/[\u30a1-\u30f6]/g, function(match) {
        return String.fromCharCode(match.charCodeAt(0) - 0x60);
    });
    normalized = normalized.toLowerCase();
    normalized = normalized.normalize("NFD").replace(/[\u3099\u309A]/g, "").normalize("NFC");
    return normalized;
}

let currentDay = 1;
let mapScale = 1.0;
let fullArtistData = [];

// ブラウザに保存するデータのキー（名前）
const FAV_KEY = APP_CONFIG.storagePrefix + 'favs';
const FOOD_FAV_KEY = APP_CONFIG.storagePrefix + 'food_favs';
const LAST_TAB_KEY = APP_CONFIG.storagePrefix + 'last_tab';
const MEMO_KEY = APP_CONFIG.storagePrefix + 'memo';

// 保存されているデータを読み込む
let favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || {};
let foodFavoritesOrder = JSON.parse(localStorage.getItem(FOOD_FAV_KEY)) || [];

const saveFavorites = () => localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
const saveFoodFavorites = () => localStorage.setItem(FOOD_FAV_KEY, JSON.stringify(foodFavoritesOrder));

// 現在時刻が設定された開始時間から何分経過しているか計算
function getCurrentMinsForDay(dayKey) {
    const now = new Date();
    const dataDate = new Date(timetableData[dayKey].date);
    const isToday = now.toDateString() === dataDate.toDateString();
    
    const targetNextDay = new Date(dataDate);
    targetNextDay.setDate(targetNextDay.getDate() + 1); 
    const isNextDayEarly = now.getHours() < APP_CONFIG.startHour && now.toDateString() === targetNextDay.toDateString();

    if (isToday || isNextDayEarly) {
        return (now.getHours() + (isNextDayEarly ? 24 : 0) - APP_CONFIG.startHour) * 60 + now.getMinutes();
    }
    return -1; 
}

// 現在時刻の位置まで自動スクロールする
function scrollToCurrentTime(dayKey) {
    const scrollArea = document.getElementById('ttScrollArea');
    if (!scrollArea) return; 

    const currentMins = getCurrentMinsForDay(dayKey);

    if (currentMins < 0) {
        scrollArea.scrollTop = 0;
        return;
    }

    const targetMins = Math.max(0, currentMins - 60); // 1時間前を画面の上端に
    const rootStyles = getComputedStyle(document.documentElement);
    const pxPerMin = parseFloat(rootStyles.getPropertyValue('--px-per-min')) || 2;
    scrollArea.scrollTop = targetMins * pxPerMin;
}

// APP_CONFIGのデータを画面に反映させる
function applyAppConfig() {
    const ui = APP_CONFIG.ui;
    
    if(document.getElementById('appTitle')) document.getElementById('appTitle').innerHTML = APP_CONFIG.festivalName;
    
    const officialLinkEl = document.getElementById('officialLink');
    if(officialLinkEl) {
        officialLinkEl.href = APP_CONFIG.officialUrl;
        officialLinkEl.innerHTML = ui.officialLinkText;
    }

    if(document.getElementById('disclaimerText')) document.getElementById('disclaimerText').innerHTML = ui.disclaimer;
    if(document.getElementById('artistSearchInput')) document.getElementById('artistSearchInput').placeholder = ui.searchPlaceholder;
    if(document.getElementById('btnFood')) document.getElementById('btnFood').textContent = ui.tabFood;
    if(document.getElementById('btnMap')) document.getElementById('btnMap').textContent = ui.tabMap;
    if(document.getElementById('btnWeather')) document.getElementById('btnWeather').textContent = ui.tabWeather;
    if(document.getElementById('btnMemo')) document.getElementById('btnMemo').textContent = ui.tabMemo;
    if(document.getElementById('foodHeader')) document.getElementById('foodHeader').textContent = ui.foodHeader;
    
    if(document.getElementById('weatherNotice')) {
        document.getElementById('weatherNotice').innerHTML = ui.weatherNotice.replace('{WEATHER_URL}', APP_CONFIG.weather.linkUrl);
    }
    
    if(document.getElementById('weatherOfflineContent')) document.getElementById('weatherOfflineContent').innerHTML = ui.weatherOfflineMsg;
    if(document.getElementById('memoHeader')) document.getElementById('memoHeader').textContent = ui.memoHeader;
    if(document.getElementById('memoNotice')) document.getElementById('memoNotice').innerHTML = ui.memoNotice;
    if(document.getElementById('memoTextArea')) document.getElementById('memoTextArea').placeholder = ui.memoPlaceholder;
    if(document.getElementById('searchModalClose')) document.getElementById('searchModalClose').textContent = ui.searchModalClose;
    if(document.getElementById('btnZoomIn')) document.getElementById('btnZoomIn').textContent = ui.mapZoomIn;
    if(document.getElementById('btnZoomOut')) document.getElementById('btnZoomOut').textContent = ui.mapZoomOut;
    if(document.getElementById('btnZoomReset')) document.getElementById('btnZoomReset').textContent = ui.mapZoomReset;

    // 日付タブの生成
    const tabContainer = document.getElementById('tabContainer');
    const firstStaticTab = document.getElementById('btnFood'); 
    document.querySelectorAll('.day-tab-btn').forEach(el => el.remove());

    APP_CONFIG.days.forEach((day) => {
        const btnId = 'btn' + day.id.charAt(0).toUpperCase() + day.id.slice(1);
        const btn = document.createElement('button');
        btn.className = 'tab-btn day-tab-btn';
        btn.id = btnId;
        btn.textContent = day.label;
        tabContainer.insertBefore(btn, firstStaticTab);
    });

    // マップ画像の生成
    const mapWrapper = document.getElementById('mapWrapper');
    if (mapWrapper && APP_CONFIG.mapImages) {
        APP_CONFIG.mapImages.forEach(src => {
            const img = document.createElement('img');
            img.className = 'area-map-img';
            img.src = src;
            img.alt = 'Area Map';
            mapWrapper.appendChild(img);
        });
    }

    // 天気の生成
    if(document.getElementById('weatherTitle')) document.getElementById('weatherTitle').textContent = APP_CONFIG.weather.areaName;
    const weatherContainer = document.getElementById('weatherIframeContainer');
    if (weatherContainer && APP_CONFIG.weather.iframeUrl) {
        const iframe = document.createElement('iframe');
        iframe.src = APP_CONFIG.weather.iframeUrl;
        iframe.title = "1時間毎の天気";
        weatherContainer.appendChild(iframe);
    }

    // 出典元の生成
    const sourceHtml = `${APP_CONFIG.source.text}<br>（<a href="${APP_CONFIG.source.url}" target="_blank" rel="noopener noreferrer" class="source-link">${APP_CONFIG.source.url}</a>）`;
    document.querySelectorAll('.source-credit').forEach(el => el.innerHTML = sourceHtml);
}

// クリックなどのイベントを設定する
function setupEventListeners() {
    APP_CONFIG.days.forEach(day => {
        const btnId = 'btn' + day.id.charAt(0).toUpperCase() + day.id.slice(1);
        const btn = document.getElementById(btnId);
        if(btn) btn.addEventListener('click', () => switchTab(day.id));
    });
    
    document.getElementById('btnFood').addEventListener('click', () => switchTab('food'));
    document.getElementById('btnMap').addEventListener('click', () => switchTab('map'));
    document.getElementById('btnWeather').addEventListener('click', () => switchTab('weather'));
    document.getElementById('btnMemo').addEventListener('click', () => switchTab('memo'));

    document.getElementById('btnZoomIn').addEventListener('click', () => zoomMap(0.2));
    document.getElementById('btnZoomOut').addEventListener('click', () => zoomMap(-0.2));
    document.getElementById('btnZoomReset').addEventListener('click', () => resetZoom());

    // タイムテーブル内の★お気に入りボタン処理
    document.getElementById('gridContainer').addEventListener('click', (e) => {
        if (e.target.classList.contains('fav-btn')) {
            const favId = e.target.getAttribute('data-fav-id');
            if (favId) toggleFav(favId);
        }
    });

    // フードエリアの開閉と★お気に入り処理
    document.getElementById('foodContainer').addEventListener('click', (e) => {
        const toggleEl = e.target.closest('.food-area-toggle');
        if (toggleEl) {
            toggleFoodArea(toggleEl);
            return;
        }
        if (e.target.classList.contains('food-fav-btn')) {
            const favId = e.target.getAttribute('data-fav-id');
            if (favId) toggleFoodFav(favId);
        }
    });

    // 検索モーダル内のボタン処理
    document.getElementById('searchModalContent').addEventListener('click', (e) => {
        if (e.target.classList.contains('fav-btn')) {
            const favId = e.target.getAttribute('data-fav-id');
            if (favId) {
                toggleFav(favId);
                const btn = e.target;
                const block = btn.closest('.artist-block');
                if (favorites[favId]) {
                    btn.classList.add('active');
                    block.classList.add('favorited');
                } else {
                    btn.classList.remove('active');
                    block.classList.remove('favorited');
                }
            }
        }

        const linkEl = e.target.closest('.artist-official-link');
        if (linkEl) {
            const url = linkEl.getAttribute('data-url');
            if (url === "公式HP無し") {
                e.preventDefault(); 
                alert('【公式HP無し】');
            }
        }
    });
}

function toggleFav(id) {
    favorites[id] ? delete favorites[id] : favorites[id] = true;
    saveFavorites();
    renderTimetable(); 
}

function toggleFoodFav(id) {
    const index = foodFavoritesOrder.findIndex(item => item.id === id);
    if (index > -1) {
        foodFavoritesOrder.splice(index, 1); 
    } else {
        const [areaName, shopName] = id.split("::");
        foodFavoritesOrder.push({ id: id, shopName: shopName, areaName: areaName }); 
    }
    saveFoodFavorites();
    renderFoodSection(); 
}

function toggleFoodArea(element) {
    element.classList.toggle('open');
    const content = element.nextElementSibling;
    if(content) content.classList.toggle('open');
}

// "10:30" などの文字列を、開始時間からの分数に変換する
function timeToMins(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const adjustedH = h < APP_CONFIG.startHour ? h + 24 : h;
    return (adjustedH - APP_CONFIG.startHour) * 60 + m;
}

// 25:00 を 1:00 に直して表示する
function formatTimeDisplay(timeStr) {
    let [h, m] = timeStr.split(':').map(Number);
    if(h >= 24) h -= 24; 
    return `${h}:${m.toString().padStart(2, '0')}`;
}

// タブの切り替え処理
function switchTab(target) {
    document.querySelectorAll('.tab-btn, .content-section').forEach(el => el.classList.remove('active'));

    const dayMatch = target.match(/^day(\d+)$/);
    
    if (dayMatch) {
        currentDay = parseInt(dayMatch[1]);
        const btnId = 'btnDay' + currentDay;
        const btnEl = document.getElementById(btnId);
        if(btnEl) btnEl.classList.add('active');
        document.getElementById('timetableSection').classList.add('active');
        
        renderTimetable(); 
        
        setTimeout(() => {
            scrollToCurrentTime(`day${currentDay}`);
        }, 10);
        
    } else {
        const btnId = 'btn' + target.charAt(0).toUpperCase() + target.slice(1);
        const btnEl = document.getElementById(btnId);
        if(btnEl) btnEl.classList.add('active');
        const sectionEl = document.getElementById(target + 'Section');
        if(sectionEl) sectionEl.classList.add('active');
    }
    
    if (target === 'weather') {
        checkWeatherOnlineStatus(); 
        const weatherSection = document.getElementById('weatherSection');
        if (weatherSection) {
            weatherSection.scrollTop = 0;
        }
    }
    
    localStorage.setItem(LAST_TAB_KEY, target);
}

// 天気表示のためのオンラインチェック
function checkWeatherOnlineStatus() {
    const weatherSection = document.getElementById('weatherSection');
    if (weatherSection) {
        if (navigator.onLine) {
            weatherSection.classList.remove('is-offline');
        } else {
            weatherSection.classList.add('is-offline');
        }
    }
}
window.addEventListener('online', checkWeatherOnlineStatus);
window.addEventListener('offline', checkWeatherOnlineStatus);

// タイムテーブルのヘッダー（ステージ名）を描画する
function renderHeaders(myttCols) {
    let html = ''; 

    if(myttCols > 0) {
        // ※ 修正点：background-color や z-index などの見た目はCSSへ移動
        html += `<div class="stage-header mytt" style="--mytt-cols: ${myttCols};">
                    <div class="stage-name mytt">マイタイテ</div>
                 </div>`;
    }
    
    stagesInfo.forEach(stage => {
        // ステージカラーだけはデータ依存なのでCSS変数として渡す
        const style = `style="--stage-color: ${stage.color};"`;
        html += `<div class="stage-header">
                    <div class="stage-name" ${style}>${stage.name}</div>
                 </div>`;
    });
    
    document.getElementById('stageHeaders').innerHTML = html;
}

// アーティスト1組分のHTMLブロックを生成する
function getArtistHtml(artist, stage, dayKey, isMyTT = false, currentMins = -1) {
    const startMin = timeToMins(artist.start);
    const endMin = timeToMins(artist.end);
    const duration = endMin - startMin; 

    const favId = getFavId(dayKey, stage.id, artist.name);
    const isFav = favorites[favId];
    
    let isPlaying = false;
    if (currentMins >= startMin && currentMins < endMin) {
        isPlaying = true;
    }

    const classes = [
        'artist-block', 
        isFav && 'favorited', 
        isPlaying && 'playing', 
        artist.isLightBg && 'is-light-bg',
        artist.hideTime && 'is-time-hidden' 
    ].filter(Boolean).join(' ');
    
    const stageBadgeHtml = isMyTT ? `<div class="mytt-stage-name">${stage.name}</div>` : '';

    if (artist.isSpecialLayout) {
        const timeHtml = artist.hideTime ? '' : `<span class="artist-time">${artist.displayTime || formatTimeDisplay(artist.start) + '-'}</span>`;
        const inlineStageBadge = isMyTT ? `<span class="mytt-stage-name inline-badge">${stage.name}</span>` : '';
        return `
            <div class="${classes} artist-block-special" style="--start-min: ${startMin}; --duration: ${duration}; --artist-bg: ${stage.color};">
                ${inlineStageBadge}
                ${timeHtml}
                <span class="artist-name">${artist.name}</span>
                <button class="fav-btn ${isFav ? 'active' : ''}" data-fav-id="${favId}">★</button>
            </div>`;
    }

    const timeText = artist.hideEndTime ? `${formatTimeDisplay(artist.start)}-` : `${formatTimeDisplay(artist.start)}-${formatTimeDisplay(artist.end)}`;
    
    const timeHtml = artist.hideTime ? '' : `<span class="artist-time">${timeText}</span>`;
    
    const displayGenre = (artist.hideEndTime || isMyTT) ? "" : (artist.genre || "");
    const metaHtml = displayGenre ? `<div class="artist-meta">${displayGenre}</div>` : '';
    
    return `
    <div class="${classes}" style="--start-min: ${startMin}; --duration: ${duration}; --artist-bg: ${stage.color};">
        ${stageBadgeHtml}
        <div class="artist-top">
            ${timeHtml}
            <button class="fav-btn ${isFav ? 'active' : ''}" data-fav-id="${favId}">★</button>
        </div>
        <div class="artist-name">${artist.name}</div>
        ${metaHtml}
    </div>`;
}

// ブロックのサイズに合わせて文字を小さくする（レイアウト調整）
function adjustFontSize() {
    document.querySelectorAll('.artist-block:not(.food-block):not(.search-modal-content .artist-block)').forEach(block => {
        const nameEl = block.querySelector('.artist-name'); 
        const timeEl = block.querySelector('.artist-time'); 
        const stageBadge = block.querySelector('.mytt-stage-name'); 
        const metaEl = block.querySelector('.artist-meta'); 

        if (!nameEl) return; 

        const isRow = block.classList.contains('artist-block-special'); 
        let nameFontSize = isRow ? 11 : 13; 
        const targetEl = nameEl; 

        if (stageBadge) {
            stageBadge.style.fontSize = '8px';
        }

        targetEl.style.fontSize = nameFontSize + 'px';
        
        while ((block.scrollHeight > block.offsetHeight || block.scrollWidth > block.clientWidth) && nameFontSize > 6) {
            let reduced = false; 

            if (stageBadge) {
                let currentBadgeSize = parseFloat(getComputedStyle(stageBadge).fontSize);
                if (currentBadgeSize > 4.5) {
                    stageBadge.style.fontSize = (currentBadgeSize - 0.5) + 'px';
                    reduced = true; 
                    if (block.scrollHeight <= block.offsetHeight && block.scrollWidth <= block.clientWidth) break;
                }
            }
            
            nameFontSize -= 0.5; 
            targetEl.style.fontSize = nameFontSize + 'px'; 
            reduced = true; 

            if (!reduced) break; 
        }

        if (block.scrollHeight > block.offsetHeight) {
            block.classList.add('compact-mode'); 
            let subFontSize = 10;
            while ((block.scrollHeight > block.offsetHeight) && subFontSize > 5) {
                subFontSize -= 0.5;
                if (timeEl) timeEl.style.fontSize = subFontSize + 'px';
                if (stageBadge) stageBadge.style.fontSize = Math.max(4, subFontSize - 2) + 'px';
                if (metaEl) metaEl.style.fontSize = Math.max(5, subFontSize - 2) + 'px';
            }
        } else {
            block.classList.remove('compact-mode');
        }
    });
}

// タイムテーブル全体を描画する
function renderTimetable() {
    const dayKey = `day${currentDay}`;
    const data = timetableData[dayKey];
    if (!data) return; 

    // 左側の時間軸を作る
    let timeHtml = '';
    for(let h = APP_CONFIG.startHour; h <= APP_CONFIG.endHour; h++) {
        timeHtml += `<div class="time-slot"><span>${h >= 24 ? h-24 : h}:00</span></div>`;
    }
    document.getElementById('timeCol').innerHTML = timeHtml;

    const currentMins = getCurrentMinsForDay(dayKey);

    // お気に入り（マイタイムテーブル）のデータを集める
    let myTtItems = [];
    stagesInfo.forEach((stage, stageIndex) => {
        (data[stage.id] || []).forEach(artist => {
            const favId = getFavId(dayKey, stage.id, artist.name);
            if(favorites[favId]) myTtItems.push({ artist, stage, stageIndex });
        });
    });

    if (APP_CONFIG.settings.priorityStageOrder) {
        myTtItems.sort((a,b) => {
            if (a.stageIndex !== b.stageIndex) return a.stageIndex - b.stageIndex;
            return timeToMins(a.artist.start) - timeToMins(b.artist.start);
        });
    } else {
        myTtItems.sort((a,b) => timeToMins(a.artist.start) - timeToMins(b.artist.start));
    }

    // 時間が被っている場合は列を分ける処理
    let myTtColumns = []; 
    myTtItems.forEach(item => {
        let maxOverlapCol = -1;
        for (let colIdx = 0; colIdx < myTtColumns.length; colIdx++) {
            const overlap = myTtColumns[colIdx].some(ex => {
                return Math.max(timeToMins(item.artist.start), timeToMins(ex.artist.start)) < 
                       Math.min(timeToMins(item.artist.end), timeToMins(ex.artist.end));
            });
            if (overlap) maxOverlapCol = Math.max(maxOverlapCol, colIdx);
        }

        let placed = false;
        for (let colIdx = maxOverlapCol + 1; colIdx < myTtColumns.length; colIdx++) {
            const overlap = myTtColumns[colIdx].some(ex => {
                return Math.max(timeToMins(item.artist.start), timeToMins(ex.artist.start)) < 
                       Math.min(timeToMins(item.artist.end), timeToMins(ex.artist.end));
            });
            if (!overlap) {
                myTtColumns[colIdx].push(item);
                placed = true;
                break;
            }
        }
        if (!placed) myTtColumns.push([item]);
    });

    const myTtColCount = myTtItems.length ? myTtColumns.length : 0;
    renderHeaders(myTtColCount); 

    let gridHtml = '';
    
    // マイタイムテーブルを描画
    if(myTtColCount > 0) {
        myTtColumns.forEach(col => {
            gridHtml += `<div class="grid-col mytt"><div class="grid-bg-lines"></div>${col.map(i => getArtistHtml(i.artist, i.stage, dayKey, true, currentMins)).join('')}</div>`;
        });
    }

    // 全ステージのタイムテーブルを描画
    stagesInfo.forEach(stage => {
        const content = (data[stage.id] || []).map(a => getArtistHtml(a, stage, dayKey, false, currentMins)).join('');
        gridHtml += `<div class="grid-col"><div class="grid-bg-lines"></div>${content}</div>`;
    });

    // 現在時刻の線を引く
    gridHtml += `<div class="current-time-line" id="currentTimeLine"></div>`;
    
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = gridHtml;

    const totalHours = APP_CONFIG.endHour - APP_CONFIG.startHour + 1;
    gridContainer.style.height = `calc(${totalHours} * 60 * var(--px-per-min) * 1px)`;
    
    updateCurrentTimeLine(); 
    adjustFontSize(); 
}

function updateCurrentTimeLine() {
    const line = document.getElementById('currentTimeLine');
    if(!line) return;

    const dayKey = `day${currentDay}`;
    const currentMins = getCurrentMinsForDay(dayKey);

    const maxMins = (APP_CONFIG.endHour - APP_CONFIG.startHour) * 60;

    if(currentMins >= 0 && currentMins <= maxMins) {
        line.classList.add('is-visible');
        line.style.setProperty('--current-min', currentMins); 
        return;
    }
    line.classList.remove('is-visible'); 
}

// フード情報を描画する関数群
function generateFoodCard(shop, areaName, isDraggable = false) {
    const menuItems = shop.menus.map(m => `<li>${m}</li>`).join('');
    const messageHtml = shop.message.replace(/\n/g, '<br>');
    const imgSrc = shop.img || ""; 
    const imgHtml = imgSrc ? `<img src="${imgSrc}" class="food-card-img" alt="${shop.name}">` : `<span>NO IMAGE</span>`;
        
    const id = areaName + "::" + shop.name;
    const isFav = foodFavoritesOrder.some(item => item.id === id);
    const safeId = id.replace(/"/g, '"');
    
    const classes = isDraggable ? "food-card draggable-card" : "food-card";
    const dragAttr = isDraggable ? `draggable="true" data-id="${safeId}"` : `data-id="${safeId}"`;

    return `
    <div class="${classes}" ${dragAttr}>
        <div class="food-card-area-badge">${areaName}</div>
        <button class="food-fav-btn ${isFav ? 'active' : ''}" data-fav-id="${safeId}">★</button>
        <div class="food-card-img-wrapper">${imgHtml}</div>
        <div class="food-card-body">
            <h3 class="food-card-title">${shop.name}</h3>
            <ul class="food-card-menus">${menuItems}</ul>
            <p class="food-card-message">${messageHtml}</p>
        </div>
    </div>`;
}

function renderFoodSection() {
    let html = '';
    const ui = APP_CONFIG.ui;
    
    html += `
    <div class="food-area-toggle open food-area-fav">
        <span>${ui.foodFavListTitle}</span>
        <span class="toggle-icon">▶</span>
    </div>
    <div class="food-area-content open" id="foodFavoritesList">
    `;
    
    if (foodFavoritesOrder.length === 0) {
        html += `<div class="food-empty-msg">${ui.foodEmptyMsg}</div>`;
    } else {
        foodFavoritesOrder.forEach(favItem => {
            let shopData = null;
            foodList.forEach(area => {
                if(area.name === favItem.areaName) {
                    const found = area.menu.find(s => s.name === favItem.shopName);
                    if(found) shopData = found;
                }
            });
            if (shopData) html += generateFoodCard(shopData, favItem.areaName, true); 
        });
    }
    html += `</div>`;

    foodList.forEach(area => {
        const shopsHtml = area.menu.map(shop => generateFoodCard(shop, area.name, false)).join('');
        html += `
        <div class="food-area-toggle">
            <span>${area.name}</span>
            <span class="toggle-icon">▶</span>
        </div>
        <div class="food-area-content">
            ${shopsHtml}
        </div>`;
    });
    
    document.getElementById('foodContainer').innerHTML = html;
    setupDragAndDrop(); 
}

// フードの並べ替え（ドラッグ＆ドロップ）処理
function setupDragAndDrop() {
    const container = document.getElementById('foodFavoritesList');
    if (!container) return;
    const cards = container.querySelectorAll('.draggable-card');
    
    cards.forEach(card => {
        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            updateFoodFavoritesOrder(); 
        });
    });
    
    container.addEventListener('dragover', e => {
        e.preventDefault(); 
        const afterElement = getDragAfterElement(container, e.clientX, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (!draggable) return;
        
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    });
}

function getDragAfterElement(container, x) { 
    const draggableElements = [...container.querySelectorAll('.draggable-card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - (box.left + box.width / 2);
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateFoodFavoritesOrder() {
    const container = document.getElementById('foodFavoritesList');
    const cards = container.querySelectorAll('.draggable-card');
    const newOrder = [];
    cards.forEach(card => {
        const id = card.getAttribute('data-id');
        const favItem = foodFavoritesOrder.find(item => item.id === id);
        if (favItem) newOrder.push(favItem);
    });
    foodFavoritesOrder = newOrder;
    saveFoodFavorites();
}

// マップの拡大・縮小
function zoomMap(delta) {
    mapScale = Math.min(Math.max(0.5, mapScale + delta), 3.0);
    document.getElementById('mapWrapper').style.setProperty('--map-scale', mapScale);
}
function resetZoom() {
    mapScale = 1.0;
    document.getElementById('mapWrapper').style.setProperty('--map-scale', mapScale);
}

// 時計の更新
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const clockElement = document.getElementById('digitalClock');
    if (clockElement) clockElement.textContent = `${h}:${m}:${s}`;
}

// 最終更新日時の表示
function displayLastModified() {
    const lastMod = new Date(document.lastModified);
    const y = lastMod.getFullYear();
    const m = String(lastMod.getMonth() + 1).padStart(2, '0');
    const d = String(lastMod.getDate()).padStart(2, '0');
    const hh = String(lastMod.getHours()).padStart(2, '0');
    const mm = String(lastMod.getMinutes()).padStart(2, '0');
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = `更新日時：${y}/${m}/${d} ${hh}:${mm}`;
    }
}

// ---------------- 検索機能系の処理 ----------------

// 検索用のデータを作成する
function buildArtistSearchData() {
    const baseNameMap = new Map(); 
    fullArtistData = [];

    function getBaseName(name) {
        return name.replace(/([ぁ-んァ-ヶ一-龥]|\))(\d+)$/, '$1');
    }

    Object.keys(timetableData).forEach(dayKey => {
        const dayInfo = timetableData[dayKey];
        const dayLabel = APP_CONFIG.days.find(d => d.id === dayKey)?.label || dayKey;

        stagesInfo.forEach(stage => {
            if (dayInfo[stage.id]) {
                dayInfo[stage.id].forEach(artist => {
                    const cleanNameForSearch = artist.name.split('<br>')[0].trim();
                    const baseName = getBaseName(cleanNameForSearch);
                    
                    if (!baseNameMap.has(baseName)) {
                        baseNameMap.set(baseName, []);
                    }
                    baseNameMap.get(baseName).push({
                        originalArtist: artist, stage: stage, dayKey: dayKey,
                        dayLabel: dayLabel, startMin: timeToMins(artist.start)
                    });
                });
            }
        });
    });

    baseNameMap.forEach((artistsGroup, baseName) => {
        const originalNames = artistsGroup.map(item => item.originalArtist.name.split('<br>')[0].trim());
        const yomi = artistYomiDict[baseName] || artistYomiDict[originalNames[0]] || baseName;
        
        fullArtistData.push({
            searchName: baseName,
            originalNames: originalNames,
            normYomi: normalizeForSearch(yomi),
            normName: normalizeForSearch(baseName),
            artistsGroup: artistsGroup, 
            dayKey: artistsGroup[0].dayKey,
            dayLabel: artistsGroup[0].dayLabel,
            startMin: Math.min(...artistsGroup.map(item => timeToMins(item.originalArtist.start))) 
        });
    });

    fullArtistData.sort((a, b) => {
        const yomiA = artistYomiDict[a.searchName] || a.searchName;
        const yomiB = artistYomiDict[b.searchName] || b.searchName;
        return yomiA.localeCompare(yomiB, 'ja');
    });
}

function setupSearch() {
    buildArtistSearchData();
    const searchInput = document.getElementById('artistSearchInput');
    const suggestList = document.getElementById('searchSuggestList');
    const modalOverlay = document.getElementById('searchModalOverlay');
    const modalClose = document.getElementById('searchModalClose');

    searchInput.addEventListener('input', function() {
        const query = normalizeForSearch(this.value.trim());
        suggestList.innerHTML = '';

        if (query.length === 0) {
            suggestList.classList.remove('is-active');
            return;
        }

        const matchedItems = fullArtistData.filter(item => item.normYomi.startsWith(query) || item.normName.startsWith(query));

        if (matchedItems.length > 0) {
            matchedItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.searchName; 
                li.addEventListener('mousedown', () => {
                    searchInput.value = item.searchName; 
                    suggestList.classList.remove('is-active');
                    showSearchResults(item.searchName);
                });
                suggestList.appendChild(li);
            });
            suggestList.classList.add('is-active');
        } else {
            suggestList.classList.remove('is-active');
        }
    });

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const queryText = this.value.trim();
            if (queryText.length > 0) {
                suggestList.classList.remove('is-active');
                showSearchResults(queryText);
                this.blur(); 
            }
        }
    });

    modalClose.addEventListener('click', closeSearchModal);
    modalOverlay.addEventListener('click', closeSearchModal);
}

function closeSearchModal() {
    document.getElementById('searchModal').classList.remove('is-active');
    document.getElementById('searchModalOverlay').classList.remove('is-active');
    const searchInput = document.getElementById('artistSearchInput');
    const suggestList = document.getElementById('searchSuggestList');
    searchInput.value = '';
    suggestList.classList.remove('is-active');
    suggestList.innerHTML = '';
}

function formatDiffTime(mins) {
    if (mins >= 60) {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}時間${m}分`;
    } else {
        return `${mins}分`;
    }
}

// 検索結果内の「開始まであと○分」などを表示する
function getArtistTimeStatusHtml(artist, dayDateStr) {
    if (!artist.start) return "";
    const now = new Date();
    
    let [sh, sm] = artist.start.split(':').map(Number);
    let startDayOffset = 0;
    if (sh >= 24) { sh -= 24; startDayOffset = 1; }
    
    let startDate = new Date(dayDateStr);
    startDate.setDate(startDate.getDate() + startDayOffset);
    startDate.setHours(sh, sm, 0, 0);
    
    let endDate = null;
    if (artist.end) {
        let [eh, em] = artist.end.split(':').map(Number);
        let endDayOffset = 0;
        if (eh >= 24) { eh -= 24; endDayOffset = 1; }
        endDate = new Date(dayDateStr);
        endDate.setDate(endDate.getDate() + endDayOffset);
        endDate.setHours(eh, em, 0, 0);
    }

    const diffMs = startDate - now;
    const diffMins = Math.floor(diffMs / 60000);

    if (endDate) {
        const endDiffMs = endDate - now;
        const endDiffMins = Math.floor(endDiffMs / 60000);

        if (diffMins > 0) {
            const timeStr = formatDiffTime(diffMins);
            const numClass = diffMins < 10 ? "is-urgent" : "";
            return `<div class="search-time-status">演奏前：開始まであと<span class="${numClass}">${timeStr}</span></div>`;
        } else if (endDiffMins > 0) {
            const timeStr = formatDiffTime(endDiffMins);
            return `<div class="search-time-status is-urgent">演奏中：終了まであと${timeStr}</div>`;
        } else {
            return `<div class="search-time-status">演奏終了</div>`;
        }
    } else {
        if (diffMins > 0) {
            const timeStr = formatDiffTime(diffMins);
            const numClass = diffMins < 10 ? "is-urgent" : "";
            return `<div class="search-time-status">演奏前：開始まであと<span class="${numClass}">${timeStr}</span></div>`;
        } else {
            return ``; 
        }
    }
}

function showSearchResults(searchText) {
    const query = normalizeForSearch(searchText.trim());
    if (!query) return;

    const results = fullArtistData.filter(item => 
        item.normYomi.startsWith(query) || 
        item.normName.startsWith(query) ||
        item.originalNames.some(orig => normalizeForSearch(orig).startsWith(query))
    );
    
    results.sort((a, b) => {
        if (a.dayKey !== b.dayKey) return a.dayKey.localeCompare(b.dayKey);
        return a.startMin - b.startMin;
    });

    const contentArea = document.getElementById('searchModalContent');
    contentArea.innerHTML = '';
    
    const ui = APP_CONFIG.ui;
    document.getElementById('searchModalTitle').textContent = `${ui.searchModalTitlePrefix}${searchText}${ui.searchModalTitleSuffix}`;

    if (results.length === 0) {
        contentArea.innerHTML = `<div class="search-empty-msg">${ui.searchEmptyMsg}</div>`;
        return;
    }

    const totalArtists = results.reduce((sum, item) => sum + item.artistsGroup.length, 0);
    
    if (totalArtists === 1) {
        const targetGroup = results[0].artistsGroup[0];
        const artist = targetGroup.originalArtist;
        const dayDate = timetableData[targetGroup.dayKey].date;
        const statusHtml = getArtistTimeStatusHtml(artist, dayDate);
        contentArea.innerHTML = statusHtml; 
    } else if (totalArtists > 1) {
        const statusHtml = `<div class="search-time-status">複数時間帯が存在するためカウントダウン対象外</div>`;
        contentArea.innerHTML = statusHtml;
    }

    results.forEach(item => {
        item.artistsGroup.forEach((groupItem, index) => {
            const artist = groupItem.originalArtist;
            const stage = groupItem.stage;
            const dayKey = groupItem.dayKey;
            
            const favId = getFavId(dayKey, stage.id, artist.name);
            const isFav = favorites[favId];
            const dayLabel = APP_CONFIG.days.find(d => d.id === dayKey)?.label || dayKey;
            const timeText = artist.end ? `${formatTimeDisplay(artist.start)}-${formatTimeDisplay(artist.end)}` : `${formatTimeDisplay(artist.start)}-`;

            const officialUrl = artistLinkDict[item.searchName] || "公式HP無し";
            
            let spotifyHtml = "";
            if (index === item.artistsGroup.length - 1) {
                const spotifyUrl = artistSpotifyDict[item.searchName] || "Spotify無し";
                if (spotifyUrl !== "Spotify無し") {
                    // ※ 修正点：非推奨の frameBorder="0" を削除しました。
                    spotifyHtml = `
                        <div class="spotify-embed-container">
                            <iframe class="spotify-embed-iframe" src="${spotifyUrl}" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                        </div>
                    `;
                } else {
                    spotifyHtml = `
                        <div class="spotify-empty-msg">【Spotify無し】</div>
                    `;
                }
            }

            const isBiaKaidan = artist.name.includes("ビア怪談");
            const compactClass = isBiaKaidan ? 'is-compact-text' : '';

            const classes = ['artist-block', isFav ? 'favorited' : '', artist.isLightBg ? 'is-light-bg' : '', compactClass].filter(Boolean).join(' ');

            const html = `
                <div class="${classes}" style="--artist-bg: ${stage.color};">
                    <div class="artist-stage-name search-stage-name">${stage.name}</div>
                    <div class="artist-time search-time">${dayLabel} ${timeText}</div>
                    <div class="artist-name-row">
                        <div class="artist-name">
                            <a href="${officialUrl !== '公式HP無し' ? officialUrl : '#'}" 
                               class="artist-official-link ${officialUrl === '公式HP無し' ? 'no-link' : ''}" 
                               data-url="${officialUrl}" 
                               target="${officialUrl !== '公式HP無し' ? '_blank' : '_self'}" 
                               rel="noopener noreferrer">
                               ${artist.name}
                            </a>
                        </div>
                        <button class="fav-btn ${isFav ? 'active' : ''}" data-fav-id="${favId}">★</button>
                    </div>
                </div>
                ${spotifyHtml}
            `;
            contentArea.insertAdjacentHTML('beforeend', html);
        });
    });

    document.getElementById('searchModalOverlay').classList.add('is-active');
    document.getElementById('searchModal').classList.add('is-active');
}

// アプリが起動した時に動くメイン処理
window.addEventListener('DOMContentLoaded', () => {
    applyAppConfig(); 
    setupEventListeners(); 
    setupSearch();

    // 最後に開いていたタブを復元する
    const lastTab = localStorage.getItem(LAST_TAB_KEY) || (APP_CONFIG.days[0] ? APP_CONFIG.days[0].id : 'food');
    switchTab(lastTab); 

    renderFoodSection();
    displayLastModified();
    
    updateClock();
    setInterval(updateClock, 1000); 
    setInterval(updateCurrentTimeLine, 60000); 

    // メモの保存・復元処理
    const memoTextArea = document.getElementById('memoTextArea');
    if (memoTextArea) {
        const savedMemo = localStorage.getItem(MEMO_KEY) || '';
        memoTextArea.value = savedMemo;
        memoTextArea.addEventListener('input', () => {
            localStorage.setItem(MEMO_KEY, memoTextArea.value);
        });
    }
});