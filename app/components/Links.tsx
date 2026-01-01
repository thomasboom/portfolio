'use client';

export default function Links() {
  const links = [
    { label: 'GitHub', url: 'https://github.com/thomasboom', icon: 'GH' },
    { label: 'Mastodon', url: 'https://mastodon.social/@thomasnow', icon: 'MA' },
    { label: 'Bluesky', url: 'https://bsky.app/profile/thomasnowprod.bsky.social', icon: 'BS' },
    { label: 'Email', url: 'mailto:thomasnowprod@proton.me', icon: '@' },
  ];

  return (
    <div className="links">
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="links-link">
          <span className="links-icon">{link.icon}</span>
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}
