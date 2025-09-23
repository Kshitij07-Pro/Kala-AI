document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCTYFpPHDiuTW1mVOJun79x12p2_MC2VsY",
        authDomain: "kala-ai-9f829.firebaseapp.com",
        projectId: "kala-ai-9f829",
        storageBucket: "kala-ai-9f829.firebasestorage.app",
        messagingSenderId: "637044832232",
        appId: "1:637044832232:web:8c800236e764dc2eeb165d",
        measurementId: "G-PKS9HSSK6Y"
    };
    // 5. In Firebase, go to Authentication > Sign-in method and enable
    //    "Email/Password", "Google", and "Facebook" providers.
    // --- ----------------------------------------------------- ---

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    // Gemini API Key
    const geminiApiKey = "AIzaSyDY-RsLiZ4R1I5kn_c-qU8S8LUg5EE5zT8";
        
        // DOM Elements
        const loginModal = document.getElementById('login-modal');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const loginView = document.getElementById('login-view');
        const signupView = document.getElementById('signup-view');
        const showSignup = document.getElementById('show-signup');
        const showLogin = document.getElementById('show-login');
        const googleLoginBtn = document.getElementById('google-login');
        const mainApp = document.getElementById('main-app');
        const userMenuButton = document.getElementById('user-menu-button');
        const userMenu = document.getElementById('user-menu');
        const userDisplayName = document.getElementById('user-display-name');
        const userEmailDisplay = document.getElementById('user-email-display');
        const logoutButton = document.getElementById('logout-button');
        const languageSelector = document.getElementById('language-selector');
        const imageUploadArea = document.getElementById('image-upload-area');
        const imageUploadInput = document.getElementById('image-upload-input');
        const imagePreviewContainer = document.getElementById('image-preview-container');
        const previewImg = document.getElementById('preview-img');
        const uploadPrompt = document.getElementById('upload-prompt');
        const changeImageButton = document.getElementById('change-image-button');
        const removeImageButton = document.getElementById('remove-image-button');
        const generateButton = document.getElementById('generate-button');
        const refreshButton = document.getElementById('refresh-button');
        const loader = document.getElementById('loader');
        const storyOutput = document.getElementById('story-output');
        const errorMessage = document.getElementById('error-message');
        const resultContainer = document.getElementById('result-container');
        const authError = document.getElementById('auth-error');
        const recordButton = document.getElementById('record-button');
        const stopButton = document.getElementById('stop-button');
        const recordingStatus = document.getElementById('recording-status');
        const recordingTimer = document.getElementById('recording-timer');
        const audioPlayback = document.getElementById('audio-playback');
        const audioPlayer = document.getElementById('audio-player');
        const typedStoryInput = document.getElementById('typed-story-input');
        const postButton = document.getElementById('post-button');
        const socialShareLinks = document.getElementById('social-share-links');
        const copySuccessMessage = document.getElementById('copy-success-message');
        const copyButton = document.getElementById('copy-button');
        const imageGenPrompt = document.getElementById('image-gen-prompt');
        const generateImageButton = document.getElementById('generate-image-button');
        const imageGenSpinner = document.getElementById('image-gen-spinner');
        const generatedImageContainer = document.getElementById('generated-image-container');
        const generatedImage = document.getElementById('generated-image');

        let imageData = null;
        let audioData = null;
        let lastGeneratedStoryText = null;
        let originalGeneratedStoryText = null;
        let originalInputText = "";
        let mediaRecorder;
        let audioChunks = [];
        let timerInterval;
        let currentLanguage = 'en';
        
        const translations = {
            en: { appTitle: "Kalā-AI", appSubtitle: "Bring your artisan crafts to life.", imageGenTitle: "1. Create an Image with AI", imageGenPlaceholder: "Describe the craft you want to visualize, e.g., 'a blue pottery vase with floral patterns'...", generateImageButton: "Generate Image", uploadTitle: "2. Upload Image", uploadLink: "Choose a file", changeButton: "Change", removeButton: "Remove", storyTitle: "3. Tell Your Story", storyPlaceholder: "Start typing your story here, or click the mic to record...", audioSuccess: "✓ Story Recorded", generateButton: "GENERATE STORY", refreshButton: "START NEW STORY", postButton: "Share Story", postSuccess: "✓ Successfully posted!", copySuccess: "✓ Copied to clipboard!", logoutButton: "Logout", languageName: "English", languageLabel: "Language", loginTitle: "Welcome Back", loginSubtitle: "Please sign in to continue", loginButton: "LOGIN", loginNoAccount: "Don't have an account?", loginSignupLink: "Sign Up", signupTitle: "Create Account", signupSubtitle: "Join the Kalā-AI community", signupButton: "SIGN UP", signupHaveAccount: "Already have an account?", signupLoginLink: "Login", socialDivider: "Or continue with" },
            hi: { appTitle: "कला-एआई", appSubtitle: "अपनी कारीगर शिल्प को जीवंत करें।", imageGenTitle: "१. AI से एक छवि बनाएं", imageGenPlaceholder: "उस शिल्प का वर्णन करें जिसे आप देखना चाहते हैं, जैसे, 'फूलों के पैटर्न वाला एक नीला मिट्टी का बर्तन'...", generateImageButton: "छवि बनाएं", uploadTitle: "२. छवि अपलोड करें", uploadLink: "एक फ़ाइल चुनें", changeButton: "बदलें", removeButton: "हटाएं", storyTitle: "३. अपनी कहानी बताएं", storyPlaceholder: "अपनी कहानी यहाँ लिखना शुरू करें, या रिकॉर्ड करने के लिए माइक पर क्लिक करें...", audioSuccess: "✓ कहानी रिकॉर्ड हो गई", generateButton: "कहानी बनाएं", refreshButton: "नई कहानी शुरू करें", postButton: "कहानी साझा करें", postSuccess: "✓ सफलतापूर्वक पोस्ट किया गया!", copySuccess: "✓ क्लिपबोर्ड पर कॉपी किया गया!", logoutButton: "लॉग आउट", languageName: "Hindi", languageLabel: "भाषा", loginTitle: "वापसी पर स्वागत है", loginSubtitle: "जारी रखने के लिए साइन इन करें", loginButton: "लॉग इन करें", loginNoAccount: "खाता नहीं है?", loginSignupLink: "साइन अप करें", signupTitle: "खाता बनाएं", signupSubtitle: "कला-एआई समुदाय में शामिल हों", signupButton: "साइन अप करें", signupHaveAccount: "पहले से ही एक खाता है?", signupLoginLink: "लॉग इन करें", socialDivider: "या इसके साथ जारी रखें" },
            bn: { appTitle: "কলা-এআই", appSubtitle: "আপনার কারুশিল্পকে জীবন্ত করে তুলুন।", imageGenTitle: "১. এআই দিয়ে ছবি তৈরি করুন", imageGenPlaceholder: "আপনি যে কারুশিল্পটি দেখতে চান তা বর্ণনা করুন, যেমন, 'ফুলের নকশা সহ একটি নীল মাটির ফুলদানি'...", generateImageButton: "ছবি তৈরি করুন", uploadTitle: "২. ছবি আপলোড করুন", uploadLink: "একটি ফাইল પસંદ করুন", changeButton: "পরিবর্তন করুন", removeButton: "সরান", storyTitle: "৩. আপনার গল্প বলুন", storyPlaceholder: "আপনার গল্প এখানে টাইপ করা শুরু করুন, অথবা রেকর্ড করতে মাইকে ক্লিক করুন...", audioSuccess: "✓ গল্প রেকর্ড করা হয়েছে", generateButton: "গল্প তৈরি করুন", refreshButton: "নতুন গল্প শুরু করুন", postButton: "গল্প শেয়ার করুন", postSuccess: "✓ সফলভাবে পোস্ট করা হয়েছে!", copySuccess: "✓ ক্লিপবোর্ডে অনুলিপি করা হয়েছে!", logoutButton: "লগ আউট", languageName: "Bengali", languageLabel: "ভাষা", loginTitle: "আবার স্বাগতম", loginSubtitle: "চালিয়ে যেতে সাইন ইন করুন", loginButton: "লগইন", loginNoAccount: "অ্যাকাউন্ট নেই?", loginSignupLink: "নিবন্ধন করুন", signupTitle: "অ্যাকাউন্ট তৈরি করুন", signupSubtitle: "কলা-এআই সম্প্রদায়ে যোগ দিন", signupButton: "নিবন্ধন করুন", signupHaveAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?", signupLoginLink: "লগইন", socialDivider: "অথবা এর সাথে চালিয়ে যান" },
            ta: { appTitle: "கலா-ஏஐ", appSubtitle: "உங்கள் கைவினைப் பொருட்களை உயிர்ப்பிக்கவும்.", imageGenTitle: "1. AI மூலம் ஒரு படத்தை உருவாக்கவும்", imageGenPlaceholder: "நீங்கள் பார்க்க விரும்பும் கைவினையை விவரிக்கவும், எ.கா., 'பூ வடிவங்களுடன் ஒரு நீல மட்பாண்ட குவளை'...", generateImageButton: "படத்தை உருவாக்கவும்", uploadTitle: "2. படத்தை பதிவேற்றவும்", uploadLink: "ஒரு கோப்பைத் தேர்ந்தெடுக்கவும்", changeButton: "மாற்று", removeButton: "நீக்கு", storyTitle: "3. உங்கள் கதையைச் சொல்லுங்கள்", storyPlaceholder: "உங்கள் கதையை இங்கே தட்டச்சு செய்யத் தொடங்குங்கள், அல்லது பதிவு செய்ய மைக்கைக் கிளிக் செய்க...", audioSuccess: "✓ கதை பதிவு செய்யப்பட்டது", generateButton: "கதையை உருவாக்கவும்", refreshButton: "புதிய கதையைத் தொடங்குங்கள்", postButton: "கதையைப் பகிரவும்", postSuccess: "✓ வெற்றிகரமாக வெளியிடப்பட்டது!", copySuccess: "✓ கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது!", logoutButton: "வெளியேறு", languageName: "Tamil", languageLabel: "மொழி", loginTitle: "மீண்டும் வரவேற்கிறோம்", loginSubtitle: "தொடர உள்நுழையவும்", loginButton: "உள்நுழை", loginNoAccount: "கணக்கு இல்லையா?", loginSignupLink: "பதிவு செய்க", signupTitle: "கணக்கை உருவாக்கு", signupSubtitle: "கலா-ஏஐ சமூகத்தில் சேரவும்", signupButton: "பதிவு செய்க", signupHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?", signupLoginLink: "உள்நுழை", socialDivider: "அல்லது தொடரவும்" },
            te: { appTitle: "కళా-ఏఐ", appSubtitle: "మీ చేతిపనులకు జీవం పోయండి.", imageGenTitle: "1. AI తో చిత్రాన్ని సృష్టించండి", imageGenPlaceholder: "మీరు చూడాలనుకుంటున్న కళను వివరించండి, ఉదా., 'పువ్వుల నమూనాలతో నీలి మట్టి కుండ'...", generateImageButton: "చిత్రాన్ని సృష్టించండి", uploadTitle: "2. చిత్రాన్ని అప్‌లోడ్ చేయండి", uploadLink: "ఒక ఫైల్‌ను ఎంచుకోండి", changeButton: "మార్చండి", removeButton: "తొలగించు", storyTitle: "3. మీ కథను చెప్పండి", storyPlaceholder: "మీ కథను ఇక్కడ టైప్ చేయడం ప్రారంభించండి, లేదా రికార్డ్ చేయడానికి మైక్‌ని క్లిక్ చేయండి...", audioSuccess: "✓ కథ రికార్డ్ చేయబడింది", generateButton: "కథను సృష్టించండి", refreshButton: "కొత్త కథను ప్రారంభించండి", postButton: "కథను పంచుకోండి", postSuccess: "✓ విజయవంతంగా పోస్ట్ చేయబడింది!", copySuccess: "✓ క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!", logoutButton: "లాగ్ అవుట్", languageName: "Telugu", languageLabel: "భాష", loginTitle: "తిరిగి స్వాగతం", loginSubtitle: "కొనసాగించడానికి సైన్ ఇన్ చేయండి", loginButton: "లాగిన్", loginNoAccount: "ఖాతా లేదా?", loginSignupLink: "నమోదు చేసుకోండి", signupTitle: "ఖాతాను సృష్టించండి", signupSubtitle: "కళా-ఏఐ సంఘంలో చేరండి", signupButton: "నమోదు చేసుకోండి", signupHaveAccount: "ఇప్పటికే ఖాతా ఉందా?", signupLoginLink: "లాగిన్", socialDivider: "లేదా దీనితో కొనసాగండి" },
            mr: { appTitle: "कला-एआय", appSubtitle: "तुमच्या कलाकुसरीला जिवंत करा.", imageGenTitle: "१. AI ने प्रतिमा तयार करा", imageGenPlaceholder: "तुम्ही पाहू इच्छित असलेले हस्तकला वर्णन करा, उदा., 'फुलांच्या नमुन्यांसह निळ्या मातीची फुलदाणी'...", generateImageButton: "प्रतिमा तयार करा", uploadTitle: "२. प्रतिमा अपलोड करा", uploadLink: "एक फाइल निवडा", changeButton: "बदला", removeButton: "काढा", storyTitle: "३. तुमची कथा सांगा", storyPlaceholder: "तुमची कथा येथे टाइप करण्यास प्रारंभ करा, किंवा रेकॉर्ड करण्यासाठी माइकवर क्लिक करा...", audioSuccess: "✓ कथा रेकॉर्ड केली", generateButton: "कथा तयार करा", refreshButton: "नवीन कथा सुरू करा", postButton: "कथा सामायिक करा", postSuccess: "✓ यशस्वीरित्या पोस्ट केले!", copySuccess: "✓ क्लिपबोर्डवर कॉपी केले!", logoutButton: "लॉग आउट", languageName: "Marathi", languageLabel: "भाषा", loginTitle: "पुन्हा स्वागत आहे", loginSubtitle: "पुढे जाण्यासाठी साइन इन करा", loginButton: "लॉगिन", loginNoAccount: "खाते नाही?", loginSignupLink: "नोंदणी करा", signupTitle: "खाते तयार करा", signupSubtitle: "कला-एआय समुदायात सामील व्हा", signupButton: "नोंदणी करा", signupHaveAccount: "आधीपासूनच खाते आहे?", signupLoginLink: "लॉगिन", socialDivider: "किंवा पुढे सुरू ठेवा" },
            gu: { appTitle: "કલા-એઆઈ", appSubtitle: "તમારી કારીગરીને જીવંત બનાવો.", imageGenTitle: "૧. AI વડે છબી બનાવો", imageGenPlaceholder: "તમે જે હસ્તકલા જોવા માંગો છો તેનું વર્ણન કરો, દા.ત., 'ફૂલોની પેટર્ન સાથે વાદળી માટીનો ફૂલદાની'...", generateImageButton: "છબી બનાવો", uploadTitle: "૨. છબી અપલોડ કરો", uploadLink: "એક ફાઇલ પસંદ કરો", changeButton: "બદલો", removeButton: "દૂર કરો", storyTitle: "૩. તમારી વાર્તા કહો", storyPlaceholder: "તમારી વાર્તા અહીં ટાઇપ કરવાનું શરૂ કરો, અથવા રેકોર્ડ કરવા માટે માઇક પર ક્લિક કરો...", audioSuccess: "✓ વાર્તા રેકોર્ડ થઈ", generateButton: "વાર્તા બનાવો", refreshButton: "નવી વાર્તા શરૂ કરો", postButton: "વાર્તા શેર કરો", postSuccess: "✓ સફળતાપૂર્વક પોસ્ટ કર્યું!", copySuccess: "✓ ક્લિપબોર્ડ પર કૉપિ કર્યું!", logoutButton: "લૉગ આઉટ", languageName: "Gujarati", languageLabel: "ભાષા", loginTitle: "ફરી સ્વાગત છે", loginSubtitle: "આગળ વધવા માટે સાઇન ઇન કરો", loginButton: "લોગિન", loginNoAccount: "ખાતું નથી?", loginSignupLink: "સાઇન અપ કરો", signupTitle: "ખાતું બનાવો", signupSubtitle: "કલા-એઆઈ સમુદાયમાં જોડાઓ", signupButton: "સાઇન અપ કરો", signupHaveAccount: "પહેલેથી જ ખાતું છે?", signupLoginLink: "લોગિન", socialDivider: "અથવા આની સાથે ચાલુ રાખો" }
        };
        
        // --- ALL FUNCTION DEFINITIONS ---
        
        async function updateLanguage(lang) {
            const oldLang = currentLanguage;
            currentLanguage = lang;
            const t = translations[lang] || translations['en'];
            document.querySelectorAll('[data-translate-key]').forEach(el => {
                const key = el.dataset.translateKey;
                if (t[key]) {
                    if(el.tagName === 'TEXTAREA') el.placeholder = t[key];
                    else el.textContent = t[key];
                }
            });

            if (originalInputText && oldLang !== currentLanguage) {
                await translateInputText(originalInputText, currentLanguage);
            }

            if(originalGeneratedStoryText && oldLang !== currentLanguage) {
                await translateStory(originalGeneratedStoryText, currentLanguage);
            }
        }

        async function translateInputText(textToTranslate, targetLang) {
            const originalText = typedStoryInput.value;
            typedStoryInput.value = "Translating your text...";
            typedStoryInput.disabled = true;

            const languageName = translations[targetLang].languageName;
            const prompt = `Translate the following text into ${languageName}. Text to translate: "${textToTranslate}"`;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
            const payload = { contents: [{ parts: [{ text: prompt }] }] };

            try {
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) throw new Error("Translation failed.");
                const result = await response.json();
                typedStoryInput.value = result.candidates[0].content.parts[0].text;
            } catch (error) {
                typedStoryInput.value = originalText;
                displayError("Could not translate your input text.");
            } finally {
                typedStoryInput.disabled = false;
            }
        }

        async function translateStory(textToTranslate, targetLang) {
            displayStory(`<div class="mx-auto spinner"></div>`);
            const languageName = translations[targetLang].languageName;
            const prompt = `Translate the following text into ${languageName}. Maintain the original markdown formatting (like ## for titles). The final output should be under 250 words. Text to translate: "${textToTranslate}"`;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
            const payload = { contents: [{ parts: [{ text: prompt }] }] };

            try {
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) throw new Error("Translation failed.");
                const result = await response.json();
                const translatedText = result.candidates[0].content.parts[0].text;
                lastGeneratedStoryText = translatedText;
                displayStory(translatedText);
            } catch (error) {
                displayError("Could not translate the story.");
            }
        }
        
        async function generateStory() {
            if (!geminiApiKey || geminiApiKey === "PASTE_YOUR_GOOGLE_AI_STUDIO_API_KEY_HERE") {
                displayError("Gemini API Key is not configured.");
                return;
            }
            const artisanStoryInput = typedStoryInput.value.trim();
            if (!imageData && !artisanStoryInput) {
                displayError("Please upload an image or provide a story first.");
                return;
            }
            setLoading(true);
            const languageName = translations[currentLanguage].languageName;
            let prompt = `You are a cultural marketing expert for Kalā-AI, writing compelling product stories for an international audience. Your goal is to spark curiosity about the culture and history behind an artisan's product. CRITICAL: The final story MUST be under 250 words. Be concise and evocative. Generate the entire response in ${languageName}.`;
            const parts = [];
            if (artisanStoryInput) {
                prompt += `\n\nUse the artisan's provided story as the primary source: "${artisanStoryInput}". Refine it into a polished, marketable narrative.`;
            }
            if (imageData) {
                if (artisanStoryInput) {
                    prompt += `\nEmbellish the story with visual details from the image.`;
                } else {
                    prompt += `\nInvent a plausible, beautiful backstory for the craft in the image.`;
                }
            }
            if (!imageData && artisanStoryInput) {
                prompt += `\nCreate a vivid story based entirely on the artisan's spoken or typed words, imagining the craft they are describing.`;
            }
            prompt += `\n\nStructure the output using markdown: - A short, captivating title (using ##). - A single paragraph for the story.`;
            parts.push({ text: prompt });
            if (imageData) {
                parts.push({ inline_data: { mime_type: "image/jpeg", data: imageData } });
            }
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
            const payload = { contents: [{ parts: parts }] };
            try {
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || `API Error: ${response.status}`);
                }
                const result = await response.json();
                const storyText = result.candidates[0].content.parts[0].text;
                originalGeneratedStoryText = storyText;
                lastGeneratedStoryText = storyText;
                displayStory(storyText);
                generateButton.classList.add('hidden');
                refreshButton.classList.remove('hidden');
                postButton.classList.remove('hidden');
            } catch (error) {
                displayError("Failed to generate story. " + error.message);
            } finally {
                setLoading(false);
            }
        }

        async function generateImage() {
            const prompt = imageGenPrompt.value;
            if (!prompt) {
                displayError("Please describe the image you want to create.");
                return;
            }
            imageGenSpinner.classList.remove('hidden');
            generateImageButton.disabled = true;
            generatedImageContainer.classList.add('hidden');
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiApiKey}`;
            const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } };
            try {
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) {
                    throw new Error("Failed to generate image. The service may be busy.");
                }
                const result = await response.json();
                if (result.predictions && result.predictions[0].bytesBase64Encoded) {
                    const base64Data = result.predictions[0].bytesBase64Encoded;
                    const imageUrl = `data:image/png;base64,${base64Data}`;
                    generatedImage.src = imageUrl;
                    generatedImageContainer.classList.remove('hidden');
                    imageData = base64Data;
                    previewImg.src = imageUrl;
                    imagePreviewContainer.classList.remove('hidden');
                    uploadPrompt.classList.add('hidden');
                } else {
                    throw new Error("Image data not found in API response.");
                }
            } catch (error) {
                displayError(error.message);
            } finally {
                imageGenSpinner.classList.add('hidden');
                generateImageButton.disabled = false;
            }
        }

        function handleShare() {
            socialShareLinks.classList.toggle('hidden');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = lastGeneratedStoryText;
            const storyText = tempDiv.textContent || tempDiv.innerText || "";
            const encodedText = encodeURIComponent(storyText.trim());
            const pageUrl = encodeURIComponent(window.location.href);
            document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?text=${encodedText}`;
            document.getElementById('facebook-share').href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${encodedText}`;
            document.getElementById('whatsapp-share').href = `https://api.whatsapp.com/send?text=${encodedText}`;
            document.getElementById('email-share').href = `mailto:?subject=A Story from Kalā-AI&body=${encodedText}`;
        }

        function handleCopy() {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = lastGeneratedStoryText;
            const storyTextToCopy = tempDiv.textContent || tempDiv.innerText || "";
            navigator.clipboard.writeText(storyTextToCopy.trim()).then(() => {
                copySuccessMessage.classList.remove('hidden');
                copySuccessMessage.classList.add('fade-in');
                setTimeout(() => {
                    copySuccessMessage.classList.add('fade-out');
                    setTimeout(() => {
                        copySuccessMessage.classList.add('hidden');
                        copySuccessMessage.classList.remove('fade-in', 'fade-out');
                    }, 3000);
                }, 100);
            });
        }

        function resetInterface() {
            imagePreviewContainer.classList.add('hidden');
            uploadPrompt.classList.remove('hidden');
            previewImg.src = '';
            imageUploadInput.value = '';
            audioPlayback.classList.add('hidden');
            audioPlayer.src = '';
            typedStoryInput.value = '';
            resultContainer.classList.add('hidden');
            postButton.classList.add('hidden');
            socialShareLinks.classList.add('hidden');
            copySuccessMessage.classList.add('hidden');
            imageData = null;
            audioData = null;
            lastGeneratedStoryText = null;
            originalGeneratedStoryText = null;
            originalInputText = "";
            refreshButton.classList.add('hidden');
            generateButton.classList.remove('hidden');
        }

        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) { return; }
            if (file.size > 10 * 1024 * 1024) { displayError("File is too large (max 10MB)."); return; }
            const reader = new FileReader();
            reader.onloadend = () => {
                previewImg.src = reader.result;
                imageData = reader.result.split(',')[1];
                imagePreviewContainer.classList.remove('hidden');
                uploadPrompt.classList.add('hidden');
                clearMessages();
            };
            reader.readAsDataURL(file);
        }

        function removeImage() {
            imagePreviewContainer.classList.add('hidden');
            uploadPrompt.classList.remove('hidden');
            previewImg.src = '';
            imageUploadInput.value = '';
            imageData = null;
        }
        
        function displayStory(text) { 
            clearMessages();
            resultContainer.classList.remove('hidden');
            let htmlContent = text.replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/\* \s*(.*$)/gim, '<li>$1</li>').replace(/(\r\n|\n|\r)/gm, '<br>').replace(/(<li>.*<\/li>)+/gs, '<ul>$&</ul>').replace(/<\/ul><br><ul>/g, '');
            storyOutput.innerHTML = htmlContent;
            storyOutput.classList.remove('hidden');
        }

        function displayError(message) { 
            clearMessages();
            resultContainer.classList.remove('hidden');
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
        }

        function setLoading(isLoading) { 
            const t = translations[currentLanguage] || translations['en'];
            if (isLoading) {
                generateButton.disabled = true;
                generateButton.innerHTML = `<div class="mx-auto spinner"></div>`;
                resultContainer.classList.remove('hidden');
                loader.classList.remove('hidden');
                clearMessages();
            } else {
                generateButton.disabled = false;
                generateButton.textContent = t.generateButton;
                loader.classList.add('hidden');
            }
        }

        function clearMessages() { 
            resultContainer.classList.add('hidden');
            storyOutput.classList.add('hidden');
            errorMessage.classList.add('hidden');
            storyOutput.innerHTML = '';
            errorMessage.textContent = '';
        }
        
        async function startRecording() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                audioChunks = [];
                
                recordButton.classList.add('hidden');
                stopButton.classList.remove('hidden');
                recordingStatus.classList.remove('hidden');
                audioPlayback.classList.add('hidden');
                typedStoryInput.disabled = true;

                let seconds = 0;
                recordingTimer.textContent = `Recording... 0:00`;
                timerInterval = setInterval(() => {
                    seconds++;
                    const min = Math.floor(seconds / 60);
                    const sec = seconds % 60;
                    recordingTimer.textContent = `Recording... ${min}:${sec.toString().padStart(2, '0')}`;
                }, 1000);

                mediaRecorder.addEventListener("dataavailable", event => audioChunks.push(event.data));
                mediaRecorder.addEventListener("stop", () => {
                    audioData = new Blob(audioChunks, { 'type' : 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioData);
                    audioPlayer.src = audioUrl;

                    recordingStatus.classList.add('hidden');
                    stopButton.classList.add('hidden');
                    recordButton.classList.remove('hidden');
                    audioPlayback.classList.remove('hidden');
                    clearInterval(timerInterval);
                    typedStoryInput.disabled = false;
                    
                    stream.getTracks().forEach(track => track.stop());
                    transcribeAudio(audioData);
                });
            } catch (err) {
                displayError("Microphone access was denied. Please enable it in your browser settings.");
            }
        }
        function stopRecording() {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
        }
        async function transcribeAudio(audioBlob) {
            typedStoryInput.value = "Transcribing your story...";
            
            const audioBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
            });

            const prompt = "Transcribe the following audio recording.";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
            const payload = { contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "audio/webm", data: audioBase64 } }] }] };

            try {
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) throw new Error("Failed to transcribe audio.");
                const result = await response.json();
                const transcribedText = result.candidates[0].content.parts[0].text;
                originalInputText = transcribedText;
                typedStoryInput.value = transcribedText;
            } catch (error) {
                typedStoryInput.value = "Could not transcribe audio. Please try again or type your story.";
            }
        }

        // --- ALL EVENT LISTENERS ---
        auth.onAuthStateChanged(user => {
            if (user) {
                userDisplayName.textContent = user.displayName || "Artisan";
                userEmailDisplay.textContent = user.email || "";
                loginModal.classList.add('hidden');
                mainApp.classList.remove('hidden');
            } else {
                mainApp.classList.add('hidden');
                loginModal.classList.remove('hidden');
            }
        });
        loginForm.addEventListener('submit', e => { e.preventDefault(); auth.signInWithEmailAndPassword(document.getElementById('login-email').value, document.getElementById('login-password').value).catch(error => { authError.textContent = error.message; authError.classList.remove('hidden'); }); });
        signupForm.addEventListener('submit', e => { e.preventDefault(); const name = document.getElementById('signup-name').value; const email = document.getElementById('signup-email').value; const password = document.getElementById('signup-password').value; auth.createUserWithEmailAndPassword(email, password).then(cred => cred.user.updateProfile({ displayName: name })).catch(error => { authError.textContent = error.message; authError.classList.remove('hidden'); }); });
        googleLoginBtn.addEventListener('click', () => { auth.signInWithPopup(googleProvider).catch(error => { authError.textContent = error.message; authError.classList.remove('hidden'); }); });
        logoutButton.addEventListener('click', () => { lastGeneratedStoryText = null; originalGeneratedStoryText = null; auth.signOut(); });
        showSignup.addEventListener('click', (e) => { e.preventDefault(); authError.classList.add('hidden'); loginView.classList.add('hidden'); signupView.classList.remove('hidden'); });
        showLogin.addEventListener('click', (e) => { e.preventDefault(); authError.classList.add('hidden'); signupView.classList.add('hidden'); loginView.classList.remove('hidden'); });
        userMenuButton.addEventListener('click', (e) => { e.stopPropagation(); userMenu.classList.toggle('hidden'); });
        window.addEventListener('click', (e) => { if (!userMenuButton.contains(e.target)) userMenu.classList.add('hidden'); });
        languageSelector.addEventListener('change', (e) => updateLanguage(e.target.value));
        uploadPrompt.addEventListener('click', () => imageUploadInput.click());
        changeImageButton.addEventListener('click', () => imageUploadInput.click());
        removeImageButton.addEventListener('click', removeImage);
        imageUploadInput.addEventListener('change', handleImageUpload);
        recordButton.addEventListener('click', startRecording);
        stopButton.addEventListener('click', stopRecording);
        typedStoryInput.addEventListener('input', () => {
            originalInputText = typedStoryInput.value;
        });
        generateButton.addEventListener('click', generateStory);
        refreshButton.addEventListener('click', resetInterface);
        postButton.addEventListener('click', handleShare);
        copyButton.addEventListener('click', handleCopy);
        
        // Initial language setup
        updateLanguage('en');
});