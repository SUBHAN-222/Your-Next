const HIGHLIGHT_PATTERN =
  /(interesting|your direction|stuck|path|goal|YourNext|excites|guide you|learning)/gi

/**
 * Wraps key phrases in gradient accent spans for quiz headings.
 */
export function renderGradientTitle(text) {
  if (!text) return null

  const parts = []
  let lastIndex = 0
  let match

  const regex = new RegExp(HIGHLIGHT_PATTERN.source, HIGHLIGHT_PATTERN.flags)
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <span key={`${match.index}-${match[0]}`} className="gradient-text">
        {match[0]}
      </span>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}
