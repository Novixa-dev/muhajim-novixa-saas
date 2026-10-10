import React, { useState } from 'react';
import { Cpu, ShieldCheck, Zap, Globe, Layers, HelpCircle, ChevronDown } from 'lucide-react';
import { TranslationKeys } from '../i18n/translations';

interface SeoSectionProps {
  t: TranslationKeys;
}

export const SeoSection: React.FC<SeoSectionProps> = ({ t }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="mt-16 glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800/80 space-y-10">
      
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5" />
          <span>Programmatic i18n SEO Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-tight">
          {t.seoTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Feature 1 */}
        <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-200">100% In-Browser Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.seoParagraph1}
          </p>
        </div>

        {/* Feature 2 */}
        <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Social & Store Presets</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.seoParagraph2}
          </p>
        </div>

        {/* Feature 3 */}
        <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Absolute Privacy & Speed</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.seoParagraph3}
          </p>
        </div>

      </div>

      {/* Structured Comparison Table for WebP vs SVG vs AVIF vs JPG vs PNG vs PDF vs ICO */}
      <div className="pt-6 border-t border-slate-800/80">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>مقارنة صيغ الصور الرقمية والتحويل المتاح في مُحجِّم</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start text-slate-400">
            <thead className="bg-slate-900/80 text-slate-200 font-bold uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">الصيغة (Format)</th>
                <th className="px-4 py-3">نسبة تقليص الحجم / الأداء</th>
                <th className="px-4 py-3">دعم الشفافية</th>
                <th className="px-4 py-3">أفضل استخدام وحالات عملية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3 font-bold text-cyan-400">WEBP</td>
                <td className="px-4 py-3 text-emerald-400">فائق الارتفاع (-80% إلى -92%)</td>
                <td className="px-4 py-3 text-emerald-400">نعم (Alpha)</td>
                <td className="px-4 py-3 text-slate-300">متاجر سلة، زد، شوبيفاي، ومواقع الويب فائقة السرعة</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3 font-bold text-indigo-400">SVG</td>
                <td className="px-4 py-3 text-cyan-300">متجهي قابل للتكبير دون فقدان الدقة</td>
                <td className="px-4 py-3 text-emerald-400">نعم (Vector Alpha)</td>
                <td className="px-4 py-3 text-slate-300">الشعارات، الرسوم البيانية، التصاميم الهندسية، والويب</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3 font-bold text-violet-400">AVIF</td>
                <td className="px-4 py-3 text-emerald-400">الجيل القادم (-85% إلى -95%)</td>
                <td className="px-4 py-3 text-emerald-400">نعم (HDR + Alpha)</td>
                <td className="px-4 py-3 text-slate-300">أحدث صيغة لضغط الصور بجودة استثنائية لأحدث المتصفحات</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3 font-bold text-amber-400">JPEG / JPG</td>
                <td className="px-4 py-3 text-emerald-400">عالي (-50% إلى -70%)</td>
                <td className="px-4 py-3 text-rose-400">لا</td>
                <td className="px-4 py-3 text-slate-300">الصور الفوتوغرافية، الجوازات الرسمية، ومنشورات السوشيال</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3 font-bold text-sky-400">PNG</td>
                <td className="px-4 py-3 text-amber-400">ضغط غير فقود (-15% إلى -30%)</td>
                <td className="px-4 py-3 text-emerald-400">نعم (Full Alpha)</td>
                <td className="px-4 py-3 text-slate-300">الصور الشفافة، الأيقونات، والرسومات الدقيقة</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3 font-bold text-rose-400">PDF</td>
                <td className="px-4 py-3 text-slate-300">مستند رسمي 72/300 DPI</td>
                <td className="px-4 py-3 text-slate-400">خلفية معيارية</td>
                <td className="px-4 py-3 text-slate-300">معاملات السفر، التأشيرات، الهويات الحكومية، والطباعة</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3 font-bold text-teal-400">ICO</td>
                <td className="px-4 py-3 text-slate-300">أيقونة متعددة المقاسات</td>
                <td className="px-4 py-3 text-emerald-400">نعم</td>
                <td className="px-4 py-3 text-slate-300">أيقونات المفضلة للمواقع (Favicon) وبرمجيات سطح المكتب</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="pt-6 border-t border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-slate-100">الأسئلة الشائعة والأكثر بحثاً (FAQ)</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'هل عملية تغيير مقاس وضغط الصور آمنة بنسبة 100%؟',
              a: 'نعم بالتأكيد! يعتمد موقع مُحجِّم على تقنية المعالجة المحلية من طرف العميل (Client-Side In-Browser Engine). صورك وملفاتك لا ترفع إلى أي خادم خارجي نهائياً، بل تتم معالجتها بالكامل على معالج الرسوميات والرام الخاص بجهازك.',
            },
            {
              q: 'كيف أستخدم ميزة توضيح وتحسين الصور غير الواضحة (Enhance Clarity)؟',
              a: 'قم بتفعيل زر "تفعيل التوضيح" من لوحة التحكم، واختر النمط المناسب لصورتك: "توضيح ذكي" للصور العامة، أو "نصوص ووثائق" لتغميق الكلمات وتبييض الورق للهويات والإيصالات الباهتة، أو "وجوه وبورتريه" لتنقية الشوائب وتوضيح الملامح. يمكنك أيضاً ضبط شريط مستوى الحدة والتباين حسب رغبتك.',
            },
            {
              q: 'هل يمكنني تحويل الصور إلى صيغ SVG أو AVIF أو ICO أو PDF؟',
              a: 'نعم! يدعم مُحجِّم التحويل الفوري بين جميع الصيغ: WEBP، JPG، PNG، SVG، AVIF، ICO (Favicon)، PDF (مستند جاهز للطباعة)، و BMP بضغطة زر واحدة.',
            },
            {
              q: 'كيف أستخدم الموقع لتسريع متجري الإلكتروني على سلة، زد، أو شوبيفاي؟',
              a: 'ننصح باختيار قالب "متاجر سلة وزد" (1000×1000 بكسل) مع اختيار صيغة WEBP وجودة ضغط بين 80% إلى 85%. هذا يقلل حجم صور منتجاتك بنسبة تصل إلى 90%، مما يجعل متجرك يفتح في أقل من ثانية واحدة ويرفع مبيعاتك.',
            },
            {
              q: 'كيف يمكنني ضبط حجم صورة الجواز أو الهوية لتكون أقل من 100 كيلوبايت؟',
              a: 'اختر تبويب "الهوية والجوازات (Gov)" من لوحة التحكم، ثم حدد مقاس جواز السفر أو الهوية المطلوبة، وسيقوم المحرك تلقائياً بضغط الصورة وضمان بقائها أقل من 100KB أو 200KB حسب شروط السفارات والمواقع الحكومية.',
            },
            {
              q: 'هل يمكنني تغيير مقاس وضغط عدة صور دفعة واحدة؟',
              a: 'نعم! يمكنك سحب وإفلات عشرات الصور معاً في منطقة الرفع، ثم الضغط على زر "معالجة وتجهيز جميع الصور"، وسيتم ضغطها جميعاً وتوفير زر لتحميلها كملف مضغوط ZIP بنقرة واحدة.',
            },
            {
              q: 'هل الموقع متوافق مع شاشات الهواتف الذكية ويعمل بدون استهلاك باقة الإنترنت؟',
              a: 'نعم! تصميم مُحجِّم متجاوب بنسبة 100% ومصمم خصيصاً ليمنح مستخدمي الجوال تجربة سلسة تشبه التطبيقات الأصلية. وبما أن المعالجة تتم داخل المتصفح، فلن تستهلك باقة بياناتك لرفع وتنزيل صور كبيرة الحجم.',
            },
          ].map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-start font-bold text-xs sm:text-sm text-slate-200 flex items-center justify-between gap-3 hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
