export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="font-semibold mb-3">About Us</h3>
          <ul className="space-y-2">
            <li>Kendra&apos;s Story</li>
            <li>The Kendra Scott Foundation</li>
            <li>Careers</li>
            <li>Refer a Friend</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold mb-3">Need help?</h3>
          <p>Monday – Friday 8am – 5pm CT</p>
          <p>Saturday – Sunday 12pm – 5pm CT</p>
          <p className="mt-2">(866) 677-7023</p>
          <p>service@kendrascott.com</p>

          <ul className="space-y-2 mt-3">
            <li>Find a Store</li>
            <li>Book a Virtual Appointment</li>
            <li>Buy A Gift Card</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold mb-3">Your Order</h3>
          <ul className="space-y-2">
            <li>Order Status</li>
            <li>Shipping & Returns</li>
            <li>Terms & Conditions</li>
            <li>International Orders</li>
            <li>Corporate Orders</li>
          </ul>
        </div>

        {/* Column 4 Newsletter */}
        <div>
          <h3 className="font-semibold mb-3">
            Get 15% off your next purchase.
          </h3>
          <p className="text-xs mb-3">Cannot be combined with other offers.</p>

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="text"
            placeholder="Zip Code"
            className="w-full border p-2 mb-2 rounded"
          />

          <button className="w-full bg-black text-white py-2 rounded">
            Sign Up
          </button>

          <p className="text-[11px] mt-2">
            By clicking Sign Up, you agree to Terms & Privacy Policy.
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t mt-8 py-6 text-center text-xs px-6">
        <p className="mb-2 font-medium">Shine Bright, Do Good</p>
        <p className="mb-4">Every purchase supports women and youth causes.</p>

        <div className="flex flex-wrap justify-center gap-4 mb-3">
          <span>Privacy Policy</span>
          <span>Accessibility</span>
          <span>Sitemap</span>
          <span>Cookie Preferences</span>
          <span>Do Not Sell Info</span>
        </div>

        <p>© {new Date().getFullYear()} Kendra Scott, LLC</p>
      </div>
    </footer>
  );
}
