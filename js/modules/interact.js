// ============================================================
// ENTESHARAT SMART INTERACTION
// Text + Voice + Video
// ============================================================

const InteractModule = {

    recognition: null,
    mediaRecorder: null,
    mediaStream: null,
    videoChunks: [],
    recordingType: null,
    isListening: false,

    init() {

        this.createStatus();
        this.prepareSpeechRecognition();
        this.prepareButtons();

        console.log('✅ تعامل هوشمند فعال شد');
    },

    createStatus() {

        const box =
            document.querySelector('.interact-box');

        if (!box || document.getElementById('interactionStatus')) {
            return;
        }

        const status =
            document.createElement('div');

        status.id = 'interactionStatus';
        status.className = 'interaction-status';

        box.insertBefore(
            status,
            box.querySelector('.response-box')
        );
    },

    setStatus(message, type = '') {

        const el =
            document.getElementById('interactionStatus');

        if (!el) return;

        el.textContent = message;
        el.className =
            `interaction-status ${type}`;
    },

    prepareButtons() {

        const textButton =
            document.querySelector('#interact .btn-text');

        const audioButton =
            document.querySelector('#interact .btn-audio');

        const videoButton =
            document.querySelector('#interact .btn-video');

        if (textButton) {
            textButton.onclick = () =>
                this.sendText();
        }

        if (audioButton) {
            audioButton.onclick = () =>
                this.sendAudio();
        }

        if (videoButton) {
            videoButton.onclick = () =>
                this.sendVideo();
        }
    },

    prepareSpeechRecognition() {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            return;
        }

        this.recognition =
            new SpeechRecognition();

        this.recognition.lang = 'fa-IR';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {

            this.isListening = true;

            this.setStatus(
                '🎙️ در حال شنیدن صدای شما...',
                'recording'
            );
        };

        this.recognition.onresult = event => {

            let transcript = '';

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                transcript +=
                    event.results[i][0].transcript;
            }

            const input =
                document.getElementById('mainInteract');

            if (input) {
                input.value =
                    transcript.trim();
            }
        };

        this.recognition.onerror = event => {

            this.isListening = false;

            this.setStatus(
                `خطا در دریافت صدا: ${event.error}`,
                'error'
            );
        };

        this.recognition.onend = () => {

            this.isListening = false;

            const input =
                document.getElementById('mainInteract');

            if (input?.value.trim()) {

                this.setStatus(
                    '🎙️ پیام دریافت شد؛ در حال پردازش...',
                    'success'
                );

                this.processMessage(
                    input.value.trim(),
                    'voice'
                );
            }
        };
    },

    async sendText() {

        const input =
            document.getElementById('mainInteract');

        if (!input) return;

        const message =
            input.value.trim();

        if (!message) {

            this.setStatus(
                'لطفاً سؤال یا درخواست خود را بنویسید.',
                'error'
            );

            input.focus();

            return;
        }

        input.value = '';

        await this.processMessage(
            message,
            'text'
        );
    },

    sendAudio() {

        if (!this.recognition) {

            this.setStatus(
                'مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند. از Chrome استفاده کنید.',
                'error'
            );

            return;
        }

        if (this.isListening) {

            this.recognition.stop();

            return;
        }

        try {

            this.recognition.start();

        } catch (error) {

            console.error(error);

        }
    },

    async sendVideo() {

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            this.setStatus(
                'مرورگر شما امکان ضبط ویدئو را ندارد.',
                'error'
            );

            return;
        }

        if (this.mediaRecorder?.state === 'recording') {

            this.stopVideoRecording();

            return;
        }

        try {

            this.mediaStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

            this.videoChunks = [];
            this.recordingType = 'video';

            const options =
                this.getRecorderOptions();

            this.mediaRecorder =
                new MediaRecorder(
                    this.mediaStream,
                    options
                );

            this.mediaRecorder.ondataavailable =
                event => {

                    if (event.data.size > 0) {
                        this.videoChunks.push(
                            event.data
                        );
                    }
                };

            this.mediaRecorder.onstop =
                () => this.finishVideoRecording();

            this.mediaRecorder.start();

            this.setStatus(
                '🎥 ضبط ویدئو شروع شد. برای پایان دوباره روی «ارسال ویدئو» بزنید.',
                'recording'
            );

            this.setVideoButton(true);

            /*
             * همزمان گفتار ویدئو نیز به متن تبدیل می‌شود.
             */
            if (this.recognition) {

                try {
                    this.recognition.start();
                } catch (error) {}
            }

        } catch (error) {

            console.error(error);

            this.setStatus(
                'دسترسی به دوربین یا میکروفون داده نشد.',
                'error'
            );
        }
    },

    getRecorderOptions() {

        const types = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm'
        ];

        for (const type of types) {

            if (
                window.MediaRecorder &&
                MediaRecorder.isTypeSupported(type)
            ) {

                return {
                    mimeType: type
                };
            }
        }

        return {};
    },

    stopVideoRecording() {

        if (
            this.mediaRecorder &&
            this.mediaRecorder.state === 'recording'
        ) {

            this.mediaRecorder.stop();
        }

        if (this.recognition && this.isListening) {

            try {
                this.recognition.stop();
            } catch (error) {}
        }

        this.setVideoButton(false);
    },

    finishVideoRecording() {

        const mime =
            this.mediaRecorder?.mimeType ||
            'video/webm';

        const blob =
            new Blob(
                this.videoChunks,
                { type: mime }
            );

        const url =
            URL.createObjectURL(blob);

        this.showVideoPreview(url);

        const input =
            document.getElementById('mainInteract');

        const transcript =
            input?.value.trim() || '';

        this.cleanupStream();

        if (transcript) {

            this.processMessage(
                transcript,
                'video'
            );

        } else {

            this.setStatus(
                '🎥 ویدئو ضبط شد. برای درخواست خود یک توضیح کوتاه بنویسید و ارسال متن را بزنید.',
                'success'
            );
        }
    },

    showVideoPreview(url) {

        const box =
            document.querySelector('.interact-box');

        if (!box) return;

        let preview =
            document.getElementById(
                'interactionVideoPreview'
            );

        if (!preview) {

            preview =
                document.createElement('div');

            preview.id =
                'interactionVideoPreview';

            preview.className =
                'interaction-video-preview';

            box.insertBefore(
                preview,
                box.querySelector('.response-box')
            );
        }

        preview.innerHTML = '';

        const video =
            document.createElement('video');

        video.controls = true;
        video.src = url;
        video.playsInline = true;

        const download =
            document.createElement('a');

        download.href = url;
        download.download =
            `entesharat-message-${Date.now()}.webm`;

        download.className =
            'interaction-video-download';

        download.textContent =
            '⬇️ ذخیره ویدئو';

        preview.appendChild(video);
        preview.appendChild(download);
    },

    cleanupStream() {

        if (this.mediaStream) {

            this.mediaStream
                .getTracks()
                .forEach(track => track.stop());

            this.mediaStream = null;
        }
    },

    setVideoButton(recording) {

        const button =
            document.querySelector(
                '#interact .btn-video'
            );

        if (!button) return;

        if (recording) {

            button.innerHTML =
                '<i class="fas fa-stop"></i> پایان ضبط';

        } else {

            button.innerHTML =
                '<i class="fas fa-video"></i> ارسال ویدئو';
        }
    },

    async processMessage(message, source) {

        this.addUserMessage(
            message,
            source
        );

        this.setStatus(
            '🤖 در حال پردازش درخواست شما...',
            'loading'
        );

        try {

            const reply =
                await AI.respond(
                    message,
                    source
                );

            this.addAIMessage(reply);

            this.setStatus(
                '✅ پاسخ آماده است.',
                'success'
            );

        } catch (error) {

            console.error(error);

            this.addAIMessage(
                'متأسفانه در حال حاضر امکان دریافت پاسخ هوشمند وجود ندارد.'
            );

            this.setStatus(
                '❌ ارتباط با هوش مصنوعی برقرار نشد.',
                'error'
            );
        }
    },

    addUserMessage(message, source) {

        const responses =
            document.getElementById(
                'mainResponses'
            );

        if (!responses) return;

        const item =
            document.createElement('div');

        item.className =
            'response-item user-response';

        const icons = {
            text: '⌨️',
            voice: '🎙️',
            video: '🎥'
        };

        const label = {
            text: 'متن',
            voice: 'ویس',
            video: 'ویدئو'
        };

        const icon =
            icons[source] || '💬';

        const type =
            label[source] || 'پیام';

        item.innerHTML = `
            <span class="type-icon text">
                ${icon}
            </span>
            <div>
                <strong>${type}</strong>
                <div class="user-message"></div>
            </div>
        `;

        item.querySelector(
            '.user-message'
        ).textContent = message;

        responses.appendChild(item);

        responses.scrollTop =
            responses.scrollHeight;
    },

    addAIMessage(message) {

        const responses =
            document.getElementById(
                'mainResponses'
            );

        if (!responses) return;

        const item =
            document.createElement('div');

        item.className =
            'response-item ai-response-item';

        item.innerHTML = `
            <span class="type-icon ai">
                🤖
            </span>
            <div>
                <strong>دستیار هوشمند</strong>
                <div class="ai-message"></div>
            </div>
        `;

        item.querySelector(
            '.ai-message'
        ).textContent = message;

        responses.appendChild(item);

        responses.scrollTop =
            responses.scrollHeight;
    }
};

window.InteractModule =
    InteractModule;

if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        () => InteractModule.init(),
        { once: true }
    );

} else {

    InteractModule.init();
}
