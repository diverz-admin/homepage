import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @typedef CardItem
 * @property {string | number} id - Unique identifier for the card.
 * @property {string} title - The main title text of the card.
 * @property {string} subtitle - The subtitle or category text.
 * @property {string} imageUrl - The URL for the card's background image.
 * @property {string} [description] - Optional body copy shown under the title.
 * @property {string} [href] - Optional link target; renders the card as a link.
 */
export interface CardItem {
  id: string | number;
  title: string;
  subtitle: string;
  imageUrl: string;
  description?: string;
  href?: string;
}

/**
 * @typedef HoverRevealCardsProps
 * @property {CardItem[]} items - An array of card item objects to display.
 * @property {string} [className] - Optional additional class names for the container.
 * @property {string} [cardClassName] - Optional additional class names for individual cards.
 */
export interface HoverRevealCardsProps {
  items: CardItem[];
  className?: string;
  cardClassName?: string;
}

/**
 * A component that displays a grid of cards with a hover-reveal effect.
 * When a card is hovered or focused, it stands out while others are de-emphasized.
 */
const HoverRevealCards: React.FC<HoverRevealCardsProps> = ({
  items,
  className,
  cardClassName,
}) => {
  return (
    // The `group` class on the container enables styling children on parent hover.
    <div
      role="list"
      className={cn(
        "group grid w-full max-w-6xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-4",
        className
      )}
    >
      {items.map((item) => {
        const cardClasses = cn(
          "relative h-80 cursor-pointer overflow-hidden bg-cover bg-center shadow-lg transition-all duration-500 ease-in-out",
          // On parent hover, apply these styles to all children.
          "group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px]",
          // On child hover/focus, override parent hover styles to highlight the current item.
          // The `!` is used to ensure these styles take precedence.
          "hover:!scale-105 hover:!opacity-100 hover:!blur-none focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none",
          // Accessibility: Add focus ring using theme variables.
          "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          // 모션 최소화 사용자에게는 확대·블러 전환을 끈다.
          "motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:opacity-100 motion-reduce:group-hover:blur-none",
          cardClassName
        );
        const ariaLabel = item.description
          ? `${item.title}, ${item.subtitle}. ${item.description}`
          : `${item.title}, ${item.subtitle}`;

        // Gradient overlay for text contrast, a standard UI practice for text on images.
        // description까지 얹히면 글이 3~4줄로 늘어나므로 아래쪽을 더 눌러
        // 어떤 사진 위에서도 읽히게 한다.
        const content = (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="text-sm font-light tracking-widest uppercase opacity-80">
                {item.subtitle}
              </p>
              {/* 원본은 `text-2l` 이었는데 그런 Tailwind 클래스가 없어 제목이
                  본문 크기로 렌더됐다. 의도대로 text-2xl 로 고쳤다. */}
              <h3 className="mt-1 text-2xl font-bold">{item.title}</h3>
              {item.description && (
                <p className="mt-3 text-sm leading-relaxed break-keep text-white/80">
                  {item.description}
                </p>
              )}
            </div>
          </>
        );

        return item.href ? (
          <Link
            key={item.id}
            href={item.href}
            role="listitem"
            aria-label={ariaLabel}
            className={cardClasses}
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          >
            {content}
          </Link>
        ) : (
          <div
            key={item.id}
            role="listitem"
            aria-label={ariaLabel}
            tabIndex={0} // Makes the div focusable for keyboard navigation.
            className={cardClasses}
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default HoverRevealCards;
