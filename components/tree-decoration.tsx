'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

type TreeDecorationProps = {
  side?: 'left' | 'right';
  src?: string;
};

const DEFAULT_SRC = {
  left: '/ganeshji-left5.png',
  right: '/ganeshji-right.png',
};

export function TreeDecoration({
  side = 'right',
  src,
}: TreeDecorationProps) {
  const isLeft = side === 'left';
  const imageSrc = src ?? DEFAULT_SRC[side];

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-y-0 z-0 hidden w-[40vw] overflow-hidden lg:block"
      style={isLeft ? { left: 0 } : { right: 0 }}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={false}
        sizes="40vw"
        className="object-cover"
        style={{
          objectPosition: isLeft ? 'left center' : 'right center',
        }}
      />
    </motion.div>
  );
}