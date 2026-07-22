const parseInlineMarkdown = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts;
};
console.log(JSON.stringify(parseInlineMarkdown("It's the free, 5-minute version of the *Sensory Audit Workbook*."), null, 2));
