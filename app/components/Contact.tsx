export default function Contact() {
  const contacts = [
    { label: 'thomasnowprod@proton.me', href: 'mailto:thomasnowprod@proton.me' },
    { label: 'github.com/thomasboom', href: 'https://github.com/thomasboom' },
    { label: '@thomasnowprod', href: 'https://bsky.app/profile/thomasnowprod.bsky.social' },
  ];

  return (
    <section className="section" id="contact">
      <div className="section-header">
        <h2 className="section-title">04 — CONTACT</h2>
        <span className="section-line"></span>
      </div>
      <div className="contact-list">
        {contacts.map((contact) => (
          <div className="contact-item" key={contact.href}>
            <a href={contact.href} target="_blank" rel="noopener noreferrer">
              {contact.label}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
