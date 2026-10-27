import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// **bold**, *italic*, `code`, [a link](/somewhere) and ![a picture](/images/…)
const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|!?\[[^\]]*\]\([^)\s]+\))/g;
const LINK = /^(!?)\[([^\]]*)\]\(([^)\s]+)\)$/;

const renderLink = (text: ReactNode, href: string, key: number) => {
    // A path in the app opens over the board, so the music keeps going; anything else is another site or a file
    if (/^\/(?!projects\/|downloads\/|images\/|music\/)[^.]*$/.test(href)) {
        return (
            <Link key={key} to={href}>
                {text}
            </Link>
        );
    }
    return (
        <a key={key} href={href} target='_blank' rel='noreferrer'>
            {text}
        </a>
    );
};

const renderInline = (text: string): ReactNode[] =>
    text.split(INLINE).map((part, i) => {
        if (i % 2 === 0) return part;
        if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
        const link = LINK.exec(part);
        if (link) return link[1] ? <img key={i} src={link[3]} alt={link[2]} loading='lazy' /> : renderLink(link[2], link[3], i);
        return <em key={i}>{part.slice(1, -1)}</em>;
    });

/**
 * The little Markdown the dev log's posts use: paragraphs, ## headings, - lists, pictures on a line
 * of their own, and bold, italic, code and links inside them. Rendered as elements, never as HTML.
 */
export const Markdown = ({ text, className }: { text: string; className?: string }) => (
    <div className={className}>
        {text.split(/\n{2,}/).map((block, i) => {
            const lines = block.split('\n').map((line) => line.trim());
            const heading = /^#{1,3}\s+(.*)$/.exec(lines[0]);
            if (heading && lines.length === 1) return <h4 key={i}>{renderInline(heading[1])}</h4>;
            if (lines.every((line) => /^[-*]\s+/.test(line))) {
                return (
                    <ul key={i}>
                        {lines.map((line, j) => (
                            <li key={j}>{renderInline(line.replace(/^[-*]\s+/, ''))}</li>
                        ))}
                    </ul>
                );
            }
            const picture = lines.length === 1 && /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(lines[0]);
            if (picture) {
                return (
                    <figure key={i}>
                        <img src={picture[2]} alt={picture[1]} loading='lazy' />
                    </figure>
                );
            }
            return <p key={i}>{renderInline(lines.join(' '))}</p>;
        })}
    </div>
);
