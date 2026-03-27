import React from "react";

export default function Footer() {
  return (
    <footer className="footer-letter-wrap ">
      <div className="footer-letter-paper">
        <div className="footer-letter-inner">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10 lg:items-start">
            {/* Left: Matters of service */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <h4 className="footer-dark-label mb-6">Matters of service</h4>
              <ul className="space-y-3 text-sm footer-dark-body">
                <li>
                  <a href="#" className="footer-dark-link">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-dark-link">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-dark-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Center: letter + newsletter */}
            <div className="order-1 lg:order-2 space-y-6 text-center lg:text-center max-w-md mx-auto w-full">
              <p className="footer-dark-greeting text-sm italic mb-2">
                Dear reader,
              </p>
              <div className="footer-dark-heading text-2xl md:text-3xl font-normal serif">
                OBSCURA
              </div>
              <p className="footer-dark-body max-w-md mx-auto">
                If you wish to hear of new releases and archival pieces, leave
                your direction below—we shall write when there is news worth the
                ink.
              </p>
              <div className="mt-8 flex max-w-md mx-auto flex-col sm:flex-row gap-0 border border-white/15 bg-black/25 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] rounded-sm">
                <input
                  type="email"
                  placeholder="Your correspondence…"
                  className="footer-dark-input flex-1 px-4 py-3 text-sm min-w-0 rounded-sm"
                />
                <button
                  type="button"
                  className="footer-dark-btn px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors sm:shrink-0 rounded-sm"
                >
                  Send
                </button>
              </div>
              <p className="footer-dark-greeting text-sm italic mt-10 mb-1">
                Yours faithfully,
              </p>
              <p className="footer-dark-heading text-lg serif">
                The house of Aura
              </p>
            </div>

            {/* Right: Social */}
            <div className="order-3 text-center lg:text-right">
              <h4 className="footer-dark-label mb-6">Elsewhere</h4>
              <ul className="space-y-3 text-sm footer-dark-body">
                <li>
                  <a href="#" className="footer-dark-link">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-dark-link">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-dark-link">
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-dark-signature mt-14 pt-8 text-center">
            &copy; {new Date().getFullYear()} Aura Essentials. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
