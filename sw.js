/**
 * ==========================================
 * 【重要・流用時の注意点】
 * Service Worker（オフライン機能）はブラウザの裏側で動く特殊な仕組みのため、
 * script.js の APP_CONFIG の設定を直接読み取ることができません。
 * そのため、別のフェスに流用する場合は、必ずここの CACHE_PREFIX の
 * 文字列（'hoshioto_2026_' の部分）を手動で書き換えてください。
 * ==========================================
 */
const CACHE_PREFIX = 'hoshioto_2026_'; 
const CACHE_VERSION = 'v2';
const CACHE_NAME = CACHE_PREFIX + 'cache-' + CACHE_VERSION;

// インストール時に、古いService Workerを待たずにすぐ新しいものをアクティブにする
self.addEventListener('install', event => {
    self.skipWaiting();
});

// アクティブになったら、古いバージョンのキャッシュを削除する
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => {
                    // プレフィックスが一致し、かつ現在のバージョンではない古いキャッシュを対象にする
                    return name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME;
                }).map(name => {
                    return caches.delete(name);
                })
            );
        }).then(() => self.clients.claim()) // すぐに制御を開始する
    );
});

// fetchイベント：Stale-While-Revalidate（キャッシュを表示しつつ、裏で更新）
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            
            // ネットワークへ最新のデータを取得しに行く処理（非同期）
            const fetchPromise = fetch(event.request).then(networkResponse => {
                // 正常に取得できたら、裏側でこっそりキャッシュを上書きする
                if (networkResponse && networkResponse.status === 200) {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            }).catch(() => {
                // オフライン時はエラーを出さずに何もしない
            });

            // キャッシュがあれば「まずはキャッシュ」を返し、無ければ「ネットワーク通信の結果」を待つ
            // ユーザーには一瞬でキャッシュが表示され、裏側で次回用の最新データが保存されます。
            return cachedResponse || fetchPromise;
        })
    );
});