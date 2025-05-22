import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

// Configure marked options for security and features
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
  smartLists: true,
  smartypants: true
});

export function markdownToHTML(text: string): string {
  // First convert markdown to HTML
  const rawHTML = marked(text);
  
  // Then sanitize the HTML to prevent XSS
  const cleanHTML = DOMPurify.sanitize(rawHTML, {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
      'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'hr', 'img', 'del', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
  });

  return cleanHTML;
} 