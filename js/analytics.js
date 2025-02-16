// Combined Analytics Scripts

// 1. GoatCounter Analytics
(function() {
    const script = document.createElement('script');
    script.src = '//gc.zgo.at/count.js';
    script.async = true;
    script.dataset.goatcounter = 'https://2808.goatcounter.com/count';
    document.head.appendChild(script);
})();

// 2. Bisml Analytics
(function() {
    const script = document.createElement('script');
    script.src = 'https://biasml.com/js/script.js';
    script.async = true;
    script.defer = true;
    script.id = 'ZwSg9rf6GA';
    script.dataset.host = 'https://biasml.com';
    script.dataset.dnt = 'false';
    document.head.appendChild(script);
})();

// 3. Amplitude Analytics
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.amplitude.com/script/debb0f817e1317d6d87aa89b200c03a2.js';
    script.onload = function() {
        window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
        window.amplitude.init('debb0f817e1317d6d87aa89b200c03a2', {
            "fetchRemoteConfig": true,
            "autocapture": true
        });
    };
    document.head.appendChild(script);
})();

// 4. Umami Analytics
(function() {
    const script = document.createElement('script');
    script.src = 'https://cloud.umami.is/script.js';
    script.defer = true;
    script.dataset.websiteId = '83596513-8393-4bcb-b2ec-00fbe8354576';
    document.head.appendChild(script);
})();

// 5. Minimal GA4
const MinimalGA4 = {
    trackingId: 'G-27Z6B3Q2J5',
    
    storage: {
        local: localStorage,
        session: sessionStorage
    },
    doc: document,
    win: window,
    nav: navigator,
    screen: screen,
    
    downloadExtensions: ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'txt', 'rtf', 'csv', 'exe', 'key', 'pps', 'ppt', 'pptx', '7z', 'pkg', 'rar', 'gz', 'zip', 'avi', 'mov', 'mp4', 'mpe', 'mpeg', 'wmv', 'mid', 'midi', 'mp3', 'wav', 'wma'],
    
    searchParams: ['q', 's', 'search', 'query', 'keyword'],
    
    generateId: () => Math.floor(Math.random() * 1000000000) + 1,
    generateTimestamp: () => Math.floor(Date.now() / 1000),
    
    getClientId() {
        if (!this.storage.local.cid_v4) {
            this.storage.local.cid_v4 = `${this.generateId()}.${this.generateTimestamp()}`;
        }
        return this.storage.local.cid_v4;
    },
    
    getSessionId() {
        if (!this.storage.session.sid) {
            this.storage.session.sid = this.generateTimestamp();
        }
        return this.storage.session.sid;
    },
    
    getSessionCount() {
        if (!this.storage.session.sct) {
            this.storage.session.sct = 1;
        }
        return this.storage.session.sct;
    },
    
    isFirstVisit() {
        return !this.storage.local.cid_v4 ? 1 : undefined;
    },
    
    isNewSession() {
        if (!this.storage.session._ss) {
            this.storage.session._ss = 1;
            return 1;
        }
        return undefined;
    },
    
    getSearchTerm() {
        const searchParams = new URLSearchParams(this.doc.location.search);
        for (const param of this.searchParams) {
            const value = searchParams.get(param);
            if (value) return value;
        }
        return undefined;
    },
    
    send(eventData = {}) {
        const defaultData = {
            v: 2,
            tid: this.trackingId,
            _p: this.storage.session._p || (this.storage.session._p = this.generateId()),
            sr: `${this.screen.width * this.win.devicePixelRatio}x${this.screen.height * this.win.devicePixelRatio}`,
            ul: (this.nav.language || undefined)?.toLowerCase(),
            cid: this.getClientId(),
            _fv: this.isFirstVisit(),
            _s: 1,
            dl: this.doc.location.href,
            dt: this.doc.title || undefined,
            dr: this.doc.referrer || undefined,
            sid: this.getSessionId(),
            sct: this.getSessionCount(),
            seg: 1,
            _ss: this.isNewSession()
        };

        const data = new URLSearchParams({
            ...defaultData,
            ...eventData
        });

        const url = 'https://www.google-analytics.com/g/collect';

        if (this.nav.sendBeacon) {
            this.nav.sendBeacon(`${url}?${data.toString()}`);
        } else {
            fetch(url, {
                method: 'POST',
                body: data
            });
        }
    },
    
    trackPageView() {
        const searchTerm = this.getSearchTerm();
        this.send({
            en: searchTerm ? 'view_search_results' : 'page_view',
            ...(searchTerm && { 'ep.search_term': searchTerm })
        });
    },
    
    trackScroll() {
        const docEl = this.doc.documentElement;
        const docBody = this.doc.body;
        
        const calculateScroll = () => {
            return ((docEl.scrollTop || docBody.scrollTop) / 
                   ((docEl.scrollHeight || docBody.scrollHeight) - docEl.clientHeight) * 100);
        };
        
        let scrollTracked = false;
        
        this.doc.addEventListener('scroll', () => {
            if (!scrollTracked && calculateScroll() >= 90) {
                scrollTracked = true;
                this.send({
                    en: 'scroll',
                    'epn.percent_scrolled': 90
                });
            }
        }, { passive: true });
    },
    
    trackDownloads() {
        this.doc.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link?.href) return;
            
            const url = new URL(link.href);
            const filename = url.pathname.split('/').pop() || '';
            const extension = filename.split('.').pop()?.toLowerCase();
            
            if (link.hasAttribute('download') || this.downloadExtensions.includes(extension)) {
                this.send({
                    en: 'file_download',
                    'ep.file_extension': extension,
                    'ep.file_name': filename.replace(`.${extension}`, ''),
                    'ep.link_text': link.textContent.trim(),
                    'ep.link_url': url.pathname
                });
            }
        }, { passive: true });
    },
    
    init() {
        this.trackPageView();
        this.trackScroll();
        this.trackDownloads();
    }
};

// Initialize Minimal GA4
MinimalGA4.init();