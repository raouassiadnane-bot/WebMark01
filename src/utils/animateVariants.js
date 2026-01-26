export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  out: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

export const feedbackVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
}
