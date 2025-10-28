import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Welcome View
      welcome: {
        title: 'AI Interview Coach',
        subtitle: 'Practice interviews with AI-powered coaching. Get personalized feedback and improve your skills.',
        getStarted: 'Get Started',
        features: {
          personalizedQuestions: {
            title: 'Personalized Questions',
            description: 'Questions tailored to your CV and target role for realistic practice',
          },
          realTimeFeedback: {
            title: 'Real-time Feedback',
            description: 'Get instant constructive feedback after each answer',
          },
          detailedReports: {
            title: 'Detailed Reports',
            description: 'Receive comprehensive performance analysis at the end',
          },
        },
        footer: 'Powered by LiveKit & Advanced AI Technology',
      },
      // Upload View
      upload: {
        title: 'Upload Your CV',
        subtitle: 'Upload your CV so we can personalize your interview experience',
        dragDrop: 'Click to upload or drag and drop',
        fileTypes: 'PDF, DOC, or DOCX (max 10MB)',
        browseFiles: 'Browse Files',
        uploadSuccess: 'File uploaded successfully!',
        uploadDifferent: 'Upload Different File',
        note: 'Your CV is used only for this session and is not stored permanently.',
        continue: 'Continue to Interview',
        starting: 'Starting Interview...',
      },
      // Session View
      session: {
        states: {
          listening: 'Listening...',
          thinking: 'Thinking...',
          speaking: 'Speaking...',
          ready: 'Ready',
        },
        help: 'Speak naturally - the AI coach is listening',
        endCall: 'End Call',
      },
      // Error Messages
      error: {
        title: 'Connection Error',
        troubleshooting: 'Troubleshooting:',
        serverRunning: 'Make sure the backend server is running at',
        checkCredentials: 'Check that your LiveKit credentials are configured in the .env file',
        verifyInternet: 'Verify your internet connection',
        retry: 'Retry Connection',
      },
      // Header
      header: {
        language: 'Language',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
    },
  },
  ar: {
    translation: {
      // Welcome View
      welcome: {
        title: 'مدرب المقابلات بالذكاء الاصطناعي',
        subtitle: 'تدرب على المقابلات مع التدريب بالذكاء الاصطناعي. احصل على ملاحظات شخصية وطور مهاراتك.',
        getStarted: 'ابدأ الآن',
        features: {
          personalizedQuestions: {
            title: 'أسئلة مخصصة',
            description: 'أسئلة مصممة خصيصًا لسيرتك الذاتية والوظيفة المستهدفة لممارسة واقعية',
          },
          realTimeFeedback: {
            title: 'ملاحظات فورية',
            description: 'احصل على ملاحظات بناءة فورية بعد كل إجابة',
          },
          detailedReports: {
            title: 'تقارير مفصلة',
            description: 'احصل على تحليل شامل للأداء في النهاية',
          },
        },
        footer: 'مدعوم من LiveKit وتكنولوجيا الذكاء الاصطناعي المتقدمة',
      },
      // Upload View
      upload: {
        title: 'ارفع سيرتك الذاتية',
        subtitle: 'ارفع سيرتك الذاتية حتى نتمكن من تخصيص تجربة المقابلة',
        dragDrop: 'انقر للتحميل أو اسحب وأفلت',
        fileTypes: 'PDF أو DOC أو DOCX (بحد أقصى 10 ميجابايت)',
        browseFiles: 'تصفح الملفات',
        uploadSuccess: 'تم رفع الملف بنجاح!',
        uploadDifferent: 'رفع ملف مختلف',
        note: 'تُستخدم سيرتك الذاتية فقط لهذه الجلسة ولا يتم تخزينها بشكل دائم.',
        continue: 'المتابعة إلى المقابلة',
        starting: 'جاري بدء المقابلة...',
      },
      // Session View
      session: {
        states: {
          listening: 'يستمع...',
          thinking: 'يفكر...',
          speaking: 'يتحدث...',
          ready: 'جاهز',
        },
        help: 'تحدث بشكل طبيعي - المدرب الذكي يستمع',
        endCall: 'إنهاء المكالمة',
      },
      // Error Messages
      error: {
        title: 'خطأ في الاتصال',
        troubleshooting: 'استكشاف الأخطاء:',
        serverRunning: 'تأكد من تشغيل خادم الواجهة الخلفية على',
        checkCredentials: 'تحقق من تكوين بيانات اعتماد LiveKit في ملف .env',
        verifyInternet: 'تحقق من اتصالك بالإنترنت',
        retry: 'إعادة المحاولة',
      },
      // Header
      header: {
        language: 'اللغة',
        theme: 'المظهر',
        light: 'فاتح',
        dark: 'داكن',
        system: 'النظام',
      },
    },
  },  
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
