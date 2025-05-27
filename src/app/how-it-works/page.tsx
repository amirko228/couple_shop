import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      title: "Выберите товар или загрузите свой дизайн",
      description:
        "Просмотрите наш каталог готовых дизайнов или загрузите собственное изображение для создания уникальной футболки или худи.",
      icon: "🎨",
    },
    {
      id: 2,
      title: "Мы создадим ваш дизайн",
      description:
        "Наши дизайнеры обработают ваше изображение и подготовят его для нанесения на одежду. Мы свяжемся с вами для согласования деталей.",
      icon: "✏️",
    },
    {
      id: 3,
      title: "Произведем печать",
      description:
        "Мы используем современное оборудование и качественные материалы для создания стойкого и яркого принта, который сохранит свой вид даже после множества стирок.",
      icon: "🖨️",
    },
    {
      id: 4,
      title: "Доставим ваш заказ",
      description:
        "Мы упакуем и отправим ваш заказ в течение 1-3 рабочих дней. Вы получите трек-номер для отслеживания доставки.",
      icon: "🚚",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Как это работает
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Создание уникальной одежды с вашим дизайном - это просто. Следуйте этим шагам, чтобы получить свою идеальную футболку или худи.
        </p>

        <div className="space-y-10 mb-16">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-3xl">
                {step.icon}
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <span className="text-pink-500 mr-2">Шаг {step.id}:</span> {step.title}
                </h2>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block h-12 w-0.5 bg-gray-200 ml-8 mt-4"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-pink-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы создать свой уникальный дизайн?</h2>
          <p className="text-gray-600 mb-6">
            Выберите готовый дизайн из нашего каталога или загрузите свое изображение.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/catalog/tshirts"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition duration-300 inline-flex items-center"
            >
              Выбрать из каталога <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/custom-print"
              className="bg-white border border-pink-500 text-pink-500 hover:bg-pink-50 px-6 py-3 rounded-full font-medium transition duration-300"
            >
              Загрузить свой дизайн
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 