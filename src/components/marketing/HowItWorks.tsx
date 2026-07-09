import Container from "@/components/ui/Container";

const STEPS = [
  {
    num: "01",
    icon: "🎨",
    title: "Template tanlang",
    desc: "To'y yoki qiz bazmi uchun 6 ta chiroyli dizayndan birini tanlang. Preview orqali to'liq ko'rishingiz mumkin.",
  },
  {
    num: "02",
    icon: "💬",
    title: "Telegram orqali buyurtma",
    desc: "Telegram botimizga o'ting. Bot sizdan ismlar, sana, manzil, musiqa va boshqa ma'lumotlarni so'raydi. To'lovni adminimiz kartasiga o'tkazing.",
  },
  {
    num: "03",
    icon: "🚀",
    title: "Tayyor link oling",
    desc: "24 soat ichida shaxsiy taklifnoma saytingiz tayyor. Linkni do'stlaringiz bilan ulashing!",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-gray-950">
      <Container>
        {/* Sarlavha */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#C9A84C] uppercase">
            ✦ Jarayon ✦
          </span>
          <h2 className="mt-3 text-4xl font-serif italic text-[#2C1810] dark:text-white">
            Qanday ishlaydi?
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Atigi 3 qadam — va sizning taklifnomangiz tayyor
          </p>
        </div>

        {/* Qadamlar */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Ulovchi chiziq */}
          <div className="absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-30 hidden md:block" />

          {STEPS.map((step, i) => (
            <div key={i} className="relative text-center group">
              {/* Raqam */}
              <div className="relative inline-block mb-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md group-hover:shadow-lg transition-shadow"
                  style={{
                    background:
                      "linear-gradient(135deg, #FAF7F2 0%, #F0EAE0 100%)",
                    border: "2px solid #C9A84C20",
                  }}
                >
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <span
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B1A1A, #6B0F0F)",
                  }}
                >
                  {i + 1}
                </span>
              </div>

              <h3 className="font-bold text-[#2C1810] dark:text-white text-lg mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
